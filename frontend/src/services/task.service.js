import api from './api';

export const taskService = {
    // -------- Shared/User Routes --------

    // Get tasks only belonging to the logged in user
    getMyTasks: async () => {
        const response = await api.get('/tasks/my-tasks');
        return response.data;
    },

    // Update status from "pending" to "completed"
    updateTaskStatus: async (taskId, newStatus) => {
        const response = await api.patch(`/tasks/${taskId}`, { status: newStatus });
        return response.data;
    },


    // -------- Admin Only Routes --------

    // Get ALL tasks in the system. Optionally filters by userId or status
    getAllTasks: async (filters = {}) => {
        // filters can be { status: 'pending', userId: '1234...' }
        const queryParams = new URLSearchParams(filters).toString();
        const endpoint = `/tasks/all${queryParams ? `?${queryParams}` : ''}`;

        const response = await api.get(endpoint);
        return response.data;
    },

    // Assign a completely new task to a specific username
    assignTask: async (taskData) => {
        // taskData should be { title, description, assignedUser }
        const response = await api.post('/tasks/assign-task', taskData);
        return response.data;
    }
};
