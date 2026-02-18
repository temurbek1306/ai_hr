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
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const isWrapper = response.data && typeof response.data === 'object' && 'body' in response.data;
        console.log(`${label}: [${isWrapper ? 'WRAPPER' : 'RAW'}] keys: ${Object.keys(response.data)}`);
    } catch (error) {
        console.log(`${label}: FAILED (${error.response?.status})`);
    }
}

async function main() {
    const token = await login();
    if (!token) return;

    await probe(`${API_BASE}/api/v1/tests`, token, 'TESTS');
    await probe(`${API_BASE}/api/v1/surveys`, token, 'SURVEYS');
    await probe(`${API_BASE}/api/v1/knowledge/categories`, token, 'KB_CATS');
    await probe(`${API_BASE}/api/v1/knowledge/articles`, token, 'KB_ARTS');
}

main();
