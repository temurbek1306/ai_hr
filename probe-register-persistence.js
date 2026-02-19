import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function probeRegisterPersistence() {
    const timestamp = Date.now();
    const testUser = {
        fullName: `Test User ${timestamp}`,
        username: `test${timestamp}@example.com`,
        password: 'password123',
        phoneNumber: '+998901234567',
        // Potential extra fields
        firstName: 'Test',
        lastName: `User ${timestamp}`,
        phone: '+998901234567',
        position: 'Developer',
        department: 'IT',
        startDate: '2024-01-01'
    };

    try {
        console.log('=== Probing /auth/register with extra fields ===');
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('Registration Status:', regRes.status);
        console.log('Registration Response:', JSON.stringify(regRes.data, null, 2));

        console.log('\n=== Logging in as new user ===');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: testUser.username,
            password: testUser.password
        });
        console.log('Login Status:', loginRes.status);
        const token = loginRes.data.body.token;

        console.log('\n=== Fetching profile (analytics/employee/summary/me) ===');
        try {
            const profileRes = await axios.get(`${API_URL}/api/v1/analytics/employee/summary/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Profile Status:', profileRes.status);
            console.log('Profile Data:', JSON.stringify(profileRes.data, null, 2));
        } catch (e) {
            console.log('Profile Fetch Error:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
        }

        console.log('\n=== Fetching employee details via admin API (if possible) ===');
        // This might fail if the user is not an admin, but useful to check if they exist in employee list
        // Actually, let's just use the 'me' summary.

    } catch (error) {
        console.error('Fatal error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

probeRegisterPersistence();
