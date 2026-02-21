import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function debug() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- Nginx Config (/etc/nginx/sites-enabled/default) ---');
        const nginxConfig = await ssh.execCommand('cat /etc/nginx/sites-enabled/default');
        console.log(nginxConfig.stdout);

        console.log('\n--- PM2 Processes ---');
        const pm2Status = await ssh.execCommand('pm2 status');
        console.log(pm2Status.stdout);

        console.log('\n--- Checking Nginx Root Directory Contents ---');
        const lsRoot = await ssh.execCommand('ls -R /var/www/ai_hr/dist | head -n 20');
        console.log(lsRoot.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
