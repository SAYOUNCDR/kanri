import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { taskService } from "../services/task.service";
import { getAccessToken } from "../services/api";
import { jwtDecode } from "jwt-decode";
import Button from "../components/reusables/Button";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setUser(jwtDecode(token));
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getMyTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId, currentStatus) => {
    // Only allow updating from pending -> completed for now
    if (currentStatus === "completed") return;

    try {
      // Optimistic UI update
      setTasks(
        tasks.map((t) =>
          t._id === taskId ? { ...t, status: "completed" } : t,
        ),
      );
      await taskService.updateTaskStatus(taskId, "completed");
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert on failure
      fetchTasks();
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
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            My Assigned Tasks
          </h1>
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 select-none">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-sm font-medium text-white">
                {user.username}
              </span>
              <span className="text-xs text-white/60">({user.email})</span>
            </div>
          )}
        </div>
        <Button
          onClick={handleLogout}
          className="px-5 py-2 text-sm bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-md shadow-sm"
        >
          Logout
        </Button>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {loading ? (
          <div className="text-center py-12 text-white/80 animate-pulse font-medium">
            Loading your tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              You're all caught up!
            </h3>
            <p className="text-zinc-500">
              You don't have any tasks assigned to you right now.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg text-zinc-900">
                    {task.title}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
                <p className="text-zinc-600 text-sm flex-grow mb-6">
                  {task.description}
                </p>

                <Button
                  onClick={() => handleStatusUpdate(task._id, task.status)}
                  disabled={task.status === "completed"}
                  className={`w-full py-2.5 text-sm ${
                    task.status === "completed"
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed hidden"
                      : "bg-zinc-900 text-white"
                  }`}
                >
                  Mark as Completed
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
