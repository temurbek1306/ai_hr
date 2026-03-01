import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function investigate() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- PM2 LIST ---');
        console.log((await ssh.execCommand('pm2 list')).stdout);

        console.log('\n--- ALL RUNNING NODE PROCESSES ---');
        console.log((await ssh.execCommand('ps aux | grep node')).stdout);

        console.log('\n--- LISTENING PORTS ---');
        console.log((await ssh.execCommand('netstat -tulpn')).stdout);

        console.log('\n--- /var/www CONTENTS ---');
        console.log((await ssh.execCommand('ls -la /var/www')).stdout);

        console.log('\n--- CRONTAB ---');
        console.log((await ssh.execCommand('crontab -l')).stdout);

        console.log('\n--- SQLITE DATABASE FILES ON SYSTEM ---');
        console.log((await ssh.execCommand('find / -name "*.sqlite" 2>/dev/null | grep -v "node_modules"')).stdout);

        process.exit(0);
    } catch (err) {
        console.error('Investigation failed:', err);
        process.exit(1);
    }
}

investigate();
