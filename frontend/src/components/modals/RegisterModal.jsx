import { useState } from "react";
import { authService } from "../../services/auth.service";
import Button from "../reusables/Button";

const RegisterModal = ({ isOpen, onClose, onSuccess }) => {
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  if (!isOpen) return null;

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);
    try {
      await authService.registerUser(registerForm);
      setRegisterForm({ username: "", email: "", password: "", role: "user" });
      onSuccess();
      onClose();
    } catch (error) {
      setModalError(error.response?.data?.message || "Registration failed");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Register New User</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-black cursor-pointer"
          >
            ✕
          </button>
        </div>

        {modalError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {modalError}
          </div>
        )}

        <form onSubmit={handleRegisterUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Username
            </label>
            <input
              required
              type="text"
              value={registerForm.username}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, username: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 mb-1">
              Role
            </label>
            <div className="relative">
              <select
                value={registerForm.role}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, role: e.target.value })
                }
                className="w-full appearance-none px-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-zinc-900/10 bg-white cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-1.5 font-medium bg-white text-zinc-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={modalLoading}
              className="flex-1 bg-zinc-900 text-white border-zinc-900"
            >
              {modalLoading ? "Registering..." : "Register User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
