import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function testResultsAPI() {
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
        console.log('Available tests counts:', testsRes.data.body?.length || 0);

        console.log('\n--- Fetching test results (api/v1/employees/me/test-results) ---');
        try {
            const resultsRes = await axios.get(`${API_URL}/api/v1/employees/me/test-results`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Results Status:', resultsRes.status);
            console.log('Results Body Type:', Array.isArray(resultsRes.data.body) ? 'Array' : typeof resultsRes.data.body);
            console.log('Results Data:', JSON.stringify(resultsRes.data.body, null, 2));
        } catch (e) {
            console.log('Results endpoint error:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testResultsAPI();
