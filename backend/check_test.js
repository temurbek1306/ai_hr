
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const fs = require('fs');

db.serialize(() => {
    const results = {};
    db.all("SELECT id, title FROM test", [], (err, rows) => {
        if (err) throw err;
        results.tests = rows;
    });

    db.all("SELECT * FROM test_result WHERE employeeId = (SELECT id FROM employee WHERE email = 't@uz.com')", [], (err, rows) => {
        if (err) throw err;
        results.test_results = rows;
        fs.writeFileSync('db_test_check.json', JSON.stringify(results, null, 2));
    });
});

db.close();
