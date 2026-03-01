import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const db = new sqlite3.Database('./backend/database.sqlite');
const run = promisify(db.run.bind(db));
const all = promisify(db.all.bind(db));

async function clearDatabase() {
    try {
        console.log('🧹 Clearing database tables...');

        // Get all tables
        const tables = await all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");

        for (const table of tables.map(t => t.name)) {
            if (table === 'user') {
                // Keep the admin user
                await run("DELETE FROM user WHERE username != 'admin'");
                console.log(`✅ Table '${table}' partially cleared (kept admin).`);
            } else {
                await run(`DELETE FROM ${table}`);
                // Reset autoincrement
                await run(`DELETE FROM sqlite_sequence WHERE name='${table}'`).catch(() => { });
                console.log(`✅ Table '${table}' cleared.`);
            }
        }

        console.log('\n✨ Database is now clean!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        db.close();
    }
}

clearDatabase();
