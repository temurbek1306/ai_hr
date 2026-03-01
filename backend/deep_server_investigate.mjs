import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function deepInvestigate() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== 1. ALL NODE PROCESSES (Full Info) ===');
        const ps = await ssh.execCommand('ps -aux | grep node');
        console.log(ps.stdout);

        console.log('\n=== 2. LSOF -i (Listening Ports) ===');
        const lsof = await ssh.execCommand('lsof -i -n -P | grep LISTEN');
        console.log(lsof.stdout);

        console.log('\n=== 3. SEARCHING FOR "User not found" IN ALL JS FILES ===');
        // Search in the likely locations
        const grep = await ssh.execCommand('grep -r "User not found" /var/www/ /root/ || true');
        console.log(grep.stdout || 'No JS files containing "User not found" found on common paths.');

        console.log('\n=== 4. CHECKING NGINX LOGS FOR THE 401 ERROR ===');
        const accessLog = await ssh.execCommand('tail -n 100 /var/log/nginx/access.log | grep "/api"');
        console.log(accessLog.stdout);

        console.log('\n=== 5. CHECKING PM2 PROCESSES BY ALL USERS ===');
        const pm2All = await ssh.execCommand('pm2 list');
        console.log(pm2All.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Deep investigation failed:', err);
        process.exit(1);
    }
}

deepInvestigate();
