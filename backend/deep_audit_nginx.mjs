import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function deepAudit() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== NGINX CONFIG AUDIT ===');
        const configs = (await ssh.execCommand('ls /etc/nginx/sites-enabled')).stdout.trim().split('\n');
        for (const file of configs) {
            if (file) {
                console.log(`\n--- Config: ${file} ---`);
                const content = await ssh.execCommand(`cat /etc/nginx/sites-enabled/${file}`);
                console.log(content.stdout);
            }
        }

        console.log('\n=== SEARCHING FOR 8000 IN ALL SITES-ENABLED ===');
        const grep = await ssh.execCommand('grep -r "8000" /etc/nginx/sites-enabled/');
        console.log(grep.stdout || 'None found.');

        console.log('\n=== SEARCHING FOR 8005 IN ALL SITES-ENABLED ===');
        const grep8005 = await ssh.execCommand('grep -r "8005" /etc/nginx/sites-enabled/');
        console.log(grep8005.stdout || 'None found.');

        console.log('\n=== REAL-TIME LSOF PORT 8000 & 8005 ===');
        const lsof8000 = await ssh.execCommand('lsof -i :8000');
        console.log('Port 8000:\n', lsof8000.stdout || 'FREE');
        const lsof8005 = await ssh.execCommand('lsof -i :8005');
        console.log('Port 8005:\n', lsof8005.stdout || 'FREE');

        console.log('\n=== NGINX LOGS FOR RECENT HITS ===');
        const access = await ssh.execCommand('tail -n 10 /var/log/nginx/access.log');
        console.log('Access Log:\n', access.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Audit failed:', err);
        process.exit(1);
    }
}

deepAudit();
