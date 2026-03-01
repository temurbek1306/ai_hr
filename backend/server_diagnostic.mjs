import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function diagnose() {
    try {
        console.log('🔍 Serverga ulanmoqda...');
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });
        console.log('✅ Ulandi!\n');

        // 1. PM2 protsesslari
        console.log('=== 1. PM2 PROTSESSLAR ===');
        const pm2 = await ssh.execCommand('pm2 list');
        console.log(pm2.stdout || pm2.stderr || 'PM2 topilmadi');

        // 2. Portlarni tekshirish
        console.log('\n=== 2. PORTLAR (8000, 9090, 80) ===');
        const ports = await ssh.execCommand('ss -tlnp | grep -E "(8000|9090|:80 )"');
        console.log(ports.stdout || 'Hech qanday port eshitmayapti');

        // 3. Nginx konfiguratsiyasi
        console.log('\n=== 3. NGINX ENABLED SAYTLAR ===');
        const sites = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/');
        console.log(sites.stdout);

        console.log('\n=== 3b. NGINX AKTIV KONFIGURATSIYA ===');
        const enabledFiles = await ssh.execCommand('cat /etc/nginx/sites-enabled/*');
        console.log(enabledFiles.stdout || 'Konfiguratsiya topilmadi');

        // 4. Nginx test
        console.log('\n=== 4. NGINX TEST ===');
        const nginxTest = await ssh.execCommand('nginx -t 2>&1');
        console.log(nginxTest.stdout + nginxTest.stderr);

        // 5. Backend .env tekshirish
        console.log('\n=== 5. SERVERDAGI BACKEND .ENV ===');
        const backendEnv = await ssh.execCommand('cat /var/www/ai_hr/backend/.env 2>/dev/null || echo ".env topilmadi"');
        console.log(backendEnv.stdout);

        // 6. Frontend dist tekshirish
        console.log('\n=== 6. FRONTEND DIST BORMII? ===');
        const distCheck = await ssh.execCommand('ls -la /var/www/ai_hr/dist/index.html 2>/dev/null && echo "Frontend dist MAVJUD" || echo "Frontend dist TOPILMADI"');
        console.log(distCheck.stdout);

        // Boshqa joy ham bormi?
        const altDist = await ssh.execCommand('ls -la /var/www/ai-hr/index.html 2>/dev/null && echo "/var/www/ai-hr da ham bor!" || echo "/var/www/ai-hr MAVJUD EMAS"');
        console.log(altDist.stdout);

        // 7. Git holati
        console.log('\n=== 7. GIT COMMIT (SERVERDA) ===');
        const gitLog = await ssh.execCommand('cd /var/www/ai_hr && git log --oneline -3 2>/dev/null || echo "Git repo topilmadi"');
        console.log(gitLog.stdout);

        // 8. Backend ishlayaptimi?
        console.log('\n=== 8. BACKEND HEALTH CHECK ===');
        const ping8000 = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/ping 2>/dev/null || echo "8000-port javob bermayapti"');
        console.log('Port 8000 /ping:', ping8000.stdout);

        const ping9090 = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost:9090/ping 2>/dev/null || echo "9090-port javob bermayapti"');
        console.log('Port 9090 /ping:', ping9090.stdout);

        // 9. Login test
        console.log('\n=== 9. LOGIN TEST ===');
        const login8000 = await ssh.execCommand(`curl -s -X POST http://localhost:8000/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' 2>/dev/null | head -c 300`);
        console.log('Port 8000 login:', login8000.stdout || 'Javob yo\'q');

        const login9090 = await ssh.execCommand(`curl -s -X POST http://localhost:9090/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' 2>/dev/null | head -c 300`);
        console.log('Port 9090 login:', login9090.stdout || 'Javob yo\'q');

        // 10. Nginx orqali test
        console.log('\n=== 10. NGINX ORQALI (80-port) TEST ===');
        const loginNginx = await ssh.execCommand(`curl -s -X POST http://localhost/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' 2>/dev/null | head -c 300`);
        console.log('Nginx login:', loginNginx.stdout || 'Javob yo\'q');

        const frontendNginx = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" http://localhost/ 2>/dev/null`);
        console.log('Nginx frontend:', frontendNginx.stdout);

        // 11. node/npm versiyasi
        console.log('\n=== 11. NODE/NPM VERSIYA ===');
        const nodeV = await ssh.execCommand('node -v');
        const npmV = await ssh.execCommand('npm -v');
        console.log('Node:', nodeV.stdout.trim(), '| NPM:', npmV.stdout.trim());

        // 12. PM2 logs oxirgi xatoliklar
        console.log('\n=== 12. PM2 BACKEND LOGLAR (oxirgi 20 qator) ===');
        const pm2Logs = await ssh.execCommand('pm2 logs ai-hr-backend --nostream --lines 20 2>/dev/null || echo "PM2 loglar topilmadi"');
        console.log(pm2Logs.stdout || pm2Logs.stderr);

        console.log('\n✅ DIAGNOSTIKA TUGADI');
        process.exit(0);

    } catch (err) {
        console.error('❌ Xatolik:', err.message);
        process.exit(1);
    }
}

diagnose();
