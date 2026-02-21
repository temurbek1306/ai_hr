
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
const fs = require('fs');

const testId = 'a34bd657-90cf-40ff-86e0-0c8ddb8c84db';

const results = {};
db.all("SELECT id, text FROM question WHERE testId = ?", [testId], (err, qRows) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    results.questions = qRows;

    const questionIds = qRows.map(q => q.id);
    if (questionIds.length > 0) {
        const placeholders = questionIds.map(() => '?').join(',');
        db.all(`SELECT id, text, questionId FROM option WHERE questionId IN (${placeholders})`, questionIds, (err, optRows) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            results.options = optRows;
            fs.writeFileSync('db_content_check.json', JSON.stringify(results, null, 2));
            db.close();
        });
    } else {
        results.options = [];
        fs.writeFileSync('db_content_check.json', JSON.stringify(results, null, 2));
        db.close();
    }
});
