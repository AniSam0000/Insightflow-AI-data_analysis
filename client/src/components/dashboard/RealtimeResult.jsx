const stageLabels = {
  start: "Starting analysis",
  csvExtracted: "Reading dataset",
  generatingCode: "Generating code",
  codeGenerated: "Code generated",
  executingCode: "Executing Python",
  resultReady: "Results ready",
  executionError: "Execution issue",
};

export default function RealtimeResult({
  isDark,
  response,
  progress,
  loading,
}) {
  const latestStage = progress.length ? progress[progress.length - 1] : null;
  const outputText = response?.data
    ? typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data, null, 2)
    : "";

  return (
    <div
      className={`col-span-1 lg:col-span-2 rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.05]" : "border-blue-200 bg-white shadow-lg"} p-6 backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            className={`font-display text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Real-time Result
          </h2>
          <p
            className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Code appears immediately, and results update as the analysis
            continues
          </p>
        </div>

        {loading && (
          <div
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${isDark ? "border-accent-400/30 bg-accent-400/10 text-accent-200" : "border-accent-300 bg-accent-50 text-accent-700"}`}
          >
            {stageLabels[latestStage?.type] || "Working"}
          </div>
        )}
      </div>

      <div
        className={`mt-6 max-h-[620px] space-y-6 overflow-y-auto rounded-lg border ${isDark ? "border-white/10 bg-slate-950/50" : "border-blue-100 bg-blue-50/50"} p-4 text-sm`}
      >
        {response ? (
          <>
            {response.code && (
              <div>
                <h3
                  className={`mb-3 font-bold ${isDark ? "text-accent-200" : "text-blue-900"}`}
                >
                  Generated Code:
                </h3>
                <div className={`rounded-lg border overflow-hidden shadow-lg ${isDark ? "border-white/10 bg-slate-900" : "border-blue-300 bg-slate-50"}`}>
                  <pre className={`p-4 font-mono text-sm leading-relaxed overflow-x-auto ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    <code>{response.code}</code>
                  </pre>
                </div>
              </div>
            )}

            {loading && !response.code && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${isDark ? "border-white/10 bg-white/[0.03] text-slate-300" : "border-blue-200 bg-blue-50 text-slate-700"}`}
              >
                Waiting for generated code...
              </div>
            )}

            {response.executionError && (
              <div
                className={`rounded-lg border p-3 text-sm ${isDark ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" : "border-orange-200 bg-orange-50 text-orange-700"}`}
              >
                {response.executionError}
              </div>
            )}

            {response.data && (
              <div>
                <h3
                  className={`mb-3 font-bold ${isDark ? "text-warm-200" : "text-slate-900"}`}
                >
                  Python Output:
                </h3>
                <div className="overflow-x-auto pb-2">
                  <pre
                    className={`min-w-max whitespace-pre rounded-lg border p-4 font-mono text-sm ${isDark ? "border-white/10 bg-white/[0.03] text-slate-200" : "border-blue-200 bg-white text-slate-800"}`}
                  >
                    {outputText}
                  </pre>
                </div>
              </div>
            )}

            {response.plot && (
              <div>
                <h3
                  className={`mb-3 font-bold ${isDark ? "text-warm-200" : "text-slate-900"}`}
                >
                  Plot:
                </h3>
                <div
                  className={`overflow-hidden rounded-lg border p-3 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-blue-200 bg-blue-50"}`}
                >
                  <img
                    src={`data:image/png;base64,${response.plot}`}
                    alt="Python analysis plot"
                    className="h-auto w-full rounded-md"
                  />
                </div>
              </div>
            )}

            {loading &&
              response.code &&
              !response.data &&
              !response.executionError && (
                <div
                  className={`rounded-lg border px-4 py-3 text-sm ${isDark ? "border-white/10 bg-white/[0.03] text-slate-300" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  Generated code is ready. Running Python execution now...
                </div>
              )}
          </>
        ) : (
          <div
            className={`flex h-64 items-center justify-center text-center ${isDark ? "text-slate-500" : "text-slate-400"}`}
          >
            <p>Upload a CSV file and enter a prompt to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
}
