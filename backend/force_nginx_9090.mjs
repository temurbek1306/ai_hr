import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

// Bu skript to'g'ridan-to'g'ri heredoc orqali faylni yozadi
// va Nginx'ni qayta ishga tushiradi
async function forceNginx9090() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('=== Writing Nginx config with port 9090 ===');

        // Remove all enabled sites
        await ssh.execCommand('rm -f /etc/nginx/sites-enabled/*');

        // Write config line by line
        const lines = [
            'server {',
            '    listen 80 default_server;',
            '    listen [::]:80 default_server;',
            '    server_name _;',
            '',
            '    root /var/www/ai_hr/dist;',
            '    index index.html;',
            '',
            '    location / {',
            '        try_files $uri $uri/ /index.html;',
            '    }',
            '',
            '    location /api {',
            '        proxy_pass http://127.0.0.1:9090;',
            '        proxy_http_version 1.1;',
            '        proxy_set_header Host $host;',
            '        proxy_set_header X-Real-IP $remote_addr;',
            '    }',
            '}',
        ];

        // Write each line
        await ssh.execCommand('rm -f /etc/nginx/sites-available/ai_hr_clean');
        for (const line of lines) {
            if (line === '') {
                await ssh.execCommand(`echo "" >> /etc/nginx/sites-available/ai_hr_clean`);
            } else {
                await ssh.execCommand(`echo '${line.replace(/'/g, "'\\''")}' >> /etc/nginx/sites-available/ai_hr_clean`);
            }
        }

        // Enable the new config
        await ssh.execCommand('ln -sf /etc/nginx/sites-available/ai_hr_clean /etc/nginx/sites-enabled/ai_hr_clean');

        // Verify 
        console.log('\n=== New Nginx config content: ===');
        const content = await ssh.execCommand('cat /etc/nginx/sites-enabled/ai_hr_clean');
        console.log(content.stdout);

        // Test and reload
        const test = await ssh.execCommand('nginx -t');
        console.log(test.stdout + test.stderr);

        console.log('\n=== Reloading Nginx... ===');
        await ssh.execCommand('nginx -s reload');

        // Final port check
        console.log('\nPort 9090:', (await ssh.execCommand('lsof -i :9090')).stdout || 'FREE');
        console.log('Port 8000:', (await ssh.execCommand('lsof -i :8000')).stdout || 'FREE');

        // Test login
        console.log('\n=== Login Test ===');
        const login = await ssh.execCommand(`node -e "const h=require('http'),d=JSON.stringify({username:'admin',password:'admin123'}),o={hostname:'127.0.0.1',port:9090,path:'/api/v1/auth/login',method:'POST',headers:{'Content-Type':'application/json','Content-Length':d.length}},r=h.request(o,res=>{let b='';res.on('data',c=>b+=c);res.on('end',()=>console.log('STATUS:',res.statusCode,'BODY:',b.substring(0,200)));});r.on('error',e=>console.error('ERR:',e.message));r.write(d);r.end();"`);
        console.log(login.stdout);
        console.log(login.stderr);

        process.exit(0);
    } catch (err) {
        console.error('Failed:', err);
        process.exit(1);
    }
}

forceNginx9090();
