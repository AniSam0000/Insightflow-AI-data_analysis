export default function AnalysisCommand({
  isDark,
  error,
  fileName,
  prompt,
  loading,
  onFileChange,
  onPromptChange,
  onSubmit,
}) {
  return (
    <div
      className={`rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.05]" : "border-blue-200 bg-white shadow-lg"} p-6 backdrop-blur-xl`}
    >
      <h2
        className={`font-display text-xl font-bold ${isDark ? "text-white" : "text-blue-900"}`}
      >
        Analysis Command
      </h2>
      <p
        className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
      >
        Upload a CSV file and describe what you want to analyze
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {error && (
          <div
            className={`rounded-lg border p-3 text-sm ${isDark ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-red-300 bg-red-50 text-red-700 shadow-sm"}`}
          >
            {error}
          </div>
        )}

        <div>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
          >
            CSV File
          </label>
          <label
            className={`mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition ${
              isDark
                ? "border-accent-400/40 bg-accent-400/5 hover:bg-accent-400/10"
                : "border-blue-300 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            <input
              type="file"
              accept=".csv"
              onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              disabled={loading}
              className="hidden"
            />
            <span
              className={`text-sm ${isDark ? "text-accent-200" : "text-blue-700"}`}
            >
              {fileName || "Click to upload CSV file"}
            </span>
          </label>
        </div>

        <div>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
          >
            Analysis Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="e.g., Show me summary statistics and visualize the distribution..."
            rows={6}
            disabled={loading}
            className={`mt-2 w-full rounded-lg border px-3 py-2 outline-none transition disabled:opacity-50 ${
              isDark
                ? "border-white/10 bg-white/[0.05] text-white placeholder:text-slate-500 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                : "border-blue-300 bg-blue-50/50 text-slate-900 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 shadow-md hover:shadow-lg"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
