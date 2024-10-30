// backend/config/db.js
const mysql = require('mysql2');

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'todo_db', // Ensure this matches the database you created
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        process.exit(1); // Exit the process with a failure code
    }
    console.log('Connected to the database.');
});

// Export the database connection
module.exports = db;
