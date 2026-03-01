import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function finalSolution() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- 1. CLEANING ALL ENABLED NGINX CONFIGS ---');
        await ssh.execCommand('rm -f /etc/nginx/sites-enabled/*');

        console.log('--- 2. CREATING MONOLITHIC CONFIG ---');
        const config = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/ai_hr/dist;
    index index.html;
    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:9090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;
        await ssh.execCommand(`echo "${config.replace(/"/g, '\\"')}" > /etc/nginx/sites-available/ai_hr_final`);
        await ssh.execCommand('ln -s /etc/nginx/sites-available/ai_hr_final /etc/nginx/sites-enabled/ai_hr_final');

        console.log('--- 3. RELOADING NGINX ---');
        const check = await ssh.execCommand('nginx -t');
        if (check.stderr.includes('syntax is ok')) {
            await ssh.execCommand('nginx -s reload');
            console.log('Nginx reloaded successfully.');
        } else {
            console.error('Nginx syntax error:', check.stderr);
        }

        console.log('--- 4. VERIFYING BACKEND IS ON 9090 ---');
        const lsof = await ssh.execCommand('lsof -i :9090');
        console.log(lsof.stdout || 'BACKEND NOT FOUND ON 9090!');

        console.log('--- 5. TESTING LOGIN (INTERNAL) ---');
        const run = await ssh.execCommand('node /root/login_test.js');
        console.log(run.stdout);

        process.exit(0);
    } catch (err) {
        console.error('Final solution failed:', err);
        process.exit(1);
    }
}

finalSolution();
