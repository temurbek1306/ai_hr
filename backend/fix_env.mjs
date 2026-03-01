import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function fixEnv() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- UPDATING .ENV PORT TO 8005 ---');
        await ssh.execCommand("sed -i 's/PORT=8000/PORT=8005/g' /var/www/ai_hr/backend/.env");

        console.log('Verifying .env content...');
        const verify = await ssh.execCommand('cat /var/www/ai_hr/backend/.env');
        console.log('.env content:\n', verify.stdout);

        console.log('--- RESTARTING PM2 ---');
        await ssh.execCommand('pm2 restart ai-hr-backend');

        console.log('Checking PM2 logs for port confirmation...');
        await new Promise(r => setTimeout(r, 2000));
        const logs = await ssh.execCommand('tail -n 20 /root/.pm2/logs/ai-hr-backend-out.log');
        console.log('Last logs:\n', logs.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Environment fix failed:', err);
        process.exit(1);
    }
}

fixEnv();
