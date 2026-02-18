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

async function probePost(url, token, label) {
    try {
        // Send empty formData just to see if we get a 400 (Bad Request) or 404/403
        // If we get 400 or 422, it means the endpoint exists and is reachable.
        const response = await axios.post(url, {}, {
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

    await probePost(`${API_BASE}/api/v1/admin/employees/import`, token, 'ADMIN_IMPORT');
    await probePost(`${API_BASE}/api/v1/employees/import`, token, 'USER_IMPORT');
}

main();
