import axios from "axios";
import FormData from "form-data";
import fs from "fs";

// Use docker service name when running in containers, otherwise localhost
const PYTHON_SERVICE_URL =
  process.env.PYTHON_SERVICE_URL || "http://localhost:8000";

export const executePython = async (filePath, code) => {
  try {
    const form = new FormData();

    form.append("file", fs.createReadStream(filePath));
    form.append("code", code);

    const response = await axios.post(
      `${PYTHON_SERVICE_URL}/execute`,
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 60000, // 60 second timeout
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Python service error: " + error.message);
  }
};
