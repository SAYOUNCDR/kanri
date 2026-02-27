import { useState } from "react";
import Button from "../components/reusables/Button";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add actual API login logic here
    console.log("Logging in with", email, password);
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
          <p className="text-sm text-center text-zinc-500 mt-1">
            Enter your credentials to access your account.
          </p>
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
            <Button className="w-full py-2.5 flex justify-center text-sm shadow-sm">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
