import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const uploadsDir = path.resolve(__dirname, "../../uploads");

const cleanupOldUploads = () => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return;
    }

    const now = Date.now();
    const entries = fs.readdirSync(uploadsDir);

    for (const entry of entries) {
      const fullPath = path.join(uploadsDir, entry);

      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch {
        continue;
      }

      if (!stats.isFile()) {
        continue;
      }

      const ageMs = now - stats.mtimeMs;
      if (ageMs > UPLOAD_MAX_AGE_MS) {
        try {
          fs.unlinkSync(fullPath);
        } catch (error) {
          console.error(
            `Upload cleanup failed for ${fullPath}:`,
            error.message,
          );
        }
      }
    }
  } catch (error) {
    console.error("Upload cleanup job error:", error.message);
  }
};

export const startUploadCleanupJob = () => {
  // Initial run at startup so stale files are cleaned immediately.
  cleanupOldUploads();

  setInterval(cleanupOldUploads, CLEANUP_INTERVAL_MS);
  console.log(
    `Upload cleanup job started (folder: ${uploadsDir}, maxAge: 1h, interval: 10m)`,
  );
};
