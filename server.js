require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session (MUST be before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fundify_super_secret_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true
  }
}));

// ── Static files
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes (before HTML page routes)
app.use('/auth', require('./routes/auth'));
app.use('/campaigns', require('./routes/campaigns'));
app.use('/admin', require('./routes/admin'));
app.use('/user', require('./routes/user'));


// ── HTML Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'dashboard.html'));
});

app.get('/auth/verify-otp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'verify-otp.html'));
});

// Return pending email for OTP page
app.get('/auth/pending-email', (req, res) => {
  res.json({ email: req.session.pendingEmail || null });
});

app.get('/campaign/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'campaign-detail.html'));
});

app.get('/admin/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'admin.html'));
});

// ── 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

// ── Error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ── Start
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`  🚀 Fundify running at http://localhost:${PORT}`);
  console.log(`  📋 Admin: admin@fundify.com / admin123`);
  console.log('========================================\n');
});
