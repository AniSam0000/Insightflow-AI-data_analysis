# pyright: reportMissingImports=false, reportMissingModuleSource=false
import multiprocessing
import os
import base64
import io
import sys
import traceback

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

try:
    import resource
except ImportError:
    resource = None

MEMORY_LIMIT_MB = int(os.getenv("EXECUTION_MEMORY_MB", "0"))


def run_code(queue, code, file_path):
    try:
        # Optional memory limit (disabled by default)
        try:
            if resource is not None and MEMORY_LIMIT_MB > 0:
                limit_bytes = MEMORY_LIMIT_MB * 1024 * 1024
                resource.setrlimit(resource.RLIMIT_AS, (limit_bytes, limit_bytes))
        except:
            pass  # ignore on Windows

        from app.sandbox import safe_exec

        # Show full tables/matrices instead of pandas truncating with ...
        pd.set_option("display.max_columns", None)
        pd.set_option("display.max_rows", None)
        pd.set_option("display.width", 0)
        pd.set_option("display.expand_frame_repr", False)
        pd.set_option("display.max_colwidth", None)

        # Capture output
        output_buffer = io.StringIO()
        sys.stdout = output_buffer

        # Load dataset based on file extension
        file_ext = file_path.split(".")[-1].lower()
        if file_ext == "xlsx":
            df = pd.read_excel(file_path)
        else:
            df = pd.read_csv(file_path)

        # Execution context
        local_vars = {
            "pd": pd,
            "np": np,
            "plt": plt,
            "sns": sns,
            "df": df
        }

        # Basic safety filter
        blocked = ["import os", "import sys", "subprocess", "open(", "__import__", "eval(", "exec("]
        for word in blocked:
            if word in code:
                queue.put({
                    "text": "",
                    "plot": None,
                    "error": f"Blocked unsafe code: {word}"
                })
                return

        # Execute code
        safe_exec(code, local_vars)

        # Get output
        output_text = output_buffer.getvalue().strip()

        # Auto fallback output
        if not output_text:
            if "result" in local_vars:
                output_text = str(local_vars["result"])
            else:
                output_text = str(df.head())

        # Handle plots
        plot_base64 = None
        if plt is not None and plt.get_fignums():
            img_buffer = io.BytesIO()
            plt.savefig(img_buffer, format="png", bbox_inches="tight")
            img_buffer.seek(0)
            plot_base64 = base64.b64encode(img_buffer.read()).decode()
            plt.close("all")

        queue.put({
            "text": output_text,
            "plot": plot_base64,
            "error": None
        })

    except Exception:
        queue.put({
            "text": "",
            "plot": None,
            "error": traceback.format_exc()
        })


def execute_code(code: str, file_path: str, timeout=120):
    queue = multiprocessing.Queue()

    process = multiprocessing.Process(
        target=run_code,
        args=(queue, code, file_path)
    )

    process.start()
    process.join(timeout)

    # ⏱️ Timeout handling
    if process.is_alive():
        process.terminate()
        return {
            "text": "",
            "plot": None,
            "error": f"Execution timed out ({timeout}s limit)"
        }

    # Return result
    if not queue.empty():
        return queue.get()
    else:
        return {
            "text": "",
            "plot": None,
            "error": "No output returned"
        }