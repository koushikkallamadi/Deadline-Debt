import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import taskService from '../services/taskService';
import { calcDebt } from '../utils/calcDebt';

const TaskContext = createContext(null);

const mapToFrontend = (dbTask) => ({
    ...dbTask,
    id: dbTask._id,
    topics: dbTask.topics.map(t => t.name),
    completedTopics: dbTask.topics.filter(t => t.completed).map(t => t.name)
});

const mapToBackend = (frontendTask) => ({
    ...frontendTask,
    topics: frontendTask.topics.map(name => ({
        name,
        completed: frontendTask.completedTopics?.includes(name) || false
    }))
});

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await taskService.getTasks();
            setTasks(data.map(mapToFrontend));
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddTask = async (taskData) => {
        try {
            const payload = mapToBackend(taskData);
            const newTask = await taskService.createTask(payload);
            setTasks(prev => [...prev, mapToFrontend(newTask)]);
        } catch (err) {
            console.error('Failed to add task:', err);
        }
    };

    const updateTaskData = async (taskId, getUpdatedFrontendTask) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // Optimistic update
        const updated = getUpdatedFrontendTask(task);
        setTasks(prev => prev.map(t => t.id === taskId ? updated : t));

        try {
            // Sync with backend
            const payload = mapToBackend(updated);
            await taskService.updateTask(taskId, payload);
        } catch (err) {
            console.error('Failed to update task:', err);
            // Should revert optimistic update here in a perfect world
        }
    };

    const handleToggleTopic = (taskId, topic) => {
        updateTaskData(taskId, (t) => {
            const isDone = t.completedTopics.includes(topic);
            const newDone = isDone ? t.completedTopics.filter(x => x !== topic) : [...t.completedTopics, topic];
            return { ...t, completedTopics: newDone };
        });
    };

    const handleDelete = async (id) => {
        try {
            await taskService.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const handleEditTopic = (taskId, oldTopic, newTopic) => {
        updateTaskData(taskId, (t) => {
            const newTopics = t.topics.map(tp => tp === oldTopic ? newTopic : tp);
            const newCompleted = t.completedTopics.map(tp => tp === oldTopic ? newTopic : tp);
            return { ...t, topics: newTopics, completedTopics: newCompleted };
        });
    };

    const handleDeleteTopic = (taskId, topic) => {
        updateTaskData(taskId, (t) => {
            if (t.topics.length <= 1) return t;
            return {
                ...t,
                topics: t.topics.filter(tp => tp !== topic),
                completedTopics: t.completedTopics.filter(tp => tp !== topic)
            };
        });
    };

    const handleAddTopic = (taskId, newTopic) => {
        updateTaskData(taskId, (t) => {
            if (t.topics.includes(newTopic)) return t;
            return { ...t, topics: [...t.topics, newTopic] };
        });
    };

    const mappedTasks = useMemo(() => {
        return tasks.map(t => ({ ...t, debtScore: calcDebt(t) }));
    }, [tasks]);

    return (
        <TaskContext.Provider value={{
            tasks, mappedTasks, loading, error, fetchTasks,
            handleAddTask, handleToggleTopic, handleDelete,
            handleEditTopic, handleDeleteTopic, handleAddTopic
        }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within TaskProvider');
    return context;
}
