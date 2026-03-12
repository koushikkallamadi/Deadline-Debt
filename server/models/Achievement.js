const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['tasks', 'streak', 'xp', 'mastery', 'special'],
        default: 'tasks'
    },
    xpReward: {
        type: Number,
        default: 50
    },
    // Criteria for unlocking
    criteria: {
        type: {
            type: String, // 'tasksCompleted', 'streakDays', 'xpEarned', 'topicsCompleted', 'debtCleared'
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    }
});

module.exports = mongoose.model('Achievement', AchievementSchema);
