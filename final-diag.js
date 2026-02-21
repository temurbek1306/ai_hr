import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function run() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const ts = Date.now();
    const email = `final_${ts}@test.com`;

    try {
        console.log('1. Admin Login');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('2. Create Employee');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'Final', lastName: 'User', email, phone: '+998909990011',
            position: 'Tester', department: 'QA', startDate: '2024-01-01'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        const empId = empRes.data.body.id;

        console.log('3. Register & Login User');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Final User', username: email, password: 'password123', phoneNumber: '+998909990011'
        });
        const userLogin = await axios.post(`${BASE_URL}/auth/login`, { username: email, password: 'password123' });
        const userToken = userLogin.data.body.token;
        const auth = { headers: { Authorization: `Bearer ${userToken}` } };

        console.log('4. Check /me/assignments (User token)');
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/employees/me/assignments`, auth);
            console.log('/me/assignments response:', JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log('/me/assignments failed:', e.response?.status);
        }

        console.log('5. Check /employees/{id}/assignments (User token)');
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/employees/${empId}/assignments`, auth);
            console.log(`/employees/${empId}/assignments response:`, JSON.stringify(res.data, null, 2));
        } catch (e) {
            console.log(`/employees/${empId}/assignments failed:`, e.response?.status);
        }

        console.log('6. Check /tests/available (User token)');
        const res3 = await axios.get(`${BASE_URL}/api/v1/tests/available`, auth);
        const tests = res3.data.body || res3.data;
        console.log('Available tests sample:', JSON.stringify(tests.slice(0, 1), null, 2));

    } catch (e) {
        console.error('Final diag failed:', e.message);
    }
}

run();
