
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.all("SELECT COUNT(*) as count FROM test_result", [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Test results count:', rows[0].count);
    }
    db.close();
});
