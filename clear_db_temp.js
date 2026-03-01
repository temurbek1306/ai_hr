const sqlite3 = require('./backend/node_modules/sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');
const tables = [
    'employee', 'test', 'question', 'option',
    'test_result', 'onboarding_material', 'notification',
    'calendar_event', 'reminder', 'knowledge_article',
    'assignment', 'survey_trigger'
];

db.serialize(() => {
    tables.forEach(t => {
        db.run(`DELETE FROM ${t}`, (err) => {
            if (err) console.error(`Error clearing ${t}:`, err.message);
            else console.log(`Cleared table: ${t}`);
        });
        db.run(`DELETE FROM sqlite_sequence WHERE name="${t}"`, (err) => { });
    });

    db.run("DELETE FROM user WHERE username != 'admin'", (err) => {
        if (err) console.error("Error clearing users:", err.message);
        else console.log("Cleared users (except admin)");
        db.close();
    });
});
