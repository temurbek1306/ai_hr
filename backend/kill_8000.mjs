import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function killPort8000() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== FINDING PROCESS ON PORT 8000 ===');
        const lsof = await ssh.execCommand('lsof -i :8000');
        console.log(lsof.stdout);

        // Get all PIDs on port 8000
        const pids = (await ssh.execCommand('lsof -t -i :8000')).stdout.trim().split('\n').filter(Boolean);

        for (const pid of pids) {
            console.log(`\nInspecting PID ${pid}:`);
            const info = await ssh.execCommand(`cat /proc/${pid}/cmdline 2>/dev/null | tr '\\0' ' '`);
            console.log('CMD:', info.stdout);
            const cwd = await ssh.execCommand(`ls -l /proc/${pid}/cwd 2>/dev/null`);
            console.log('CWD:', cwd.stdout);
            const user = await ssh.execCommand(`ps -fp ${pid} | tail -n 1 | awk '{print $1}'`);
            console.log('USER:', user.stdout);

            // Kill regardless of user
            await ssh.execCommand(`kill -9 ${pid}`);
            console.log(`Killed PID ${pid}`);
        }

        // Also check if there's a systemd service managing this
        console.log('\n=== CHECKING SYSTEMD SERVICES ===');
        const systemd = await ssh.execCommand('systemctl list-units --type=service --state=running | grep -iE "node|express|backend|api"');
        console.log(systemd.stdout || 'No node-related systemd services found.');

        // Check crontab for all users
        console.log('\n=== CHECKING CRONTAB (root) ===');
        const cron = await ssh.execCommand('crontab -l');
        console.log(cron.stdout || 'No crontab for root.');

        // Check all user crontabs
        console.log('\n=== CHECKING /etc/cron.d ===');
        const cronD = await ssh.execCommand('ls /etc/cron.d/ && cat /etc/cron.d/*');
        console.log(cronD.stdout);

        // Wait and re-check
        await new Promise(r => setTimeout(r, 2000));
        const finalCheck = await ssh.execCommand('lsof -i :8000');
        console.log('\n=== FINAL PORT 8000 CHECK ===');
        console.log(finalCheck.stdout || 'FREE ✅');

        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

killPort8000();
