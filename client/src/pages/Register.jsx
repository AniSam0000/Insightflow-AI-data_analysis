import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(fullName, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(authError || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="font-display text-3xl font-bold text-white">Register</h1>
        <p className="mt-2 text-sm text-slate-400">
          Create a new InsightFlow AI account
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aniket Samanta"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white outline-none transition placeholder:text-slate-500 focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-warm-300 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-warm-200 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-accent-300 transition hover:text-accent-200"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
