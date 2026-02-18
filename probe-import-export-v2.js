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

async function check(url, token, label) {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`${label}: SUCCESS (${response.status})`);
    } catch (error) {
        console.log(`${label}: FAILED (${error.response?.status})`);
    }
}

async function main() {
    const token = await login();
    if (!token) return;

    await check(`${API_BASE}/api/v1/admin/employees/export`, token, 'ADMIN_EXPORT');
    await check(`${API_BASE}/api/v1/employees/export`, token, 'USER_EXPORT');
    await check(`${API_BASE}/api/v1/admin/employees/import`, token, 'ADMIN_IMPORT');
    await check(`${API_BASE}/api/v1/employees/import`, token, 'USER_IMPORT');
}

main();
