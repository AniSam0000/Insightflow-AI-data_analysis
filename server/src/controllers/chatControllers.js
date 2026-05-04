import fs from "fs";
import { generateCode } from "../services/aiService.js";
import { executePython } from "../services/pythonService.js";
import { getFileInfo } from "../services/fileService.js";
import { fixColumnNames } from "../services/codeFixer.js";

export const handleChat = async (req, res) => {
  let filePath = null;
  try {
    const file = req.file;
    const prompt = req.body.prompt;
    filePath = file?.path;

    // Validate inputs
    if (!file || !prompt) {
      return res.status(400).json({
        error: "File and prompt required",
      });
    }

    if (!prompt.trim()) {
      return res.status(400).json({
        error: "Prompt cannot be empty",
      });
    }

    // Step 1: Extract CSV info
    const info = await getFileInfo(file.path);

    if (!info.columns || info.columns.length === 0) {
      return res.status(400).json({
        error: "Invalid CSV file: no columns found",
      });
    }

    // Step 2: Build AI prompt
    const enhancedPrompt = `
Dataset Columns:
${info.columns.join(", ")}

Sample Rows:
${JSON.stringify(info.sample)}

User Request:
${prompt}

Generate ONLY Python code.
Do not include any import statements.
Assume pd, np, plt, sns, and df are already available.
Prefer short pandas operations.
Do not create plots unless the user explicitly asks for a visualization.
If calculating correlations, use only numeric columns (df.select_dtypes(include="number")).
`;

    // Step 3: Generate Python code using Groq
    let generatedCode = await generateCode(enhancedPrompt);

    // Step 4: Fix column names in generated code
    generatedCode = fixColumnNames(generatedCode, info.columns);

    // Step 5: Execute Python code with CSV file
    const result = await executePython(file.path, generatedCode);

    // Success response
    res.json({
      success: true,
      code: generatedCode,
      data: result,
      message: "Analysis completed successfully",
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Analysis failed. Please try again.",
    });
  } finally {
    // Cleanup uploaded file
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr.message);
      }
    }
  }
};

// Handle file upload for WebSocket analysis (just save and return path)
export const handleFileUpload = async (req, res) => {
  try {
    const file = req.file;

    // Validate file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "File required",
      });
    }

    // Validate file type (CSV only)
    const fileName = file.originalname || "";
    if (!fileName.toLowerCase().endsWith(".csv")) {
      // Cleanup file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Cleanup error:", err.message);
      }
      return res.status(400).json({
        success: false,
        error: "Only CSV files are supported",
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      // Cleanup file
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Cleanup error:", err.message);
      }
      return res.status(400).json({
        success: false,
        error: "File size must be less than 5MB",
      });
    }

    // Return file path for socket analysis
    res.json({
      success: true,
      filePath: file.path,
      fileName: fileName,
      message: "File uploaded successfully",
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "File upload failed",
    });
  }
};
