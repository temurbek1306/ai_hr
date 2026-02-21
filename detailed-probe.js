import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function run() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    try {
        const login = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const token = login.data.body.token;
        const auth = { headers: { Authorization: `Bearer ${token}` } };

        console.log('--- 1. User available tests (Admin token can also try) ---');
        const res = await axios.get(`${BASE_URL}/api/v1/tests/available`, auth);
        const tests = res.data.body || res.data;
        console.log('Full first test object:', JSON.stringify(tests[0], null, 2));

        console.log('--- 2. User summary ---');
        const sum = await axios.get(`${BASE_URL}/api/v1/employees/me/summary`, auth);
        console.log('Summary:', JSON.stringify(sum.data, null, 2));

        console.log('--- 3. Check for specific assignment keywords in keys ---');
        const allKeys = new Set();
        tests.forEach(t => Object.keys(t).forEach(k => allKeys.add(k)));
        console.log('Unique keys in available tests:', Array.from(allKeys));

    } catch (e) {
        console.error('Failed:', e.message);
    }
}

run();
