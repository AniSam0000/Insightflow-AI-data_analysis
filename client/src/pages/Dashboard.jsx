import { useAuth } from "../contexts/AuthContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useNavigate } from "react-router-dom";
import AnalysisCommand from "../components/dashboard/AnalysisCommand.jsx";
import ProgressLog from "../components/dashboard/ProgressLog.jsx";
import RealtimeResult from "../components/dashboard/RealtimeResult.jsx";
import { useDashboardAnalysis } from "../hooks/useDashboardAnalysis.js";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const {
    prompt,
    setPrompt,
    file,
    loading,
    response,
    error,
    progress,
    handleFileChange,
    handleSubmit,
  } = useDashboardAnalysis();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"}`}
    >
      <header
        className={`border-b ${isDark ? "border-white/10 bg-white/[0.02] text-white" : "border-blue-100 bg-white/80 text-slate-900 shadow-sm"} backdrop-blur-xl`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="font-display text-2xl font-bold">InsightFlow AI</h1>
            <p
              className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Welcome, {user?.fullName || "User"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                isDark
                  ? "border border-white/10 bg-white/8 text-slate-100 hover:bg-white/12"
                  : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm"
              }`}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={handleLogout}
              className={`rounded-lg px-4 py-2 font-medium transition ${
                isDark
                  ? "border border-rose-400/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                  : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 shadow-sm"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <AnalysisCommand
              isDark={isDark}
              error={error}
              fileName={file?.name}
              prompt={prompt}
              loading={loading}
              onFileChange={handleFileChange}
              onPromptChange={setPrompt}
              onSubmit={handleSubmit}
            />
            <ProgressLog isDark={isDark} progress={progress} />
          </div>

          <RealtimeResult
            isDark={isDark}
            response={response}
            progress={progress}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}
