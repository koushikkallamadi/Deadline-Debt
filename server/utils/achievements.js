const User = require('../models/User');

// XP required per level (level 1 → 2 = 100xp, 2 → 3 = 200xp, etc.)
const xpForLevel = (level) => level * 100;

// Compute level from total XP
const computeLevel = (xp) => {
    let level = 1;
    let remaining = xp;
    while (remaining >= xpForLevel(level)) {
        remaining -= xpForLevel(level);
        level++;
    }
    return level;
};

// All possible achievements
const ACHIEVEMENTS = [
    // Tasks
    { key: 'first_task', title: 'First Steps', description: 'Create your first task', icon: '🚀', category: 'tasks', xpReward: 50, rarity: 'common', criteria: { type: 'tasksCreated', value: 1 } },
    { key: 'task_5', title: 'Getting Serious', description: 'Complete 5 tasks', icon: '⚡', category: 'tasks', xpReward: 100, rarity: 'common', criteria: { type: 'tasksCompleted', value: 5 } },
    { key: 'task_10', title: 'Momentum Builder', description: 'Complete 10 tasks', icon: '🔥', category: 'tasks', xpReward: 200, rarity: 'rare', criteria: { type: 'tasksCompleted', value: 10 } },
    { key: 'task_25', title: 'Task Warrior', description: 'Complete 25 tasks', icon: '⚔️', category: 'tasks', xpReward: 500, rarity: 'epic', criteria: { type: 'tasksCompleted', value: 25 } },
    { key: 'task_50', title: 'Legendary Scholar', description: 'Complete 50 tasks', icon: '👑', category: 'tasks', xpReward: 1000, rarity: 'legendary', criteria: { type: 'tasksCompleted', value: 50 } },
    // Topics
    { key: 'topics_10', title: 'Topic Tackler', description: 'Complete 10 topics', icon: '📚', category: 'mastery', xpReward: 100, rarity: 'common', criteria: { type: 'topicsCompleted', value: 10 } },
    { key: 'topics_50', title: 'Knowledge Hunter', description: 'Complete 50 topics', icon: '🦅', category: 'mastery', xpReward: 300, rarity: 'rare', criteria: { type: 'topicsCompleted', value: 50 } },
    { key: 'topics_100', title: 'Grand Master', description: 'Complete 100 topics', icon: '🎓', category: 'mastery', xpReward: 750, rarity: 'epic', criteria: { type: 'topicsCompleted', value: 100 } },
    // Streaks
    { key: 'streak_3', title: 'On A Roll', description: 'Maintain a 3-day streak', icon: '🌟', category: 'streak', xpReward: 75, rarity: 'common', criteria: { type: 'streakDays', value: 3 } },
    { key: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', category: 'streak', xpReward: 200, rarity: 'rare', criteria: { type: 'streakDays', value: 7 } },
    { key: 'streak_30', title: 'Unstoppable', description: 'Maintain a 30-day streak', icon: '💎', category: 'streak', xpReward: 1000, rarity: 'legendary', criteria: { type: 'streakDays', value: 30 } },
    // XP
    { key: 'xp_500', title: 'XP Seeker', description: 'Earn 500 XP', icon: '✨', category: 'xp', xpReward: 100, rarity: 'common', criteria: { type: 'xpEarned', value: 500 } },
    { key: 'xp_2000', title: 'XP Hunter', description: 'Earn 2,000 XP', icon: '💫', category: 'xp', xpReward: 300, rarity: 'rare', criteria: { type: 'xpEarned', value: 2000 } },
    { key: 'xp_10000', title: 'XP Legend', description: 'Earn 10,000 XP', icon: '🌠', category: 'xp', xpReward: 1000, rarity: 'legendary', criteria: { type: 'xpEarned', value: 10000 } },
    // Special
    { key: 'debt_defender', title: 'Debt Defender', description: 'Clear your first full task debt', icon: '🛡️', category: 'special', xpReward: 150, rarity: 'rare', criteria: { type: 'tasksCompleted', value: 1 } },
    { key: 'night_owl', title: 'Night Owl', description: 'Reach Level 5', icon: '🦉', category: 'special', xpReward: 500, rarity: 'epic', criteria: { type: 'level', value: 5 } },
];

/**
 * Award XP, update streak, and check for new achievements.
 * Returns list of newly unlocked achievements.
 */
const awardXPAndCheckAchievements = async (userId, xpGain, statUpdates = {}) => {
    const user = await User.findById(userId);
    if (!user) return [];

    // --- Update streak ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = user.stats.lastStudyDate ? new Date(user.stats.lastStudyDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const diffDays = lastDate ? Math.floor((today - lastDate) / 86400000) : null;

    if (diffDays === null || diffDays > 1) {
        user.stats.streak = 1; // reset or start
    } else if (diffDays === 1) {
        user.stats.streak += 1; // continue
    }
    // same day: no change
    user.stats.lastStudyDate = new Date();
    if (user.stats.streak > user.stats.longestStreak) {
        user.stats.longestStreak = user.stats.streak;
    }

    // --- Update stats ---
    Object.keys(statUpdates).forEach(key => {
        user.stats[key] = (user.stats[key] || 0) + statUpdates[key];
    });

    // --- Award XP ---
    user.stats.xp += xpGain;
    user.stats.level = computeLevel(user.stats.xp);

    // --- Check achievements ---
    const unlockedKeys = new Set(user.achievements.map(a => a.achievementKey));
    const newlyUnlocked = [];

    for (const ach of ACHIEVEMENTS) {
        if (unlockedKeys.has(ach.key)) continue;

        let unlocked = false;
        const { type, value } = ach.criteria;

        if (type === 'tasksCompleted' && user.stats.tasksCompleted >= value) unlocked = true;
        if (type === 'topicsCompleted' && user.stats.topicsCompleted >= value) unlocked = true;
        if (type === 'streakDays' && user.stats.streak >= value) unlocked = true;
        if (type === 'xpEarned' && user.stats.xp >= value) unlocked = true;
        if (type === 'level' && user.stats.level >= value) unlocked = true;

        if (unlocked) {
            user.achievements.push({ achievementKey: ach.key, unlockedAt: new Date() });
            user.stats.xp += ach.xpReward; // bonus XP for achievement
            user.stats.level = computeLevel(user.stats.xp);
            newlyUnlocked.push(ach);
        }
    }

    await user.save();
    return newlyUnlocked;
};

module.exports = { ACHIEVEMENTS, awardXPAndCheckAchievements, xpForLevel, computeLevel };
