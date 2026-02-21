import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkDB() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- Employee Table ---');
        const employees = await ssh.execCommand('sqlite3 /var/www/ai_hr/backend/database.sqlite "SELECT * FROM employee;"');
        console.log(employees.stdout);

        console.log('\n--- User Table ---');
        const users = await ssh.execCommand('sqlite3 /var/www/ai_hr/backend/database.sqlite "SELECT * FROM user;"');
        console.log(users.stdout);

        console.log('\n--- Checking File path ---');
        const pwd = await ssh.execCommand('find /var/www/ai_hr -name database.sqlite');
        console.log(pwd.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDB();
