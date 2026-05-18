const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./accounting.db');

db.serialize(() => {
    // 1. Users Table (Admin and Supervisors)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin', 'supervisor')),
        site_name TEXT
    )`);

    // 2. Transactions Table (Receipts and Payments)
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_name TEXT,
        type TEXT CHECK(type IN ('receipt', 'payment')),
        amount REAL,
        description TEXT,
        supervisor_id INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(supervisor_id) REFERENCES users(id)
    )`);

    // 3. Documents Table (PDF, JPG Uploads)
    db.run(`CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_name TEXT,
        file_path TEXT,
        uploaded_by INTEGER,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(uploaded_by) REFERENCES users(id)
    )`);

    // Insert Default Demo Accounts (Password hashing should be added for production)
    db.run(`INSERT OR IGNORE INTO users (username, password, role, site_name) VALUES 
        ('admin', 'admin123', 'admin', 'All Sites'),
        ('site1_super', 'super123', 'supervisor', 'Bridge Project A'),
        ('site2_super', 'super456', 'supervisor', 'Metro Station B')`);
});

console.log("Database tables initialized successfully.");
module.exports = db;