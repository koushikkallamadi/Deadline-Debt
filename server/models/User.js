const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // --- Gamification Stats ---
    stats: {
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastStudyDate: { type: Date, default: null },
        tasksCompleted: { type: Number, default: 0 },
        topicsCompleted: { type: Number, default: 0 },
        totalDebtCleared: { type: Number, default: 0 }
    },
    // --- Unlocked Achievements ---
    achievements: [{
        achievementKey: { type: String },
        unlockedAt: { type: Date, default: Date.now }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
