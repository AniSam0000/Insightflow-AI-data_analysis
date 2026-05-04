from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

from app.executor import execute_code

app = FastAPI()

# Enable CORS (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "temp"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_EXTENSIONS = ["csv", "xlsx"]
EXECUTION_TIMEOUT = int(os.getenv("EXECUTION_TIMEOUT", "120"))

os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
def root():
    return {"message": "Python Execution Service Running 🚀"}


@app.post("/execute")
async def execute(
    file: UploadFile = File(...),
    code: str = Form(...)
):
    try:
        # 🔹 Extract file extension
        file_ext = file.filename.split(".")[-1].lower()

        # 🔹 Validate file type
        if file_ext not in ALLOWED_EXTENSIONS:
            return {
                "success": False,
                "error": "Invalid file type. Only CSV and XLSX allowed."
            }

        # 🔹 Unique filename
        unique_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(TEMP_DIR, unique_name)

        # 🔹 Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 🔹 Validate file size (AFTER saving)
        file_size = os.path.getsize(file_path)
        if file_size > MAX_FILE_SIZE:
            os.remove(file_path)
            return {
                "success": False,
                "error": "File too large (max 5MB allowed)"
            }

        # 🔹 Execute code
        result = execute_code(code, file_path, timeout=EXECUTION_TIMEOUT)

        # 🔹 Cleanup file
        try:
            os.remove(file_path)
        except:
            pass

        # Return executor result directly (text, plot, error)
        return result

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }