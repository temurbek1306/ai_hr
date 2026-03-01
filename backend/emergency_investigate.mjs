import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function check() {
    try {
        await ssh.connect({
            host: '94.241.141.229',
            username: 'root',
            password: 'fd4p,7UX^+LEcw'
        });

        console.log('--- PORTS 8000 & 8005 ---');
        const netstat = await ssh.execCommand('netstat -tulpn | grep -E ":8000|:8005"');
        console.log(netstat.stdout || 'No processes on these ports.');

        console.log('\n--- PM2 STATUS ---');
        const pm2 = await ssh.execCommand('pm2 status');
        console.log(pm2.stdout);

        console.log('\n--- LOGIN TEST (LOCAL REQUEST TO 8005) ---');
        // Make sure the test script is there
        const testScript = `
const http = require('http');
const data = JSON.stringify({ username: 'admin', password: 'admin123' });
const options = {
    hostname: '127.0.0.1',
    port: 9090,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
};
const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        console.log('STATUS:', res.statusCode);
        console.log('BODY:', body);
    });
});
req.on('error', (e) => { console.error('ERROR:', e); });
req.write(data);
req.end();
`;
        await ssh.execCommand(`echo "${testScript.replace(/"/g, '\\"')}" > /root/emergency_test.js`);
        const run = await ssh.execCommand('node /root/emergency_test.js');
        console.log(run.stdout);
        console.log(run.stderr);

        process.exit(0);
    } catch (err) {
        console.error('Investigation failed:', err);
        process.exit(1);
    }
}

check();
