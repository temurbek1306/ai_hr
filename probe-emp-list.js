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

async function main() {
    const token = await login();
    if (!token) return;

    try {
        const response = await axios.get(`${API_BASE}/api/v1/admin/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('--- ADMIN EMPLOYEES RESPONSE ---');
        console.log('Type of data:', typeof response.data);
        console.log('Is Array?', Array.isArray(response.data));
        console.log('Keys:', Object.keys(response.data));
        if (response.data.body) {
            console.log('Body is Array?', Array.isArray(response.data.body));
            console.log('Body length:', response.data.body.length);
        }
    } catch (error) {
        console.error('Failed:', error.response?.status);
    }
}

main();
