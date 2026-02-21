import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function debugUser() {
    try {
        console.log('--- User Login ---');
        // Let's try with a known user if possible, or register new
        const email = `debug${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, {
            fullName: 'Debug User',
            username: email,
            password: 'password123',
            phoneNumber: '+998901234567'
        });

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: email,
            password: 'password123'
        });
        const userToken = loginRes.data.body.token;
        console.log('User Login OK');

        const userEndpoints = [
            '/api/v1/employees/me',
            '/api/v1/employees/me/summary',
            '/api/v1/employees/me/test-results'
        ];

        for (const ep of userEndpoints) {
            console.log(`\nTesting User endpoint: ${ep}`);
            try {
                const res = await axios.get(`${API_URL}${ep}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log('Status:', res.status);
                console.log('Keys:', Object.keys(res.data));
                if (res.data.body) {
                    console.log('Body data:', JSON.stringify(res.data.body).substring(0, 200));
                }
            } catch (e) {
                console.log(`Failed ${ep}:`, e.response?.status, e.response?.data?.message || e.response?.data || e.message);
            }
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

debugUser();
