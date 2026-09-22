const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite DB
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE gigs (
    id TEXT PRIMARY KEY,
    creator_name TEXT,
    title TEXT,
    category TEXT,
    rate REAL,
    delivery_days INTEGER,
    description TEXT,
    active_pending INTEGER DEFAULT 0,
    max_capacity INTEGER DEFAULT 3
  )`);

  db.run(`CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    gig_id TEXT,
    client_name TEXT,
    amount REAL,
    status TEXT,
    brief TEXT,
    decline_reason TEXT
  )`);

  // Seed sample gig
  db.run(`INSERT INTO gigs VALUES ('gig-1', 'Aarav Sharma', 'TikTok Reels Editing', 'Video Editing', 65, 2, 'Pacing & subtitle design', 0, 3)`);
});

// API Routes
app.get('/api/gigs', (req, res) => {
  db.all('SELECT * FROM gigs', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/gigs', (req, res) => {
  const { id, creator_name, title, category, rate, delivery_days, description, max_capacity } = req.body;
  db.run(
    'INSERT INTO gigs VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)',
    [id, creator_name, title, category, rate, delivery_days, description, max_capacity || 3],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Gig created successfully' });
    }
  );
});

app.get('/api/bookings', (req, res) => {
  db.all('SELECT * FROM bookings', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/bookings', (req, res) => {
  const { id, gig_id, client_name, amount, status, brief } = req.body;
  db.run(
    'INSERT INTO bookings VALUES (?, ?, ?, ?, ?, ?, "")',
    [id, gig_id, client_name, amount, status || 'Pending', brief],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Booking submitted' });
    }
  );
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, decline_reason } = req.body;
  db.run(
    'UPDATE bookings SET status = ?, decline_reason = ? WHERE id = ?',
    [status, decline_reason || '', id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status updated' });
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`));
