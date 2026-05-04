import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 second timeout for analysis
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: async (fullName, email, password) => {
    const response = await apiClient.post("/auth/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

export const chatAPI = {
  uploadFile: async (file) => {
    // Validate inputs
    if (!file) {
      throw new Error("File is required");
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("Only CSV files are supported");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Invalid file");
      }
      throw error;
    }
  },

  analyzeData: async (file, prompt) => {
    // Validate inputs
    if (!file) {
      throw new Error("File is required");
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error("Prompt is required");
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("Only CSV files are supported");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const response = await apiClient.post("/chat", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.error || "Invalid request");
      }
      if (error.response?.status === 401) {
        throw new Error("Session expired. Please log in again.");
      }
      if (error.response?.status === 500) {
        throw new Error(
          error.response.data?.error || "Server error. Please try again later.",
        );
      }
      throw error;
    }
  },
};

export default apiClient;
