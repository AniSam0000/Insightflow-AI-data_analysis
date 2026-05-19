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

        def build_snapshot():
            try:
                return df.head().to_string()
            except Exception:
                return str(df.head())

        plot_snapshots = []
        original_show = plt.show

        def tracked_show(*args, **kwargs):
            if len(plot_snapshots) < 5:
                plot_snapshots.append(build_snapshot())
            return original_show(*args, **kwargs)

        plt.show = tracked_show

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
        try:
            safe_exec(code, local_vars)
        finally:
            plt.show = original_show

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
        plots_base64 = []
        figure_numbers = plt.get_fignums() if plt is not None else []
        for figure_number in figure_numbers[:5]:
            figure = plt.figure(figure_number)
            img_buffer = io.BytesIO()
            figure.savefig(img_buffer, format="png", bbox_inches="tight")
            img_buffer.seek(0)
            plots_base64.append(base64.b64encode(img_buffer.read()).decode())

        if plots_base64:
            plot_base64 = plots_base64[0]
            plt.close("all")

        # Ensure every plot has a matching snapshot
        figure_numbers = plt.get_fignums() if plt is not None else []
        required_snapshot_count = min(len(figure_numbers), 5)
        while len(plot_snapshots) < required_snapshot_count:
            plot_snapshots.append(build_snapshot())

        if not plot_snapshots:
            plot_snapshots = [build_snapshot()]

        queue.put({
            "text": output_text,
            "plot": plot_base64,
            "plots": plots_base64,
            "snapshot": plot_snapshots[0],
            "snapshots": plot_snapshots[:5],
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
        result = queue.get()
        if result.get("plots") and not result.get("plot"):
            result["plot"] = result["plots"][0]
        return result
    else:
        return {
            "text": "",
            "plot": None,
            "error": "No output returned"
        }