import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeTests() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Fetch All Tests as Admin ---');
        const adminTestsRes = await axios.get(`${BASE_URL}/api/v1/admin/tests`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const tests = adminTestsRes.data.body || [];
        console.log('Admin Test Count:', tests.length);
        if (tests.length > 0) {
            console.log('First Test Admin Data:', JSON.stringify(tests[0], null, 2));
        }

        // Create a test with video if none exists
        if (tests.length === 0 || !tests[0].videoUrl) {
            console.log('--- 3. Creating Test with Video ---');
            await axios.post(`${BASE_URL}/api/v1/admin/tests`, {
                title: 'Video Test',
                type: 'GENERAL',
                passScore: 70,
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                questions: [
                    { questionText: 'Is this a video?', options: ['Yes', 'No'], correctAnswer: 'Yes' }
                ]
            }, { headers: { Authorization: `Bearer ${adminToken}` } });
        }

        console.log('--- 4. Fetch Available Tests as USER ---');
        // Let's use a real user if possible, or create one
        const empEmail = `test_video_${Date.now()}@test.com`;
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Test User',
            username: empEmail,
            password: 'password123'
        });
        const empLogin = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const empToken = empLogin.data.body.token;

        const userTestsRes = await axios.get(`${BASE_URL}/api/v1/tests`, {
            headers: { Authorization: `Bearer ${empToken}` }
        });
        const userTests = userTestsRes.data.body || [];
        console.log('User Available Test Count:', userTests.length);
        if (userTests.length > 0) {
            console.log('First Test User Data:', JSON.stringify(userTests[0], null, 2));
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeTests();
