import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000'; // Direct backend for debugging

async function testAuthFlow() {
    const timestamp = Date.now();
    const testUser = {
        fullName: `Test User ${timestamp}`,
        username: `test_${timestamp}@example.com`,
        password: 'password123',
        phoneNumber: '+998901234567'
    };

    console.log('--- Step 1: Registration ---');
    try {
        const regResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('Registration Status:', regResponse.status);
        console.log('Registration Body:', JSON.stringify(regResponse.data, null, 2));
    } catch (error) {
        console.error('Registration Failed:', error.response?.status, error.response?.data);
        if (error.response?.status === 404) {
            console.log('Trying /api/v1/auth/register...');
            try {
                const regResponse = await axios.post(`${BASE_URL}/api/v1/auth/register`, testUser);
                console.log('Registration Status (v1):', regResponse.status);
                console.log('Registration Body (v1):', JSON.stringify(regResponse.data, null, 2));
                testUser._v1 = true;
            } catch (v1Error) {
                console.error('Registration (v1) Failed:', v1Error.response?.status, v1Error.response?.data);
                return;
            }
        } else {
            return;
        }
    }

    console.log('\n--- Step 2: Login ---');
    const loginPath = testUser._v1 ? '/api/v1/auth/login' : '/auth/login';
    try {
        const loginResponse = await axios.post(`${BASE_URL}${loginPath}`, {
            username: testUser.username,
            password: testUser.password
        });
        console.log('Login Status:', loginResponse.status);
        console.log('Login Body:', JSON.stringify(loginResponse.data, null, 2));

        if (loginResponse.data.success && loginResponse.data.body) {
            console.log('Role found:', loginResponse.data.body.role);
        }
    } catch (error) {
        console.error('Login Failed:', error.response?.status, error.response?.data);
    }
}

testAuthFlow();
