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
        // Get first employee ID from the list
        const listResponse = await axios.get(`${API_BASE}/api/v1/admin/employees`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const firstId = listResponse.data.body[0].id;

        const response = await axios.get(`${API_BASE}/api/v1/admin/employees/${firstId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('--- SINGLE EMPLOYEE RESPONSE ---');
        console.log('Keys:', Object.keys(response.data));
        if (response.data.body) {
            console.log('Has body field');
        }
    } catch (error) {
        console.error('Failed:', error.response?.status);
    }
}

main();
