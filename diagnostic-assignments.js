import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function diagnose() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const ts = Date.now();
    const email = `diag_v3_${ts}@test.com`;

    try {
        console.log('1. Admin Login');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body?.token || adminLogin.data.token;
        const adminHeaders = { Authorization: `Bearer ${adminToken}` };

        console.log('2. Create Test');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Diag Test ${ts}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers: adminHeaders });
        const testId = testRes.data.body?.id || testRes.data.id;
        console.log('Test ID:', testId);

        console.log('3. Create Employee');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Diag', lastName: 'User', email, phone: '+998907778899',
            position: 'Tester', department: 'QA', startDate: '2024-01-01'
        }, { headers: adminHeaders });
        const empId = empRes.data.body?.id || empRes.data.id;
        console.log('Emp ID:', empId);

        console.log('4. Assign Test');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST', referenceId: testId
        }, { headers: adminHeaders });

        console.log('5. Admin Check Assignments');
        const adminCheck = await axios.get(`${BASE_URL}/api/v1/employees/${empId}/assignments`, { headers: adminHeaders });
        const adminAsgns = adminCheck.data.body || adminCheck.data;
        console.log('Admin saw:', Array.isArray(adminAsgns) ? adminAsgns.length : 'NOT ARRAY', 'assignments');

        console.log('6. User Register & Login');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Diag User', username: email, password: 'password123', phoneNumber: '+998907778899'
        });
        const userLogin = await axios.post(`${BASE_URL}/auth/login`, { username: email, password: 'password123' });
        const userToken = userLogin.data.body?.token || userLogin.data.token;
        const userHeaders = { Authorization: `Bearer ${userToken}` };

        console.log('7. User Check /me');
        const me = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: userHeaders });
        const myId = me.data.body?.id || me.data.id;
        console.log('User ID from /me:', myId);

        console.log('8. User Check Assignments (by ID)');
        const userCheck1 = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/assignments`, { headers: userHeaders });
        const userAsgns1 = userCheck1.data.body || userCheck1.data;
        console.log('User saw (by ID):', Array.isArray(userAsgns1) ? userAsgns1.length : 'NOT ARRAY');
        console.log('User assignments content:', JSON.stringify(userAsgns1, null, 2));

        console.log('9. User Check /tests/available');
        const avail = await axios.get(`${BASE_URL}/api/v1/tests/available`, { headers: userHeaders });
        const list = avail.data.body || avail.data;
        console.log('Available tests count:', Array.isArray(list) ? list.length : 'NOT ARRAY');

    } catch (e) {
        console.error('Diag failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

diagnose();
