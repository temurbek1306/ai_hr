
const axios = require('axios');

async function testBypass() {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/auth/login', {
            username: 'admin',
            password: 'test_bypass'
        });
        console.log('Login Bypass Success:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error('Login Failed with Status:', error.response.status);
            console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Login Error:', error.message);
        }
    }
}

testBypass();
