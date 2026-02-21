import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function debugDashboard() {
    try {
        console.log('--- Admin Login ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin@gmail.com',
            password: 'admin123'
        });
        const adminToken = adminLogin.data.body.token;
        console.log('Admin Login OK');

        const endpoints = [
            '/api/v1/admin/dashboard',
            '/api/v1/admin/dashboard/summary',
            '/api/v1/admin/dashboard/extended-stats',
            '/api/v1/admin/activities'
        ];

        for (const ep of endpoints) {
            console.log(`\nTesting Admin endpoint: ${ep}`);
            try {
                const res = await axios.get(`${API_URL}${ep}`, {
                    headers: { Authorization: `Bearer ${adminToken}` }
                });
                console.log('Status:', res.status);
                // Print keys to see if it's wrapped in body
                console.log('Keys:', Object.keys(res.data));
                if (res.data.body) {
                    console.log('Body is present. Data sample:', JSON.stringify(res.data.body).substring(0, 100));
                } else {
                    console.log('No body field. Data sample:', JSON.stringify(res.data).substring(0, 100));
                }
            } catch (e) {
                console.log(`Failed ${ep}:`, e.response?.status, e.response?.data?.message || e.message);
            }
        }

        console.log('\n--- User Login (me check) ---');
        const userLogin = await axios.post(`${API_URL}/auth/register`, {
            fullName: 'Debug User',
            username: `debug${Date.now()}@test.com`,
            password: 'password123',
            phoneNumber: '+998901234567'
        });

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: userLogin.data.body.username,
            password: 'password123'
        });
        const userToken = loginRes.data.body.token;
        console.log('User Login OK');

        const userEndpoints = [
            '/api/v1/employees/me',
            '/api/v1/employees/me/test-results',
            '/api/v1/employees/me/summary'
        ];

        for (const ep of userEndpoints) {
            console.log(`\nTesting User endpoint: ${ep}`);
            try {
                const res = await axios.get(`${API_URL}${ep}`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log('Status:', res.status);
                console.log('Keys:', Object.keys(res.data));
            } catch (e) {
                console.log(`Failed ${ep}:`, e.response?.status, e.response?.data?.message || e.response?.data || e.message);
            }
        }

    } catch (error) {
        console.error('Fatal Error:', error.message);
    }
}

debugDashboard();
