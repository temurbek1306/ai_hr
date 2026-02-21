import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeDetails() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const timestamp = Date.now();
    const empEmail = `det_probe_${timestamp}@test.com`;

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;
        const headers = { Authorization: `Bearer ${adminToken}` };

        console.log('--- 2. Create Test ---');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Det Test ${timestamp}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers });
        const testId = testRes.data.body?.id || testRes.data.id;
        console.log('Test ID:', testId);

        console.log('--- 3. Create Employee ---');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Det',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998905556677',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01'
        }, { headers });
        const empId = empRes.data.body?.id || empRes.data.id;
        console.log('Emp ID:', empId);

        console.log('--- 4. Assign Test ---');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers });

        console.log('--- 5. Get Assignments AS ADMIN ---');
        const adminAsgn = await axios.get(`${BASE_URL}/api/v1/employees/${empId}/assignments`, { headers });
        console.log('Admin saw assignments:', JSON.stringify(adminAsgn.data, null, 2));

        console.log('--- 6. Register & Login AS USER ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Det User',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998905556677'
        });
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const userToken = loginRes.data.body.token;
        const userHeaders = { Authorization: `Bearer ${userToken}` };

        console.log('--- 7. Check /me ---');
        const meRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: userHeaders });
        const myId = meRes.data.body.id;
        console.log('My /me ID:', myId);

        console.log('--- 8. Get Assignments AS USER ---');
        try {
            const userAsgn = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/assignments`, { headers: userHeaders });
            console.log('User saw assignments:', JSON.stringify(userAsgn.data, null, 2));
        } catch (err) {
            console.log('User assignment fetch failed:', err.response?.status, err.response?.data);
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeDetails();
