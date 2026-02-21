import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeVisibility() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const timestamp = Date.now();
    const empEmail = `vis_probe_${timestamp}@test.com`;

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Test ---');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Vis Test ${timestamp}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const testId = testRes.data.body?.id || testRes.data.id;
        console.log('Test ID:', testId);

        console.log('--- 3. Create Employee ---');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Vis',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998903334455',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const empId = empRes.data.body?.id || empRes.data.id;
        console.log('Emp ID:', empId);

        console.log('--- 4. Assign Test ---');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log('--- 5. Verify Assignment as Admin ---');
        const checkAsgn = await axios.get(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Admin check assignments:', JSON.stringify(checkAsgn.data.body || checkAsgn.data, null, 2));

        console.log('--- 6. Register & Login as User ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Vis User',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998903334455'
        });
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const token = loginRes.data.body.token;

        console.log('--- 7. Check /me ---');
        const meRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: { Authorization: `Bearer ${token}` } });
        const myId = meRes.data.body.id;
        console.log('My /me ID:', myId);

        console.log('--- 8. Verify Assignment as User ---');
        try {
            const userAsgn = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/assignments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('User check assignments:', JSON.stringify(userAsgn.data.body || userAsgn.data, null, 2));
        } catch (err) {
            console.log('User check assignments failed:', err.response?.status);
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeVisibility();
