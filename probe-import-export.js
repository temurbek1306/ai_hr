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

async function probe(url, token, label) {
    try {
        // Just use GET for export and HEAD or small POST for import if we wanted to be thorough, 
        // but let's just check GET /export vs GET /admin/export first.
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`URL: ${url} -> SUCCESS (${response.status})`);
    } catch (error) {
        console.log(`URL: ${url} -> FAILED (${error.response?.status})`);
    }
}

async function main() {
    const token = await login();
    if (!token) return;

    console.log('--- EXPORT PROBE ---');
    await probe(`${API_BASE}/api/v1/admin/employees/export`, token, 'ADMIN_EXPORT');
    await probe(`${API_BASE}/api/v1/employees/export`, token, 'USER_EXPORT');

    console.log('--- IMPORT PROBE (using GET to check path existence) ---');
    await probe(`${API_BASE}/api/v1/admin/employees/import`, token, 'ADMIN_IMPORT');
    await probe(`${API_BASE}/api/v1/employees/import`, token, 'USER_IMPORT');
}

main();
