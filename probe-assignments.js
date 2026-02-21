import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeAssignments() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const timestamp = Date.now();
    const empEmail = `asgn_p_${timestamp}@test.com`;

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Test ---');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Asgn Test ${timestamp}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        const testData = testRes.data.body || testRes.data;
        if (!testData?.id) {
            console.error('Test creation failed:', JSON.stringify(testRes.data, null, 2));
            return;
        }
        const testId = testData.id;
        console.log('Test ID:', testId);

        console.log('--- 3. Create Employee ---');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Asgn',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998901112233',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        const empData = empRes.data.body || empRes.data;
        if (!empData?.id) {
            console.error('Employee creation failed:', JSON.stringify(empRes.data, null, 2));
            return;
        }
        const empId = empData.id;
        console.log('Employee ID:', empId);

        console.log('--- 4. Assign Test ---');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log('--- 5. Employee Auth ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Asgn Probe',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998901112233'
        });
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const token = loginRes.data.body.token;

        console.log('--- 6. Get Profile to get ID ---');
        const profile = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: { Authorization: `Bearer ${token}` } });
        const myId = profile.data.body.id;
        console.log('My ID:', myId);

        console.log('--- 7. Get My Assignments ---');
        try {
            const asgnRes = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/assignments`, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Assignments:', JSON.stringify(asgnRes.data.body || asgnRes.data, null, 2));
        } catch (err) {
            console.log('Failed to get assignments:', err.response?.status, JSON.stringify(err.response?.data, null, 2));
        }

        console.log('--- 8. Get Available Tests ---');
        const avail = await axios.get(`${BASE_URL}/api/v1/tests/available`, { headers: { Authorization: `Bearer ${token}` } });
        const availData = avail.data.body || avail.data;
        console.log('Available tests count:', Array.isArray(availData) ? availData.length : 'NOT ARRAY');

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeAssignments();
