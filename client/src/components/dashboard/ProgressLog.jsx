export default function ProgressLog({ isDark, progress }) {
  if (!progress.length) {
    return null;
  }

  return (
    <div className="mt-6 space-y-2">
      <h3
        className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-800"}`}
      >
        Progress Log:
      </h3>
      <div
        className={`rounded-lg border ${isDark ? "border-white/10 bg-slate-950/50" : "border-blue-200 bg-blue-50/50 shadow-sm"} max-h-40 space-y-1 overflow-y-auto p-3 text-xs`}
      >
        {progress.map((item, index) => (
          <div
            key={`${item.timestamp}-${index}`}
            className={`flex gap-2 ${
              item.type === "error"
                ? isDark
                  ? "text-red-300"
                  : "text-red-600"
                : item.type === "success"
                  ? isDark
                    ? "text-green-300"
                    : "text-green-600"
                  : item.type === "warning"
                    ? isDark
                      ? "text-yellow-300"
                      : "text-yellow-600"
                    : isDark
                      ? "text-slate-300"
                      : "text-slate-600"
            }`}
          >
            <span className="font-mono text-xs">[{item.timestamp}]</span>
            <span>{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
