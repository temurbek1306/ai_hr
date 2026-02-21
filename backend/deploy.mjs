import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

async function deploy() {
    try {
        console.log('Connecting to server...');
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });
        console.log('Connected!');

        // 1. Initial Setup
        console.log('Updating system and installing dependencies...');
        await ssh.execCommand('apt-get update && apt-get install -y git curl nginx');

        // Install Node.js if missing
        const nodeCheck = await ssh.execCommand('node -v');
        if (nodeCheck.code !== 0) {
            console.log('Installing Node.js...');
            await ssh.execCommand('curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs');
        }

        // Install PM2 if missing
        const pm2Check = await ssh.execCommand('pm2 -v');
        if (pm2Check.code !== 0) {
            console.log('Installing PM2...');
            await ssh.execCommand('npm install -g pm2');
        }

        // 2. Clone/Pull Repository (FULL WIPE for fresh start)
        console.log('Wiping target directory for fresh start...');
        await ssh.execCommand('rm -rf /var/www/ai_hr');
        await ssh.execCommand('mkdir -p /var/www/ai_hr');

        console.log('Cloning fresh repository...');
        await ssh.execCommand('git clone https://github.com/temurbek1306/ai_hr.git /var/www/ai_hr');

        // 3. Build & Install (Clean Build)
        console.log('Cleaning and building...');
        await ssh.execCommand('cd /var/www/ai_hr && rm -rf dist node_modules');
        await ssh.execCommand('cd /var/www/ai_hr && npm install && npm run build');

        await ssh.execCommand('cd /var/www/ai_hr/backend && rm -rf dist node_modules');
        await ssh.execCommand('cd /var/www/ai_hr/backend && npm install && npm run build');

        // Verify commit
        const commitHash = await ssh.execCommand('cd /var/www/ai_hr && git rev-parse HEAD');
        console.log('Current commit on server:', commitHash.stdout.trim());

        // 5. DEEP CLEAN (requested by user)
        console.log('Cleaning up other Nginx sites and PM2 processes...');
        await ssh.execCommand('rm -f /etc/nginx/sites-enabled/*'); // Remove ALL other sites
        await ssh.execCommand('pm2 kill'); // Kill all PM2 processes
        await ssh.execCommand('pm2 unstartup'); // Clear PM2 startup

        // 6. Configure Nginx (Restore default)
        console.log('Restoring AI-HR Nginx configuration...');
        const nginxConfig = `
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/ai_hr/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;
        await ssh.execCommand(`echo '${nginxConfig}' > /etc/nginx/sites-available/ai-hr`);
        await ssh.execCommand('ln -sf /etc/nginx/sites-available/ai-hr /etc/nginx/sites-enabled/default');
        await ssh.execCommand('systemctl restart nginx');

        // 7. Restart Backend
        console.log('Starting AI-HR Backend...');
        await ssh.execCommand('cd /var/www/ai_hr/backend && pm2 start dist/index.js --name ai-hr-backend');
        await ssh.execCommand('pm2 save');

        console.log('Deployment complete! App should be live at http://94.241.141.229');
        process.exit(0);

    } catch (err) {
        console.error('Deployment failed:', err);
        process.exit(1);
    }
}

deploy();
