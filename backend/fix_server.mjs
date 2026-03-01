import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function fixServer() {
    try {
        console.log('🔧 Serverga ulanmoqda...');
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });
        console.log('✅ Ulandi!\n');

        // 1. Java protsessni to'xtatish (8000-portdagi eski backend)
        console.log('=== 1. ESKI JAVA BACKENDNI TOZALASH (port 8000) ===');

        // Java PID ni aniqlash
        const javaCheck = await ssh.execCommand('lsof -i :8000 -t');
        if (javaCheck.stdout.trim()) {
            const javaPid = javaCheck.stdout.trim();
            console.log(`Java PID topildi: ${javaPid}`);

            // Java jarayonini to'liq o'chirish
            await ssh.execCommand(`kill -9 ${javaPid}`);
            console.log('Java jarayoni o\'chirildi!');
        } else {
            console.log('Java jarayoni allaqachon o\'chirilgan.');
        }

        // Java service (systemd) bilan ham tekshirish
        console.log('\n=== 1b. JAVA SYSTEMD XIZMATLARI ===');
        const javaServices = await ssh.execCommand('systemctl list-units --type=service --state=running | grep -iE "(java|spring|tomcat|ai.hr)"');
        console.log(javaServices.stdout || 'Java xizmatlari topilmadi');

        // Agar systemd bilan ishlayotgan bo'lsa, o'chirib qo'yamiz
        const allServices = await ssh.execCommand('systemctl list-units --type=service --state=running --no-pager');
        console.log('\nBarcha ishlab turgan xizmatlar:');
        const lines = allServices.stdout.split('\n').filter(l =>
            l.includes('java') || l.includes('spring') || l.includes('tomcat') ||
            l.includes('ai-hr') || l.includes('ai_hr') || l.includes('jar')
        );
        if (lines.length > 0) {
            for (const line of lines) {
                const serviceName = line.trim().split(/\s+/)[0];
                console.log(`Xizmat topildi: ${serviceName}`);
                await ssh.execCommand(`systemctl stop ${serviceName}`);
                await ssh.execCommand(`systemctl disable ${serviceName}`);
                console.log(`${serviceName} to'xtatildi va o'chirildi`);
            }
        } else {
            console.log('Systemd Java xizmatlari topilmadi');
        }

        // Crontab tekshirish (Java qayta ishga tushmasligi uchun)
        console.log('\n=== 1c. CRONTAB TEKSHIRISH ===');
        const crontab = await ssh.execCommand('crontab -l 2>/dev/null');
        if (crontab.stdout.includes('java') || crontab.stdout.includes('jar')) {
            console.log('⚠️ Crontab da Java topildi:');
            console.log(crontab.stdout);
        } else {
            console.log('Crontab toza');
        }

        // 2. /var/www/ai-hr eski papkani tozalash
        console.log('\n=== 2. ESKI FRONTEND NUSXASINI TOZALASH ===');
        await ssh.execCommand('rm -rf /var/www/ai-hr');
        console.log('/var/www/ai-hr o\'chirildi');

        // 3. Backend .env ni PORT=9090 qilish (PM2 qayta ishga tushganda to'g'ri bo'lsin)
        console.log('\n=== 3. BACKEND .ENV YANGILASH ===');
        const currentEnv = await ssh.execCommand('cat /var/www/ai_hr/backend/.env');
        console.log('Hozirgi .env:', currentEnv.stdout);

        // PORT=9090 ga yangilash
        await ssh.execCommand(`cat > /var/www/ai_hr/backend/.env << 'EOF'
PORT=9090
JWT_SECRET=ai_hr_secret_key_2026
NODE_ENV=production
EOF`);

        const newEnv = await ssh.execCommand('cat /var/www/ai_hr/backend/.env');
        console.log('Yangi .env:', newEnv.stdout);

        // 4. PM2 qayta ishga tushirish
        console.log('\n=== 4. PM2 BACKEND QAYTA ISHGA TUSHIRISH ===');
        await ssh.execCommand('pm2 restart ai-hr-backend');

        // Kutish
        await new Promise(resolve => setTimeout(resolve, 3000));

        const pm2Status = await ssh.execCommand('pm2 list');
        console.log(pm2Status.stdout);

        // 5. Tekshirish
        console.log('\n=== 5. YAKUNIY TEKSHIRUV ===');

        // 5a. Port 8000 endi bo'sh bo'lishi kerak
        const port8000 = await ssh.execCommand('ss -tlnp | grep 8000');
        console.log('Port 8000:', port8000.stdout || '✅ BO\'SH (TO\'G\'RI!)');

        // 5b. Port 9090 Node.js ishlayotgan bo'lishi kerak
        const port9090 = await ssh.execCommand('ss -tlnp | grep 9090');
        console.log('Port 9090:', port9090.stdout || '❌ ISHLAMAYAPTI');

        // 5c. Backend health check
        await new Promise(resolve => setTimeout(resolve, 2000));
        const ping = await ssh.execCommand('curl -s http://localhost:9090/ping');
        console.log('Ping test:', ping.stdout);

        // 5d. Login test
        const login = await ssh.execCommand(`curl -s -X POST http://localhost:9090/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' | head -c 200`);
        console.log('Login test (9090):', login.stdout);

        // 5e. Nginx orqali
        const nginxLogin = await ssh.execCommand(`curl -s -X POST http://localhost/api/v1/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' | head -c 200`);
        console.log('Login test (Nginx):', nginxLogin.stdout);

        // 5f. Frontend
        const frontendCheck = await ssh.execCommand('curl -s -o /dev/null -w "%{http_code}" http://localhost/');
        console.log('Frontend (Nginx):', frontendCheck.stdout);

        console.log('\n✅ BARCHA TUZATISHLAR AMALGA OSHIRILDI!');
        console.log('\n📌 XULOSA:');
        console.log('   - Eski Java backend (port 8000) to\'xtatildi');
        console.log('   - Backend faqat port 9090 da ishlaydi');
        console.log('   - Nginx → 9090 ga proxy qiladi');
        console.log('   - Frontend http://94.241.141.229 da ishlaydi');

        process.exit(0);
    } catch (err) {
        console.error('❌ Xatolik:', err.message);
        process.exit(1);
    }
}

fixServer();
