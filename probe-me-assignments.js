import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeMeAssignments() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const timestamp = Date.now();
    const empEmail = `asgn_me_${timestamp}@test.com`;

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Test ---');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Assigned Test ${timestamp}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const testId = testRes.data.body?.id || testRes.data.id;

        console.log('--- 3. Create Employee ---');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'MeAsgn',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998902223344',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const empId = empRes.data.body?.id || empRes.data.id;

        console.log('--- 4. Assign Test ---');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log('--- 5. Employee Auth ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'MeAsgn Probe',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998902223344'
        });
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const token = loginRes.data.body.token;

        console.log('--- 6. Try /api/v1/employees/me/assignments ---');
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/employees/me/assignments`, { headers: { Authorization: `Bearer ${token}` } });
            console.log('Me Assignments:', JSON.stringify(res.data.body || res.data, null, 2));
        } catch (err) {
            console.log('/me/assignments failed:', err.response?.status);
        }

        console.log('--- 7. Get Profile and then Assignments by ID ---');
        const profileRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: { Authorization: `Bearer ${token}` } });
        const myId = profileRes.data.body.id;
        console.log('My ID from /me:', myId);
        console.log('Emp ID from creation:', empId);

        try {
            const res = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/assignments`, { headers: { Authorization: `Bearer ${token}` } });
            console.log(`Assignments by ID ${myId}:`, JSON.stringify(res.data.body || res.data, null, 2));
        } catch (err) {
            console.log(`Assignments by ID failed:`, err.response?.status);
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeMeAssignments();
