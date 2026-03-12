import api from './api';

const achievementService = {
    // Get all achievements + user stats + level progress
    getAchievements: async () => {
        const response = await api.get('/achievements');
        return response.data;
    }
};

export default achievementService;
