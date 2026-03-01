import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function nuclearFix() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        // Step 1: Kill ALL node processes globally (all users)
        console.log('STEP 1: Killing ALL node processes on the server...');
        await ssh.execCommand('pkill -9 -f ts-node || true');
        await ssh.execCommand('pkill -9 -f node || true');
        await ssh.execCommand('pkill -9 -f npm || true');
        console.log('All node processes killed.');

        // Step 2: Wait
        await new Promise(r => setTimeout(r, 2000));

        // Step 3: Verify all ports are free
        console.log('\nSTEP 2: Verifying ports are free...');
        const port9090 = await ssh.execCommand('lsof -i :9090');
        const port8000 = await ssh.execCommand('lsof -i :8000');
        const port8005 = await ssh.execCommand('lsof -i :8005');
        console.log('Port 9090:', port9090.stdout || 'FREE ✅');
        console.log('Port 8000:', port8000.stdout || 'FREE ✅');
        console.log('Port 8005:', port8005.stdout || 'FREE ✅');

        // Step 4: Clean PM2
        console.log('\nSTEP 3: Cleaning PM2...');
        await ssh.execCommand('rm -rf /root/.pm2');
        console.log('PM2 cleaned.');

        // Step 5: Write correct Nginx config
        console.log('\nSTEP 4: Writing monolithic Nginx config for port 9090...');
        const nginxConfig = `server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/ai_hr/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:9090;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}`;
        // Write the config directly
        await ssh.execCommand('rm -f /etc/nginx/sites-enabled/*');
        await ssh.execCommand(`cat > /etc/nginx/sites-available/ai_hr_final << 'ENDOFCONFIG'\n${nginxConfig}\nENDOFCONFIG`);
        await ssh.execCommand('ln -sf /etc/nginx/sites-available/ai_hr_final /etc/nginx/sites-enabled/ai_hr_final');

        // Quick verify
        const testConfig = await ssh.execCommand('nginx -t');
        console.log('Nginx test:', testConfig.stdout + testConfig.stderr);
        await ssh.execCommand('nginx -s reload');
        console.log('Nginx reloaded.');

        // Step 6: Start backend fresh with PM2
        console.log('\nSTEP 5: Starting fresh backend on port 9090...');
        const startResult = await ssh.execCommand(
            'cd /var/www/ai_hr/backend && PORT=9090 pm2 start "npx ts-node src/index.ts" --name ai-hr-backend --no-daemon=false'
        );
        console.log(startResult.stdout);
        console.log(startResult.stderr);

        // Wait for startup
        await new Promise(r => setTimeout(r, 4000));

        // Step 7: Check status
        console.log('\nSTEP 6: Checking final status...');
        const pm2Status = await ssh.execCommand('pm2 status');
        console.log(pm2Status.stdout);

        const port9090After = await ssh.execCommand('lsof -i :9090');
        console.log('Port 9090 after start:', port9090After.stdout || 'NOTHING - Still starting...');

        // Step 8: Test login
        console.log('\nSTEP 7: Testing login...');
        const testResult = await ssh.execCommand(`node -e "
const http = require('http');
const data = JSON.stringify({ username: 'admin', password: 'admin123' });
const req = http.request({ hostname: '127.0.0.1', port: 9090, path: '/api/v1/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': data.length } }, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => { console.log('STATUS:', res.statusCode); console.log('BODY:', body.substring(0, 200)); });
});
req.on('error', e => console.error('ERROR:', e.message));
req.write(data);
req.end();
"`);
        console.log(testResult.stdout);
        console.log(testResult.stderr);

        process.exit(0);
    } catch (err) {
        console.error('Nuclear fix failed:', err);
        process.exit(1);
    }
}

nuclearFix();
