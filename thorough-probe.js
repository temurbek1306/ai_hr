import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function thoroughProbe() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const timestamp = Date.now();
    const empEmail = `v_probe_${timestamp}@test.com`;
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Test with Video ---');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Probe Test ${timestamp}`,
            type: 'GENERAL',
            passScore: 70,
            videoUrl: videoUrl,
            questions: [{ questionText: 'V?', options: ['Y', 'N'], correctAnswer: 'Y' }]
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        const testBody = testRes.data.body || testRes.data;
        const testId = testBody.id;
        console.log('Test Created ID:', testId);
        console.log('Test Created VideoUrl (Admin):', testBody.videoUrl || 'MISSING');

        console.log('--- 3. Create Employee with Video ---');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Video',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998901234567',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01',
            videoUrl: videoUrl
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        const empBody = empRes.data.body || empRes.data;
        const empId = empBody.id;
        console.log('Employee Created ID:', empId);
        console.log('Employee Created VideoUrl (Admin):', empBody.videoUrl || 'MISSING');

        console.log('--- 4. Assign Test to Employee ---');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log('--- 5. User Registration & Login ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Video Probe',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998901234567'
        });
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const token = loginRes.data.body.token;

        console.log('--- 6. Check USER /me ---');
        const me = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: { Authorization: `Bearer ${token}` } });
        console.log('User /me videoUrl:', me.data.body.videoUrl || 'NOT FOUND');

        console.log('--- 7. Check USER /available tests ---');
        const avail = await axios.get(`${BASE_URL}/api/v1/tests/available`, { headers: { Authorization: `Bearer ${token}` } });
        const tests = avail.data.body || avail.data || [];
        const relevantTest = Array.isArray(tests) ? tests.find(t => t.id === testId) : null;
        console.log('User /available test videoUrl:', relevantTest?.videoUrl || 'NOT FOUND');

        if (relevantTest) {
            console.log('Relevant Test full data:', JSON.stringify(relevantTest, null, 2));
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, e.response?.data || e.message);
    }
}

thoroughProbe();
