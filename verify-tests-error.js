import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function testAvailableTests() {
    const credentials = {
        username: 'test1740003204123@example.com', // I'll search for a real one if this fails
        password: 'password123'
    };

    try {
        console.log('--- Logging in ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, credentials);
        const token = loginRes.data.body.token;
        console.log('Login successful');

        console.log('\n--- Fetching available tests ---');
        const testsRes = await axios.get(`${API_URL}/api/v1/tests/available`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Status:', testsRes.status);
        console.log('Data:', JSON.stringify(testsRes.data, null, 2));
    } catch (error) {
        console.error('Error:', error.response?.status, JSON.stringify(error.response?.data, null, 2));
    }
}

testAvailableTests();
