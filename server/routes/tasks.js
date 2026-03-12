const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const { awardXPAndCheckAchievements } = require('../utils/achievements');

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, subject, dueDate, topics, debtScore, status } = req.body;

        const newTask = new Task({
            userId: req.user.id,
            title,
            subject,
            dueDate,
            topics,
            debtScore,
            status
        });

        const task = await newTask.save();

        // Award XP for creating a task
        const newAchievements = await awardXPAndCheckAchievements(req.user.id, 10, {});
        res.json({ task, newAchievements });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update task (handles topic completion & task completion with XP)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, subject, dueDate, topics, debtScore, status } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Count newly completed topics
        const prevCompleted = task.topics.filter(t => t.completed).length;
        const newTopics = topics || task.topics;
        const newCompleted = newTopics.filter(t => t.completed).length;
        const newlyCompletedTopics = Math.max(0, newCompleted - prevCompleted);

        const wasCompleted = task.status === 'completed';
        const isNowCompleted = status === 'completed';

        // Build task object
        const taskFields = {};
        if (title) taskFields.title = title;
        if (subject) taskFields.subject = subject;
        if (dueDate) taskFields.dueDate = dueDate;
        if (topics) taskFields.topics = topics;
        if (debtScore !== undefined) taskFields.debtScore = debtScore;
        if (status) taskFields.status = status;

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        // Award XP for progress
        let xpGain = newlyCompletedTopics * 20; // 20 XP per topic
        const statUpdates = { topicsCompleted: newlyCompletedTopics };

        if (!wasCompleted && isNowCompleted) {
            xpGain += 50; // Bonus for completing whole task
            statUpdates.tasksCompleted = 1;
        }

        let newAchievements = [];
        if (xpGain > 0 || Object.values(statUpdates).some(v => v > 0)) {
            newAchievements = await awardXPAndCheckAchievements(req.user.id, xpGain, statUpdates);
        }

        res.json({ task, newAchievements });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
