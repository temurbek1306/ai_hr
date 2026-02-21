import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function verify() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- PM2 Logs (Last 50 lines) ---');
        const logs = await ssh.execCommand('pm2 logs ai-hr-backend --lines 50 --flush');
        console.log(logs.stdout);

        console.log('\n--- Checking Nginx Access Log for POST /api/v1 ---');
        const accessLog = await ssh.execCommand('grep "POST /api/v1" /var/log/nginx/access.log | tail -n 5');
        console.log(accessLog.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
