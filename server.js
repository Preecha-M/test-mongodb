const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

// ตั้งค่าการเชื่อมต่อ MySQL
const db = mysql.createConnection({
    host: 'sql12.freesqldatabase.com', // เปลี่ยนเป็นค่าของ Railway เมื่อ Deploy
    user: 'sql12753913',
    password: 'y3HfyqwGcb',
    database: 'sql12753913'
});

// เชื่อมต่อ Database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ดึงโพสต์ทั้งหมด
app.get('/posts', (req, res) => {
    const query = 'SELECT * FROM posts';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// สร้างโพสต์ใหม่
app.post('/posts', (req, res) => {
    const { content } = req.body;
    const query = 'INSERT INTO posts (content) VALUES (?)';
    db.query(query, [content], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, content });
    });
});

// สร้างการตอบกลับ
app.post('/replies', (req, res) => {
    const { postId, content } = req.body;
    const query = 'INSERT INTO replies (post_id, content) VALUES (?, ?)';
    db.query(query, [postId, content], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, postId, content });
    });
});

// ดึงการตอบกลับทั้งหมด
app.get('/replies/:postId', (req, res) => {
    const { postId } = req.params;
    const query = 'SELECT * FROM replies WHERE post_id = ?';
    db.query(query, [postId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
