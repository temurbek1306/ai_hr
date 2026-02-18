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
        console.log('LOGIN_FAILED: ' + (error.response?.status || error.message));
        return null;
    }
}

async function check(url, method = 'GET', token, label) {
    try {
        const response = await axios({
            method,
            url,
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`PROBE_${label}: SUCCESS (${response.status})`);
    } catch (error) {
        console.log(`PROBE_${label}: FAILED (${error.response?.status || 'ERROR'})`);
    }
}

async function main() {
    const token = await login();
    if (!token) return;

    await check(`${API_BASE}/api/v1/admin/employees`, 'GET', token, 'ADMIN_LIST');
    await check(`${API_BASE}/api/v1/admin/employees/export`, 'GET', token, 'ADMIN_EXPORT');
    await check(`${API_BASE}/api/v1/employees/export`, 'GET', token, 'USER_EXPORT');
    await check(`${API_BASE}/api/v1/admin/employees/import`, 'POST', token, 'ADMIN_IMPORT');
    await check(`${API_BASE}/api/v1/employees/import`, 'POST', token, 'USER_IMPORT');
    await check(`${API_BASE}/api/v1/tests/available`, 'GET', token, 'TESTS_AVAILABLE');
    await check(`${API_BASE}/api/v1/nda/current`, 'GET', token, 'NDA_CURRENT');
    await check(`${API_BASE}/api/v1/knowledge/articles`, 'GET', token, 'KB_ARTICLES');
    await check(`${API_BASE}/api/v1/knowledge/categories`, 'GET', token, 'KB_CATEGORIES');
}

main();
