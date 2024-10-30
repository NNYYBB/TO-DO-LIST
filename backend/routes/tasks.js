// backend/routes/tasks.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all tasks
router.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            return res.status(500).json({ error: 'Failed to fetch tasks.' });
        }
        res.json(results);
    });
});

// Add a new task
router.post('/tasks', (req, res) => {
    const { task, description, start_date, end_date } = req.body;

    // Validate input
    if (!task || !description || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'INSERT INTO tasks (task, description, start_date, end_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [task, description, start_date, end_date], (err, results) => {
        if (err) {
            console.error('Error adding task:', err.message);
            return res.status(500).json({ error: 'Failed to add task.' });
        }
        res.status(201).json({ id: results.insertId, task, description, start_date, end_date });
    });
});

// Update a task
router.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, description, start_date, end_date } = req.body;

    // Validate input
    if (!task || !description || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const sql = 'UPDATE tasks SET task = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?';
    db.query(sql, [task, description, start_date, end_date, id], (err, results) => {
        if (err) {
            console.error('Error updating task:', err.message);
            return res.status(500).json({ error: 'Failed to update task.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json({ message: 'Task updated successfully.' });
    });
});

// Delete a task
router.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err.message);
            return res.status(500).json({ error: 'Failed to delete task.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }

        res.json({ message: 'Task deleted successfully.' });
    });
});

module.exports = router;
