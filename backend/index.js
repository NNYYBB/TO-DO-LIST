const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();
const PORT = 5000;

// Use CORS for cross-origin requests
app.use(cors({
    origin: 'http://localhost:5174', // Your React frontend URL
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to the database and ensure it's successful
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM tasks ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            return res.status(500).json({ error: 'Failed to fetch tasks.' });
        }
        console.log(results)
        res.json(results);
    });
});

// GET a single task by ID
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching task:', err.message);
            return res.status(500).json({ error: 'Failed to fetch task.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(results[0]);
    });
});

// POST a new task
app.post('/api/tasks', (req, res) => {
    const { task, description, start_date, end_date } = req.body;

    // Validate input
    if (!task || !description || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query('INSERT INTO tasks (task, description, start_date, end_date) VALUES (?, ?, ?, ?)', 
    [task, description, start_date, end_date], (err, results) => {
        if (err) {
            console.error('Error adding task:', err.message);
            return res.status(500).json({ error: 'Failed to add task.' });
        }
        res.status(201).json({ id: results.insertId, task, description, start_date, end_date });
    });
});

// PUT (update) an existing task
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { task, description, start_date, end_date } = req.body;

    // Validate input
    if (!task || !description || !start_date || !end_date) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    db.query(
        'UPDATE tasks SET task = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?', 
        [task, description, start_date, end_date, id], 
        (err, results) => {
            if (err) {
                console.error('Error updating task:', err.message);
                return res.status(500).json({ error: 'Failed to update task.' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ id, task, description, start_date, end_date });
        }
    );
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err.message);
            return res.status(500).json({ error: 'Failed to delete task.' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
