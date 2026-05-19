import { useEffect, useState } from "react";
import { chatAPI } from "../services/api";
import socketService from "../services/socket";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function useDashboardAnalysis() {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState([]);

  const addProgress = (message, type = "info") => {
    setProgress((prev) => [
      ...prev,
      { message, type, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    socketService.connect(token);

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are supported");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);
    setUploadedFilePath(null);
    setResponse(null);
    addProgress(`File selected: ${selectedFile.name}`, "success");

    try {
      const uploadResult = await chatAPI.uploadFile(selectedFile);
      setUploadedFilePath(uploadResult.filePath);
      addProgress("File uploaded successfully", "success");
    } catch (uploadError) {
      setError(uploadError.message);
      addProgress(uploadError.message, "error");
      setFile(null);
      setUploadedFilePath(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProgress([]);

    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    if (!uploadedFilePath) {
      setError("File upload incomplete. Please try uploading again.");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter an analysis prompt.");
      return;
    }

    if (prompt.trim().length < 5) {
      setError("Prompt must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    setResponse(null);
    addProgress("Starting analysis...", "info");

    try {
      let cleanup = null;
      cleanup = socketService.startAnalysis({
        filePath: uploadedFilePath,
        prompt,
        onEvent: (event) => {
          switch (event.type) {
            case "start":
            case "generatingCode":
            case "executingCode":
              addProgress(event.message, "info");
              break;
            case "csvExtracted":
              addProgress(
                `CSV extracted: ${event.columns?.length || 0} columns, ${event.sampleRows || 0} rows`,
                "info",
              );
              break;
            case "codeGenerated":
              addProgress("Code generated successfully", "success");
              setResponse((current) => ({
                ...(current || {}),
                code: event.code || "",
              }));
              break;
            case "resultReady":
              addProgress("Analysis completed successfully", "success");
              setResponse((current) => ({
                ...(current || {}),
                code: event.code || current?.code || "",
                data: event.data,
                plot: event.plot || null,
                plots: event.plots || (event.plot ? [event.plot] : []),
                snapshot: event.snapshot || current?.snapshot || null,
                snapshots:
                  event.snapshots ||
                  (event.snapshot
                    ? [event.snapshot]
                    : current?.snapshots || []),
                imageUrl: event.imageUrl || current?.imageUrl || null,
              }));
              break;
            case "executionError":
              addProgress(event.message, "warning");
              setResponse((current) => ({
                ...(current || {}),
                code: event.code || current?.code || "",
                executionError: event.error || event.message,
              }));
              break;
            case "error":
              addProgress(event.message, "error");
              break;
            default:
              break;
          }
        },
        onError: (analysisError) => {
          cleanup?.();
          setError(analysisError.message);
          setLoading(false);
        },
        onComplete: () => {
          cleanup?.();
          setLoading(false);
        },
      });
    } catch (analysisError) {
      setError(analysisError.message);
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    file,
    loading,
    response,
    error,
    progress,
    handleFileChange,
    handleSubmit,
  };
}
