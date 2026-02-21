import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function checkFiles() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- /var/www/ai_hr/src/services/auth.service.ts ---');
        const authService = await ssh.execCommand('cat /var/www/ai_hr/src/services/auth.service.ts');
        console.log(authService.stdout);

        console.log('\n--- src/api/axios.ts ---');
        const axiosFile = await ssh.execCommand('cat /var/www/ai_hr/src/api/axios.ts');
        console.log(axiosFile.stdout);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkFiles();
