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
        console.log('Login successful.');

        console.log('\nFetching tests list...');
        const response = await axios.get(`${API_URL}/api/v1/tests`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('List Status:', response.status);
        console.log('List Data Type:', typeof response.data);

        let tests = response.data.body || response.data;
        if (Array.isArray(tests) && tests.length > 0) {
            console.log(`Found ${tests.length} tests.`);
            const firstId = tests[0].id;
            console.log(`\nFetching details for test ID: ${firstId}...`);

            const detailResponse = await axios.get(`${API_URL}/api/v1/tests/${firstId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Detail Status:', detailResponse.status);
            console.log('Detail FULL Response:', JSON.stringify(detailResponse.data, null, 2));
        } else {
            console.log('No tests found or response is not an array.');
            console.log('Full Response:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

probeTests();
