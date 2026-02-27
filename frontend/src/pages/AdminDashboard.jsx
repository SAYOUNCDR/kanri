import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { taskService } from "../services/task.service";
import { getAccessToken } from "../services/api";
import { jwtDecode } from "jwt-decode";
import Button from "../components/reusables/Button";
import RegisterModal from "../components/modals/RegisterModal";
import AssignTaskModal from "../components/modals/AssignTaskModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [users, setUsers] = useState([]);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (token && !user) {
      setUser(jwtDecode(token));
    }
    fetchTasks();
    fetchAllUsers();
  }, [statusFilter, userIdFilter]);

  const fetchAllUsers = async () => {
    try {
      const usersList = await authService.getAllUsers();
      setUsers(usersList);
    } catch (error) {
      console.error("Failed to fetch users list", error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (userIdFilter) filters.userId = userIdFilter;

      const data = await taskService.getAllTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch all tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen font-sans p-8 relative">
      <div className="absolute inset-0 z-0">
        <img
          src="/Landing.png"
          alt="Scenic landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/15"></div>
      </div>

      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8 relative z-10">
        <div className="flex items-start gap-1 flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">
              Admin Console
            </h1>
          </div>
          <span className="text-sm text-white/70 drop-shadow-sm mt-1">
            {new Date().toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            onClick={handleLogout}
            className="px-5 py-2 text-sm bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md shadow-sm w-full sm:w-auto"
          >
            Logout
          </Button>
          {user && (
            <div className="hidden sm:flex flex-row items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 select-none">
              <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></span>
              <span className="text-sm font-medium text-white">
                {user.username}
              </span>
              <span className="text-xs text-white/60">({user.email})</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 flex-grow max-w-xs">
            <label className="text-sm font-medium text-zinc-800">
              Filter by Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none px-4 pr-10 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
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

          <div className="flex flex-col gap-1.5 flex-grow max-w-sm">
            <label className="text-sm font-medium text-zinc-800">
              Filter by User
            </label>
            <div className="relative">
              <select
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-full appearance-none px-4 pr-10 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-zinc-900 cursor-pointer"
              >
                <option value="">All Users</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.email})
                  </option>
                ))}
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

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={() => setIsRegisterModalOpen(true)}
              className="py-2.5 px-4 bg-zinc-900 hover:bg-black text-white"
            >
              + New User
            </Button>
            <Button
              onClick={() => setIsAssignModalOpen(true)}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border-none"
            >
              + Assign Task
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-zinc-600 animate-pulse font-medium">
              Loading system tasks...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 border-b border-black/5">
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                      Task Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                      Assigned To
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-800">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-800 text-right">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-zinc-600 font-medium"
                      >
                        No tasks found matching these filters.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b border-black/5 hover:bg-white/50 transition-colors"
                      >
                        <td className="px-6 py-4 relative">
                          <div className="font-medium text-zinc-900">
                            {task.title}
                          </div>
                          <div className="text-xs text-zinc-500 truncate max-w-xs">
                            {task.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-zinc-800">
                          {task.user?.username || "Unassigned"}
                          <div className="text-xs text-zinc-400 font-normal">
                            {task.user?._id || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                            {task.user?.role || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {task.status.charAt(0).toUpperCase() +
                              task.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500 text-right">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={fetchAllUsers}
      />

      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={fetchTasks}
        users={users}
      />
    </div>
  );
};

export default AdminDashboard;
