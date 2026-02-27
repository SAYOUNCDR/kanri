import api from "./api";

export const taskService = {
  getMyTasks: async () => {
    const response = await api.get("/tasks/my-tasks");
    return response.data;
  },
  updateTaskStatus: async (taskId, newStatus) => {
    const response = await api.patch(`/tasks/${taskId}`, { status: newStatus });
    return response.data;
  },
  getAllTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/tasks/all${queryParams ? `?${queryParams}` : ""}`;

    const response = await api.get(endpoint);
    return response.data;
  },
  assignTask: async (taskData) => {
    const response = await api.post("/tasks/assign-task", taskData);
    return response.data;
  },
};
