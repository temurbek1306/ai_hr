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

async function probeContent(url, token, label) {
    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`--- ${label} ---`);
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log(`--- ${label} FAILED ---`);
        console.log(error.response?.status);
        console.log(JSON.stringify(error.response?.data, null, 2));
    }
}

async function main() {
    const token = await login();
    if (!token) return;

    await probeContent(`${API_BASE}/api/v1/nda/current`, token, 'NDA_CURRENT');
    await probeContent(`${API_BASE}/api/v1/tests/available`, token, 'TESTS_AVAILABLE');
}

main();
