import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function testAuthMismatch() {
    const timestamp = Date.now();
    const testUser = {
        fullName: `Auth Test ${timestamp}`,
        username: `auth_${timestamp}@test.com`,
        password: 'password123',
        phoneNumber: '+998901234567'
    };

    console.log('--- Registering user with username = email ---');
    try {
        await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('Reg OK');
    } catch (e) {
        console.log('Reg Failed', e.response?.data);
        return;
    }

    console.log('\n--- Attempt 1: Login with email (username field) ---');
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            username: testUser.username,
            password: testUser.password
        });
        console.log('Login with email:', res.status, res.data.success ? 'Success' : 'Fail');
    } catch (e) {
        console.log('Login with email failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }

    console.log('\n--- Attempt 2: Login with fullName (username field) ---');
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            username: testUser.fullName,
            password: testUser.password
        });
        console.log('Login with fullName:', res.status, res.data.success ? 'Success' : 'Fail');
    } catch (e) {
        console.log('Login with fullName failed:', e.response?.status);
    }
}

testAuthMismatch();
