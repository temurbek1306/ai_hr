
const axios = require('axios');

async function testTUser() {
    const username = 't@uz.com';
    const password = 'test_bypass';

    try {
        console.log(`--- Logging in as ${username} ---`);
        const loginRes = await axios.post('http://localhost:8000/api/v1/auth/login', {
            username,
            password
        });

        const token = loginRes.data.body.token;
        console.log('✅ Logged in. Token found.');

        const testId = 'a34bd657-90cf-40ff-86e0-0c8ddb8c84db';
        console.log(`--- Starting session for test ${testId} ---`);

        try {
            const startRes = await axios.post(`http://localhost:8000/api/v1/tests/${testId}/start`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Session started:', JSON.stringify(startRes.data, null, 2));
        } catch (err) {
            console.error('❌ Failed to start session:', err.response ? err.response.status : err.message);
            if (err.response) {
                console.error('Response data:', JSON.stringify(err.response.data, null, 2));
            }
        }
    } catch (err) {
        console.error('❌ Login failed:', err.response ? err.response.status : err.message);
        if (err.response) {
            console.error('Response data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

testTUser();
