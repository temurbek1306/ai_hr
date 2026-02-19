import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function probeTests() {
    try {
        console.log('Logging in...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin@gmail.com',
            password: 'admin123'
        });
        const token = loginResponse.data.token || loginResponse.data.body?.token;
        console.log('Login successful, token obtained.');

        console.log('Fetching tests...');
        const response = await axios.get(`${API_URL}/api/v1/tests`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Status:', response.status);
        console.log('Data structure sample (first 2 items):', JSON.stringify(response.data.slice(0, 2), null, 2));

        let tests = response.data.body || response.data;
        if (Array.isArray(tests) && tests.length > 0) {
            const firstTestId = tests[0].id;
            console.log(`\nFetching details for test ID: ${firstTestId}...`);
            const detailResponse = await axios.get(`${API_URL}/api/v1/tests/${firstTestId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Detail Status:', detailResponse.status);
            console.log('Detail FULL sample:', JSON.stringify(detailResponse.data.body || detailResponse.data, null, 2));
        } else {
            console.log('No tests found or data is not an array.');
        }
    } catch (error) {
        console.error('Error probing tests:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

probeTests();
