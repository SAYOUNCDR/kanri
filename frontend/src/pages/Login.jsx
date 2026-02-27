import { useState } from "react";
import Button from "../components/reusables/Button";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);

      // Decode the token to discover the role
      const decodedToken = jwtDecode(data.accessToken);

      if (decodedToken.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please true again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans px-4 relative">
      <div className="absolute inset-0 z-0">
        <img
          src="/Landing.png"
          alt="Scenic landscape"
          className="w-full h-full object-cover"
        />
        {/* Soft black overlay across the entire image to ensure form readability */}
        <div className="absolute inset-0 bg-black/15"></div>
      </div>

      {/* Back Button - Top Right Absolute */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 text-sm font-medium text-white/80 hover:text-white transition-colors flex items-center gap-1 z-20 px-4 py-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm cursor-pointer"
      >
        ← Back
      </button>

      <div className="relative z-10 bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 w-full max-w-md">
        <div className="mb-15">
          <h2 className="text-2xl font-bold text-center  text-zinc-900 mt-2">
            Welcome back
          </h2>
          <p className="text-sm text-center text-zinc-500 mt-1 mb-4">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 text-center animate-pulse">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-10">
          <div>
            <label
              className="block text-sm font-medium text-zinc-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all"
              placeholder="you@mail.com"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-zinc-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              className="w-full py-2.5 flex justify-center text-sm shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
