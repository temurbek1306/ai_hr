import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function grepDist() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- Grepping for /auth/login in /var/www/ai_hr/dist ---');
        const result = await ssh.execCommand('grep -r "/auth/login" /var/www/ai_hr/dist | grep ".js" | head -n 5');
        console.log(result.stdout);

        console.log('\n--- Grepping for /api/v1/auth/login in /var/www/ai_hr/dist ---');
        const result2 = await ssh.execCommand('grep -r "/api/v1/auth/login" /var/www/ai_hr/dist | grep ".js" | head -n 5');
        console.log(result2.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

grepDist();
