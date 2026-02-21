import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function debugSelfProfile() {
    const timestamp = Date.now();
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const empEmail = `kb_self_${timestamp}@test.com`;
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Employee with Video ---');
        const empData = {
            firstName: 'Self',
            lastName: 'Probe',
            email: empEmail,
            phone: '+998901112233',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01',
            videoUrl: videoUrl
        };
        const createRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, empData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const empId = createRes.data.body.id;
        console.log('Employee Created:', empId);

        console.log('--- 3. Register as Employee ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Self Probe',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998901112233'
        });

        console.log('--- 4. Login as Employee ---');
        const empLogin = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const empToken = empLogin.data.body.token;

        console.log('--- 5. Fetch /me ---');
        const meRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, {
            headers: { Authorization: `Bearer ${empToken}` }
        });
        const myId = meRes.data.body.id;
        console.log('My ID from /me:', myId);

        console.log('--- 6. Fetch /api/v1/employees/{id}/profile as USER ---');
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/v1/employees/${myId}/profile`, {
                headers: { Authorization: `Bearer ${empToken}` }
            });
            console.log('User profile fetch status:', profileRes.status);
            console.log('User profile VideoUrl:', profileRes.data.body.videoUrl || 'MISSING');
        } catch (err) {
            console.log('User profile fetch FAILED:', err.response?.status, err.response?.data?.message);
        }

    } catch (e) {
        console.error('Debug failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

debugSelfProfile();
