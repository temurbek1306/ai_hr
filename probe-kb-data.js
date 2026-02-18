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
        const response = await axios.get(`${API_BASE}/api/v1/knowledge/articles`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('--- KB ARTICLES RESPONSE ---');
        console.log('Full data:', JSON.stringify(response.data).substring(0, 500));
        console.log('Is array?', Array.isArray(response.data));
    } catch (error) {
        console.error('Failed:', error.response?.status);
    }
}

main();
