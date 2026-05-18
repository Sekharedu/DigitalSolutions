const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'accounting-secret-key', resave: false, saveUninitialized: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/login.html')));
app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'views/admin.html'));
});

// Authentication API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
        if (user) {
            req.session.user = user;
            res.json({ success: true, role: user.role });
        } else {
            res.json({ success: false, message: "Invalid Credentials" });
        }
    });
});

app.get('/api/user', (req, res) => res.json(req.session.user || {}));

// Accounting Data APIs
app.get('/api/data', (req, res) => {
    if (!req.session.user) return res.status(401).send("Unauthorized");
    const user = req.session.user;

    let txQuery = "SELECT * FROM transactions ORDER BY date DESC";
    let docQuery = "SELECT * FROM documents ORDER BY date DESC";
    let params = [];

    if (user.role === 'supervisor') {
        txQuery = "SELECT * FROM transactions WHERE site_name = ? ORDER BY date DESC";
        docQuery = "SELECT * FROM documents WHERE site_name = ? ORDER BY date DESC";
        params = [user.site_name];
    }

    db.all(txQuery, params, (err, txs) => {
        db.all(docQuery, params, (err, docs) => {
            res.json({ transactions: txs, documents: docs });
        });
    });
});

app.post('/api/transaction', (req, res) => {
    const { type, amount, description } = req.body;
    const user = req.session.user;
    db.run("INSERT INTO transactions (site_name, type, amount, description, supervisor_id) VALUES (?, ?, ?, ?, ?)",
        [user.site_name, type, amount, description, user.id], () => res.redirect('/dashboard'));
});

app.post('/api/upload', upload.single('document'), (req, res) => {
    const user = req.session.user;
    if (!req.file) return res.status(400).send('No file uploaded.');
    
    db.run("INSERT INTO documents (site_name, file_path, uploaded_by) VALUES (?, ?, ?)",
        [user.site_name, `/uploads/${req.file.filename}`, user.id], () => res.redirect('/dashboard'));
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));