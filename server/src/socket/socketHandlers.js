import fs from "fs";
import jwt from "jsonwebtoken";
import { generateCode } from "../services/aiService.js";
import { executePython } from "../services/pythonService.js";
import { getFileInfo } from "../services/fileService.js";
import { fixColumnNames } from "../services/codeFixer.js";

// Verify socket token
const verifySocketToken = (socket) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      socket.emit("error", { message: "No token provided" });
      return null;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key",
    );
    return decoded;
  } catch (error) {
    socket.emit("error", { message: "Invalid token" });
    return null;
  }
};

export const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    // Verify auth on connection
    const user = verifySocketToken(socket);
    if (!user) {
      socket.disconnect();
      return;
    }

    // Store user info in socket
    socket.user = user;
    console.log(`✓ Client connected: ${socket.id}`);

    // Handle chat/analysis request
    socket.on("analyzeData", async (data) => {
      const { prompt, filePath } = data;

      try {
        // Validate inputs
        if (!filePath || !prompt) {
          socket.emit("error", {
            message: "File and prompt required",
          });
          return;
        }

        if (!prompt.trim()) {
          socket.emit("error", {
            message: "Prompt cannot be empty",
          });
          return;
        }

        // Step 1: Check if file exists
        if (!fs.existsSync(filePath)) {
          socket.emit("error", {
            message: "File not found",
          });
          return;
        }

        // Emit: Starting analysis
        socket.emit("analysisStart", {
          message: "Extracting CSV information...",
        });

        // Step 2: Extract CSV info
        const info = await getFileInfo(filePath);

        if (!info.columns || info.columns.length === 0) {
          socket.emit("error", {
            message: "Invalid CSV file: no columns found",
          });
          return;
        }

        // Emit: CSV extracted
        socket.emit("csvExtracted", {
          columns: info.columns,
          sampleRows: info.sample.length,
        });

        // Step 3: Build AI prompt
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

        // Emit: Generating code
        socket.emit("generatingCode", {
          message: "Generating Python code with Groq AI...",
        });

        // Step 4: Generate Python code using Groq
        let generatedCode = await generateCode(enhancedPrompt);

        // Emit: Code generated (IMPORTANT: Show even if execution fails)
        socket.emit("codeGenerated", {
          code: generatedCode,
          message: "Code generated successfully!",
        });

        // Step 5: Fix column names in generated code
        generatedCode = fixColumnNames(generatedCode, info.columns);

        // Emit: Executing code
        socket.emit("executingCode", {
          message: "Executing code...",
        });

        // Step 6: Execute Python code with CSV file
        try {
          const result = await executePython(filePath, generatedCode);

          // Check if execution was successful
          if (result.error) {
            socket.emit("executionError", {
              code: generatedCode,
              error: result.error,
              message: "Execution error, but code was generated",
            });
          } else {
            // Emit: Results ready
            socket.emit("resultReady", {
              code: generatedCode,
              data: result.text || "No output",
              plot: result.plot || null,
              message: "Analysis completed successfully!",
            });
          }
        } catch (pythonError) {
          // Python service error, but code is already shown
          console.error("Python execution error:", pythonError.message);
          socket.emit("executionError", {
            code: generatedCode,
            error: pythonError.message,
            message:
              "Python service unavailable, but code was generated successfully!",
          });
        }
      } catch (err) {
        console.error("Socket analysis error:", err);
        socket.emit("error", {
          message: err.message || "Analysis failed. Please try again.",
        });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`✗ Client disconnected: ${socket.id}`);
    });
  });
};
