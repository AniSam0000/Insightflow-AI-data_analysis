import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      // If already connected, just return it
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      // If connecting, wait (prevent duplicate connections during React StrictMode)
      if (this.socket && !this.socket.connected && this.socket.connecting) {
        const checkConnected = setInterval(() => {
          if (this.socket.connected) {
            clearInterval(checkConnected);
            resolve(this.socket);
          }
        }, 100);
        return;
      }

      // Create new connection
      this.socket = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      this.socket.on("connect", () => {
        resolve(this.socket);
      });

      this.socket.on("error", (error) => {
        reject(new Error(error?.message || "Socket error"));
      });

      this.socket.on("connect_error", (error) => {
        reject(new Error(error?.message || "Connection error"));
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  startAnalysis({ filePath, prompt, onEvent, onError, onComplete }) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    const eventHandlers = {
      analysisStart: (data) => onEvent?.({ type: "start", ...data }),
      csvExtracted: (data) => onEvent?.({ type: "csvExtracted", ...data }),
      generatingCode: (data) => onEvent?.({ type: "generatingCode", ...data }),
      codeGenerated: (data) => onEvent?.({ type: "codeGenerated", ...data }),
      executingCode: (data) => onEvent?.({ type: "executingCode", ...data }),
      resultReady: (data) => {
        onEvent?.({ type: "resultReady", ...data });
        onComplete?.(data);
      },
      executionError: (data) => {
        onEvent?.({ type: "executionError", ...data });
        onComplete?.(data);
      },
      error: (data) => {
        onEvent?.({ type: "error", ...data });
        onError?.(new Error(data.message || "Analysis failed"));
      },
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      this.socket.on(event, handler);
    });

    this.socket.emit("analyzeData", {
      filePath,
      prompt,
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        this.socket.off(event, handler);
      });
    };
  }

  removeAllListeners() {
    if (!this.socket) return;

    this.socket.removeAllListeners("analysisStart");
    this.socket.removeAllListeners("csvExtracted");
    this.socket.removeAllListeners("generatingCode");
    this.socket.removeAllListeners("codeGenerated");
    this.socket.removeAllListeners("executingCode");
    this.socket.removeAllListeners("resultReady");
    this.socket.removeAllListeners("executionError");
    this.socket.removeAllListeners("error");
  }
}

export default new SocketService();
