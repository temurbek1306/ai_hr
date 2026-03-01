import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function verify() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- DATABASE CHECK ---');
        const dbPath = '/var/www/ai_hr/backend/database.sqlite';

        // Check if DB exists
        const exists = await ssh.execCommand(`ls -la ${dbPath}`);
        console.log('File status:', exists.stdout || exists.stderr);

        // Check users count
        const users = await ssh.execCommand(`sqlite3 ${dbPath} "SELECT count(*) FROM user;"`);
        console.log('Total users:', users.stdout.trim());

        // List all users (careful with passwords, but for debug we need to know if admin is there)
        const userList = await ssh.execCommand(`sqlite3 ${dbPath} "SELECT id, username, email, role FROM user;"`);
        console.log('User list:\n', userList.stdout);

        // Check if admin is there specifically
        const adminCheck = await ssh.execCommand(`sqlite3 ${dbPath} "SELECT * FROM user WHERE username='admin';"`);
        console.log('Admin specific check:', adminCheck.stdout ? 'Admin FOUND' : 'Admin NOT FOUND');

        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
}

verify();
