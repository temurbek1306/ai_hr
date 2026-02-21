import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function reproduceRegisterFlow() {
    const timestamp = Date.now();
    const data = {
        firstName: 'Reproduction',
        lastName: 'User',
        email: `repro_${timestamp}@test.com`,
        phone: '+998901112233',
        password: 'password123'
    };

    console.log('1. Registering...');
    try {
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: `${data.firstName} ${data.lastName}`,
            username: data.email,
            password: data.password,
            phoneNumber: data.phone
        });
        console.log('Registration OK');
    } catch (e) {
        console.log('Registration Failed', e.response?.data);
        return;
    }

    console.log('\n2. Immediate Login with Email (as done in Register.tsx)...');
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            username: data.email,
            password: data.password
        });
        console.log('Immediate Login with email:', res.status, res.data.success ? 'Success' : 'Fail');
        if (res.data.success) {
            console.log('Role:', res.data.body.role);
        }
    } catch (e) {
        console.log('Immediate Login with email failed:', e.response?.status, e.response?.data);
    }
}

reproduceRegisterFlow();
