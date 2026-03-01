import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function audit9090() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== 1. LSOF ON PORT 9090 ===');
        const lsof = await ssh.execCommand('lsof -i :9090');
        console.log(lsof.stdout || 'FREE');

        console.log('\n=== 2. DETAILED PS FOR 9090 LISTENER ===');
        const pids = lsof.stdout.match(/\b\d+\b/g);
        if (pids) {
            for (const pid of pids) {
                if (pid.length > 2) { // Avoid false positives from port numbers
                    const info = await ssh.execCommand(`ps -fp ${pid}`);
                    console.log(`PID ${pid} Info:\n`, info.stdout);
                    const cwd = await ssh.execCommand(`ls -l /proc/${pid}/cwd`);
                    console.log(`CWD: ${cwd.stdout}`);
                }
            }
        }

        console.log('\n=== 3. PM2 LIST ===');
        const pm2 = await ssh.execCommand('pm2 list');
        console.log(pm2.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Audit failed:', err);
        process.exit(1);
    }
}

audit9090();
