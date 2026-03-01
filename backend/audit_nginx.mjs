import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function audit() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== NGINX ENABLED CONFIGS ===');
        const enabled = (await ssh.execCommand('ls -l /etc/nginx/sites-enabled')).stdout;
        console.log(enabled);

        console.log('=== SCANNING FOR PORT 8000 IN ALL CONFIGS ===');
        const grep8000 = await ssh.execCommand('grep -r "8000" /etc/nginx/sites-enabled/');
        console.log(grep8000.stdout || 'No port 8000 found in active configs.');

        console.log('\n=== FIXING EVERY CONFIG TO 8005 ===');
        await ssh.execCommand("sed -i 's/localhost:8000/localhost:8005/g' /etc/nginx/sites-enabled/* || true");
        await ssh.execCommand("sed -i 's/127.0.0.1:8000/127.0.0.1:8005/g' /etc/nginx/sites-enabled/* || true");

        console.log('\n=== CHECKING IF AI-HR SPECIFIC CONFIG EXISTS ===');
        const aiHrCheck = await ssh.execCommand('ls /etc/nginx/sites-available/ai-hr || ls /etc/nginx/sites-available/ai_hr');
        console.log('AI-HR Config found:', aiHrCheck.stdout || 'No');

        console.log('\n=== TESTING NGINX CONFIG ===');
        const test = await ssh.execCommand('nginx -t');
        console.log(test.stdout);
        console.log(test.stderr);

        console.log('\n=== RELOADING NGINX ===');
        await ssh.execCommand('nginx -s reload');
        console.log('Nginx reloaded.');

        console.log('\n=== BACKEND STATUS ===');
        const pm2 = await ssh.execCommand('pm2 status');
        console.log(pm2.stdout);

        const logs = await ssh.execCommand('pm2 logs ai-hr-backend --lines 10 --no-daemon');
        console.log('Recent Backend Logs:\n', logs.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Audit failed:', err);
        process.exit(1);
    }
}

audit();
