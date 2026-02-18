import axios from 'axios';

const API_BASE = 'http://94.241.141.229:8000';

async function login() {
    try {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            username: 'admin@gmail.com',
            password: 'admin123'
        });
        return response.data.body.token;
    } catch (error) {
        return null;
    }
}

async function probeExport(url, token, label) {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'arraybuffer'
        });
        console.log(`RESULT_FOR_${label}: SUCCESS (Status: ${response.status}, Size: ${response.data.byteLength})`);
    } catch (error) {
        console.log(`RESULT_FOR_${label}: FAILED (Status: ${error.response?.status})`);
    }
}

async function main() {
    const token = await login();
    if (!token) {
        console.log('LOGIN_FAILED');
        return;
    }

    await probeExport(`${API_BASE}/api/v1/admin/employees/export`, token, 'ADMIN_PATH');
    await probeExport(`${API_BASE}/api/v1/employees/export`, token, 'USER_PATH');
}

main();
