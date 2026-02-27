import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { taskService } from "../services/task.service";
import Button from "../components/reusables/Button";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  useEffect(() => {
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
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <span className="text-xl">✳</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Admin Console
          </h1>
        </div>
        <Button
          onClick={handleLogout}
          className="px-5 py-2 text-sm bg-white text-black border-gray-300 hover:bg-gray-100"
        >
          Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 flex-grow max-w-xs">
            <label className="text-sm font-medium text-zinc-700">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 flex-grow max-w-sm">
            <label className="text-sm font-medium text-zinc-700">
              Filter by User ID
            </label>
            <input
              type="text"
              placeholder="Enter exact User MongoDB ID..."
              value={userIdFilter}
              onChange={(e) => setUserIdFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>

          <Button onClick={fetchTasks} className="py-2.5 px-6 ml-auto">
            Refresh Data
          </Button>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-zinc-500 animate-pulse">
              Loading system tasks...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-600">
                      Task Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-600">
                      Assigned To
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-600">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-zinc-600 text-right">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-zinc-500"
                      >
                        No tasks found matching these filters.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr
                        key={task._id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
