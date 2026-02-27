import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { taskService } from "../services/task.service";
import { getAccessToken } from "../services/api";
import { jwtDecode } from "jwt-decode";
import Button from "../components/reusables/Button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (token && !user) {
      setUser(jwtDecode(token));
    }
    fetchTasks();
  }, [statusFilter, userIdFilter]); // Re-fetch whenever filters change

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Build the filter object based on current state
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
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Landing.png"
          alt="Scenic landscape"
          className="w-full h-full object-cover"
        />
        {/* Soft black overlay to ensure form readability */}
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
        {/* Filters Section */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/40 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 flex-grow max-w-xs">
            <label className="text-sm font-medium text-zinc-800">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-grow max-w-sm">
            <label className="text-sm font-medium text-zinc-800">
              Filter by User ID
            </label>
            <input
              type="text"
              placeholder="Enter exact User MongoDB ID..."
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/50 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-zinc-900"
            />
          </div>

          <Button onClick={fetchTasks} className="py-2.5 px-6 ml-auto">
            Refresh Data
          </Button>
        </div>

        {/* Data Table Section */}
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
    </div>
  );
};

export default AdminDashboard;
