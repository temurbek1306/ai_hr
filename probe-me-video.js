import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeEnhanced() {
    const timestamp = Date.now();
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };
    const empEmail = `emp_video_${timestamp}@test.com`;
    const empData = {
        firstName: 'Video',
        lastName: 'Target',
        email: empEmail,
        phone: '+998900000000',
        position: 'Developer',
        department: 'IT',
        startDate: '2024-01-01',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    };

    try {
        console.log('--- Admin Login ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- Admin Creating Employee with Video ---');
        const createRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, empData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const empId = createRes.data.body.id;
        console.log('Employee Created ID:', empId);

        console.log('--- Employee Registering (to set password) ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Video Target',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998900000000'
        });

        console.log('--- Employee Login ---');
        const empLogin = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const empToken = empLogin.data.body.token;

        console.log('--- Fetching /me for Employee ---');
        const meRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, {
            headers: { Authorization: `Bearer ${empToken}` }
        });

        console.log('Profile Body VideoUrl:', meRes.data.body.videoUrl);
        console.log('videoUrl present?', !!meRes.data.body.videoUrl);

        console.log('\n--- Checking Reported Creds (adminov) ---');
        try {
            const adminovLogin = await axios.post(`${BASE_URL}/auth/login`, {
                username: 'adminov@gmail.com',
                password: 'adminov'
            });
            console.log('adminov Login: Success', adminovLogin.data.success, 'Role:', adminovLogin.data.body.role);
        } catch (err) {
            console.log('adminov Login Failed:', err.response?.status, err.response?.data?.message);
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeEnhanced();
