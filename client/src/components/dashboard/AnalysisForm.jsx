export default function AnalysisForm({
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
      className={`rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.05]" : "border-slate-200 bg-white"} p-6 backdrop-blur-xl`}
    >
      <h2
        className={`font-display text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
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
            className={`rounded-lg border p-3 text-sm ${isDark ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-red-300 bg-red-50 text-red-700"}`}
          >
            {error}
          </div>
        )}

        <div>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
          >
            CSV File
          </label>
          <label
            className={`mt-2 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition ${
              isDark
                ? "border-accent-400/40 bg-accent-400/5 hover:bg-accent-400/10"
                : "border-accent-300 bg-accent-50 hover:bg-accent-100"
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
              className={`text-sm ${isDark ? "text-accent-200" : "text-accent-700"}`}
            >
              {fileName || "Click to upload CSV file"}
            </span>
          </label>
        </div>

        <div>
          <label
            className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-700"}`}
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
                : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20"
            }`}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-accent-400 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-accent-300 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
    </div>
  );
}
