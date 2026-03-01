import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function cleanup() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- FINDING PROCESS ON PORT 8000 ---');
        const lsof = await ssh.execCommand('lsof -t -i :8000');
        const pids = lsof.stdout.trim().split('\n').filter(p => p.length > 0);

        if (pids.length > 0) {
            console.log(`Found PIDs on port 8000: ${pids.join(', ')}`);
            for (const pid of pids) {
                console.log(`Inspecting PID ${pid}...`);
                const info = await ssh.execCommand(`ps -fp ${pid}`);
                console.log(info.stdout);

                const cwd = await ssh.execCommand(`ls -l /proc/${pid}/cwd`);
                console.log(`CWD: ${cwd.stdout}`);

                console.log(`Killing PID ${pid}...`);
                await ssh.execCommand(`kill -9 ${pid}`);
            }
        } else {
            console.log('No processes found on port 8000.');
        }

        console.log('--- CLEANING PM2 ---');
        await ssh.execCommand('pm2 delete all || true');
        await ssh.execCommand('pkill -9 node || true');

        console.log('--- VERIFYING PORT IS FREE ---');
        const check = await ssh.execCommand('netstat -tulpn | grep :8000');
        if (check.stdout) {
            console.error('PORT 8000 IS STILL BUSY:', check.stdout);
        } else {
            console.log('PORT 8000 is now FREE.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
