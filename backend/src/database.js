const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DB_PATH)) fs.mkdirSync(DB_PATH, { recursive: true });

function readJSON(file) {
  const fp = path.join(DB_PATH, file + '.json');
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, 'utf-8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(path.join(DB_PATH, file + '.json'), JSON.stringify(data, null, 2));
}

// Seed admin
const users = readJSON('users');
if (!users.find(u => u.email === 'admin@railway.mn')) {
  users.push({
    id: 1, email: 'admin@railway.mn',
    password: bcrypt.hashSync('admin123', 10),
    lastName: 'Админ', firstName: 'Систем', org: 'ТЗС',
    role: 'admin', blocked: 0, points: 0,
    correctAnswers: 0, totalAnswers: 0, chaptersCompleted: [],
    registeredAt: new Date().toISOString()
  });
  writeJSON('users', users);
}

module.exports = { readJSON, writeJSON };
