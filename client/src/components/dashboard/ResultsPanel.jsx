import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { atomone } from "@uiw/codemirror-theme-atomone";

export default function ResultsPanel({ isDark, response }) {
  const dataOutputs = response?.dataOutputs?.length
    ? response.dataOutputs
    : response?.data
      ? [response.data]
      : [];

  const outputs = dataOutputs;

  const plots = (
    response?.plots?.length
      ? response.plots
      : response?.plot
        ? [response.plot]
        : []
  ).map((p) =>
    p && p.startsWith && p.startsWith("http")
      ? p
      : `data:image/png;base64,${p}`,
  );

  return (
    <div
      className={`col-span-1 lg:col-span-2 rounded-2xl border ${isDark ? "border-white/10 bg-white/[0.05]" : "border-slate-200 bg-white"} p-6 backdrop-blur-xl`}
    >
      <h2
        className={`font-display text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}
      >
        Real-time Results
      </h2>
      <p
        className={`mt-1 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
      >
        Generated code and outputs will appear here in real-time
      </p>

      <div
        className={`mt-6 max-h-[600px] space-y-6 overflow-y-auto rounded-lg border ${isDark ? "border-white/10 bg-slate-950/50" : "border-slate-200 bg-slate-50"} p-4 font-mono text-sm`}
      >
        {response ? (
          <>
            {response.code && (
              <div>
                <h3
                  className={`mb-3 font-bold ${isDark ? "text-accent-200" : "text-accent-700"}`}
                >
                  Generated Code:
                </h3>
                <CodeMirror
                  value={response.code}
                  height="250px"
                  extensions={[python()]}
                  theme={isDark ? atomone : "light"}
                  editable={false}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: true,
                    foldGutter: true,
                    dropCursor: true,
                    allowMultipleSelections: true,
                    indentOnInput: true,
                    bracketMatching: true,
                    closeBrackets: false,
                    autocompletion: false,
                    rectangularSelection: true,
                    highlightSelectionMatches: true,
                    searchKeymap: true,
                  }}
                />
              </div>
            )}

            {response.executionError && (
              <div
                className={`rounded-lg border p-3 text-sm ${isDark ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200" : "border-yellow-300 bg-yellow-50 text-yellow-700"}`}
              >
                {response.executionError}
              </div>
            )}

            {(() => {
              const outs = outputs || [];
              const imgs = plots || [];
              const total = Math.max(outs.length, imgs.length);
              if (total === 0) return null;

              return (
                <div>
                  <h3
                    className={`mb-3 font-bold ${isDark ? "text-warm-200" : "text-warm-700"}`}
                  >
                    Results
                  </h3>
                  <div className="space-y-4">
                    {Array.from({ length: total }).map((_, i) => (
                      <div key={`res-block-${i}`} className="space-y-3">
                        {outs[i] !== undefined && (
                          <div
                            className={`overflow-x-auto rounded-lg border px-4 py-2 font-mono text-sm whitespace-pre ${isDark ? "border-white/10 bg-white/[0.03] text-slate-200" : "border-slate-200 bg-white text-slate-800"}`}
                          >
                            {typeof outs[i] === "string"
                              ? outs[i]
                              : JSON.stringify(outs[i], null, 2)}
                          </div>
                        )}

                        {imgs[i] !== undefined && (
                          <div
                            className={`overflow-hidden rounded-lg border p-3 ${isDark ? "border-white/10 bg-white/[0.03]" : "border-blue-200 bg-blue-50"}`}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <span
                                className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}
                              >
                                Plot {i + 1}
                              </span>
                            </div>
                            <img
                              src={imgs[i]}
                              alt={`Result plot ${i + 1}`}
                              className="h-auto w-full rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
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
