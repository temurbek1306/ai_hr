import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function diagnoseBot() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const ts = Date.now();
    const email = `diag_bot_${ts}@test.com`;

    try {
        console.log('1. Admin Login');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;
        const adminHeaders = { Authorization: `Bearer ${adminToken}` };

        console.log('2. Create Test');
        const testRes = await axios.post(`${BASE_URL}/api/v1/tests`, {
            title: `Bot Diag Test ${ts}`,
            type: 'GENERAL',
            passScore: 70,
            questions: [{ questionText: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
        }, { headers: adminHeaders });
        const testId = testRes.data.body.id;

        console.log('3. Create Employee');
        const empRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, {
            firstName: 'BotDiag', lastName: 'User', email, phone: '+998908889900',
            position: 'Tester', department: 'QA', startDate: '2024-01-01'
        }, { headers: adminHeaders });
        const empId = empRes.data.body.id;

        console.log('4. Assign Test');
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST', referenceId: testId
        }, { headers: adminHeaders });

        console.log('5. User Register & Login');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Bot Diag User', username: email, password: 'password123', phoneNumber: '+998908889900'
        });
        const userLogin = await axios.post(`${BASE_URL}/auth/login`, { username: email, password: 'password123' });
        const userToken = userLogin.data.body.token;
        const userHeaders = { Authorization: `Bearer ${userToken}` };

        console.log('6. User Check /me');
        const me = await axios.get(`${BASE_URL}/api/v1/employees/me`, { headers: userHeaders });
        const myId = me.data.body.id;

        console.log('7. Try Bot assignments endpoint');
        try {
            const botRes = await axios.get(`${BASE_URL}/api/v1/bot/assignments?employeeId=${myId}`, { headers: userHeaders });
            console.log('Bot endpoint saw:', JSON.stringify(botRes.data.body || botRes.data, null, 2));
        } catch (e) {
            console.log('Bot endpoint failed:', e.response?.status, e.response?.data);
        }

    } catch (e) {
        console.error('Diag failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

diagnoseBot();
