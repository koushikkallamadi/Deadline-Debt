const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const { ACHIEVEMENTS, xpForLevel, computeLevel } = require('../utils/achievements');

// @route   GET /api/achievements
// @desc    Get all possible achievements + user's unlocked ones + stats
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const unlockedMap = {};
        user.achievements.forEach(a => {
            unlockedMap[a.achievementKey] = a.unlockedAt;
        });

        const allAchievements = ACHIEVEMENTS.map(ach => ({
            ...ach,
            unlocked: !!unlockedMap[ach.key],
            unlockedAt: unlockedMap[ach.key] || null
        }));

        // Compute xp needed for next level
        const currentLevel = user.stats.level;
        const xpNeededForCurrentLevel = computeXpForCurrentLevel(user.stats.xp, currentLevel);
        const xpNeededForNextLevel = xpForLevel(currentLevel);

        res.json({
            stats: user.stats,
            achievements: allAchievements,
            levelProgress: {
                current: xpNeededForCurrentLevel,
                needed: xpNeededForNextLevel,
                percentage: Math.floor((xpNeededForCurrentLevel / xpNeededForNextLevel) * 100)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Helper to calculate XP within current level
function computeXpForCurrentLevel(totalXp, level) {
    let remaining = totalXp;
    for (let l = 1; l < level; l++) {
        remaining -= xpForLevel(l);
    }
    return Math.max(0, remaining);
}

module.exports = router;
