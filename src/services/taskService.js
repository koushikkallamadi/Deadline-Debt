import api from './api';

const taskService = {
    // Get all tasks for logged in user
    getTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },

    // Create new task - returns { task, newAchievements }
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        // Backend now returns { task, newAchievements }
        return response.data.task ?? response.data;
    },

    // Update task - returns { task, newAchievements }
    updateTask: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data.task ?? response.data;
    },

    // Delete task
    deleteTask: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};

export default taskService;

