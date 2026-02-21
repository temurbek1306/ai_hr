
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const fs = require('fs');

db.serialize(() => {
    const results = {};
    db.all("SELECT id, username, email, role FROM user WHERE email = 't@uz.com'", [], (err, rows) => {
        if (err) throw err;
        results.users = rows;
    });

    db.all("SELECT id, userId, fullName, email, status FROM employee WHERE email = 't@uz.com'", [], (err, rows) => {
        if (err) throw err;
        results.employees = rows;
        fs.writeFileSync('db_results.json', JSON.stringify(results, null, 2));
    });
});

db.close();
