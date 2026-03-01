import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function updateNginx() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- UPDATING NGINX PORT TO 9090 ---');
        // Update both default and any specific ai_hr config if they exist
        await ssh.execCommand("sed -i 's/localhost:8005/localhost:9090/g' /etc/nginx/sites-available/default");
        await ssh.execCommand("sed -i 's/localhost:8000/localhost:9090/g' /etc/nginx/sites-available/default");
        await ssh.execCommand("sed -i 's/localhost:8005/localhost:9090/g' /etc/nginx/sites-available/ai_hr || true");
        await ssh.execCommand("sed -i 's/localhost:8000/localhost:9090/g' /etc/nginx/sites-available/ai_hr || true");

        console.log('Verifying config...');
        const verify = await ssh.execCommand('grep 9090 /etc/nginx/sites-available/default');
        console.log('Current config (grep 9090):', verify.stdout);

        console.log('Reloading Nginx...');
        await ssh.execCommand('nginx -s reload');
        console.log('Nginx updated and reloaded successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Nginx update failed:', err);
        process.exit(1);
    }
}

updateNginx();
