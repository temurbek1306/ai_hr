
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const fs = require('fs');

db.all("SELECT id, username, email, role FROM user", [], (err, rows) => {
    if (err) throw err;
    fs.writeFileSync('all_users.json', JSON.stringify(rows, null, 2));
    db.close();
});
