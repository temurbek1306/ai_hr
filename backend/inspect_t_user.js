
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const fs = require('fs');

db.get("SELECT * FROM employee WHERE email = 't@uz.com'", [], (err, row) => {
    if (err) throw err;
    fs.writeFileSync('t_user_employee.json', JSON.stringify(row, null, 2));
    db.close();
});
