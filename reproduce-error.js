import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function reproduceError() {
    const timestamp = Date.now();
    const testUser = {
        fullName: `Test User ${timestamp}`,
        username: `test${timestamp}@example.com`,
        password: 'password123',
        phoneNumber: '+998901234567'
    };

    try {
        console.log('--- Registering ---');
        await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('Registration successful');

        console.log('\n--- Logging in ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: testUser.username,
            password: testUser.password
        });
        const token = loginRes.data.body.token;
        console.log('Login successful');

        console.log('\n--- Fetching available tests ---');
        const testsRes = await axios.get(`${API_URL}/api/v1/tests/available`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Status:', testsRes.status);
        console.log('Data:', JSON.stringify(testsRes.data, null, 2));
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

reproduceError();
