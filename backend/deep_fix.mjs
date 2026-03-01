import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function deepFix() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- NGINX DEEP SCAN ---');
        const enabledFiles = (await ssh.execCommand('ls /etc/nginx/sites-enabled')).stdout.trim().split('\n').filter(f => f.length > 0);

        for (const file of enabledFiles) {
            console.log(`Checking config: ${file}...`);
            const content = await ssh.execCommand(`cat /etc/nginx/sites-enabled/${file}`);
            if (content.stdout.includes('8000')) {
                console.log(`Found 8000 in ${file}, fixing to 8005...`);
                await ssh.execCommand(`sed -i 's/8000/8005/g' /etc/nginx/sites-enabled/${file}`);
                // Also fix in sites-available just in case they are not symlinks
                await ssh.execCommand(`sed -i 's/8000/8005/g' /etc/nginx/sites-available/${file} || true`);
            }
        }

        console.log('\n--- KILLING GHOSTS ON 8000 AGAIN ---');
        const pidsOn8000 = (await ssh.execCommand('lsof -t -i :8000')).stdout.trim().split('\n').filter(p => p.length > 0);
        if (pidsOn8000.length > 0) {
            console.log(`Ghost found on 8000: ${pidsOn8000.join(', ')}. Killing...`);
            await ssh.execCommand(`kill -9 ${pidsOn8000.join(' ')}`);
        }

        console.log('\n--- CURRENT PORT STATUS ---');
        const lsof = await ssh.execCommand('lsof -i -n -P | grep LISTEN');
        console.log(lsof.stdout);

        console.log('\n--- RELOADING NGINX ---');
        const reload = await ssh.execCommand('nginx -t && nginx -s reload');
        console.log(reload.stdout);
        console.log(reload.stderr);

        process.exit(0);
    } catch (err) {
        console.error('Deep fix failed:', err);
        process.exit(1);
    }
}

deepFix();
