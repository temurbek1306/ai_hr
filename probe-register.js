import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function probeRegister() {
    try {
        // Test 1: Try /auth/register with full employee fields
        console.log('=== Test 1: POST /auth/register with all fields ===');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                fullName: 'Test Xodim',
                username: 'test.xodim@test.com',
                password: 'test123',
                phoneNumber: '+998901234567',
                age: 25,
                firstName: 'Test',
                lastName: 'Xodim',
                phone: '+998901234567',
                position: 'Dasturchi',
                department: 'IT',
                startDate: '2024-01-01'
            });
            console.log('Status:', res.status);
            console.log('Response:', JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log('Error:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
        }

        // Test 2: Check what /auth/register accepts minimally
        console.log('\n=== Test 2: POST /auth/register minimal ===');
        try {
            const res = await axios.post(`${API_URL}/auth/register`, {
                fullName: 'Test User2',
                username: 'testuser2@test.com',
                password: 'test123'
            });
            console.log('Status:', res.status);
            console.log('Response:', JSON.stringify(res.data, null, 2));

            // Now try to login with this user
            console.log('\n=== Test 3: Login with registered user ===');
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                username: 'testuser2@test.com',
                password: 'test123'
            });
            console.log('Login Status:', loginRes.status);
            console.log('Login Response:', JSON.stringify(loginRes.data, null, 2));
        } catch (e) {
            console.log('Error:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
        }

    } catch (error) {
        console.error('Fatal error:', error.message);
    }
}

probeRegister();
