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

        console.log('\n--- Fetching available tests (to see if any exist) ---');
        const testsRes = await axios.get(`${API_URL}/api/v1/tests/available`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Available tests counts:', testsRes.data.body?.length || 0);

        console.log('\n--- Fetching test results (api/v1/employees/me/test-results) ---');
        const resultsRes = await axios.get(`${API_URL}/api/v1/employees/me/test-results`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Status:', resultsRes.status);
        console.log('Data:', JSON.stringify(resultsRes.data, null, 2));

        console.log('\n--- Fetching employee summary (api/v1/analytics/employees/me/summary) ---');
        try {
            const summaryRes = await axios.get(`${API_URL}/api/v1/analytics/employees/me/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Summary Result:', JSON.stringify(summaryRes.data, null, 2));
        } catch (e) {
            console.log('Summary error:', e.response?.status, e.response?.data?.message);
        }

    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testResultsAPI();
