import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { atomone } from "@uiw/codemirror-theme-atomone";

export default function ResultsPanel({ isDark, response }) {
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

            {response.data && (
              <div>
                <h3
                  className={`mb-3 font-bold ${isDark ? "text-warm-200" : "text-warm-700"}`}
                >
                  Results:
                </h3>
                <CodeMirror
                  value={
                    typeof response.data === "string"
                      ? response.data
                      : JSON.stringify(response.data, null, 2)
                  }
                  height="auto"
                  extensions={[json()]}
                  theme={isDark ? atomone : "light"}
                  editable={false}
                  basicSetup={{
                    lineNumbers: true,
                    highlightActiveLineGutter: false,
                    foldGutter: true,
                  }}
                />
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
