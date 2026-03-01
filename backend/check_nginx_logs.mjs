import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkLogs() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== NGINX API LOGS (Access) ===');
        const access = await ssh.execCommand('tail -n 100 /var/log/nginx/access.log | grep "/api/"');
        console.log(access.stdout || 'No API hits found in last 100 lines.');

        console.log('\n=== LSOF ON PORTS ===');
        const ports = await ssh.execCommand('lsof -i :80; lsof -i :9090; lsof -i :8000; lsof -i :8005');
        console.log(ports.stdout);

        console.log('\n=== CURRENT PM2 CONFIG ===');
        const pm2 = await ssh.execCommand('pm2 jlist');
        const list = JSON.parse(pm2.stdout);
        list.forEach(p => {
            console.log(`App: ${p.name}, PID: ${p.pid}, Port (cwd): ${p.pm2_env.pm_cwd}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Log check failed:', err);
        process.exit(1);
    }
}

checkLogs();
