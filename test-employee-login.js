// test-employee-login.js
import('axios').then(({ default: axios }) => {
    const API_URL = 'http://94.241.141.229:8000';

    async function testLogin(username, password) {
        try {
            console.log(`\n🔐 Testing login: ${username}`);
            const response = await axios.post(`${API_URL}/auth/login`, {
                username: username,
                password: password
            });

            console.log('✅ Login successful!');
            console.log('Token:', response.data.body.token.substring(0, 50) + '...');
            console.log('Role:', response.data.body.role);
            return response.data;
        } catch (error) {
            console.error('❌ Login failed!');
            if (error.response?.data) {
                console.error('Error:', error.response.data.message || error.response.data);
            } else {
                console.error('Error:', error.message);
            }
            return null;
        }
    }

    async function main() {
        console.log('='.repeat(60));
        console.log('TESTING EMPLOYEE LOGIN');
        console.log('='.repeat(60));

        // Test admin login
        console.log('\n1. Testing Admin Login:');
        await testLogin('admin@gmail.com', 'admin123');

        // Test employee login with email
        console.log('\n2. Testing Employee Login (email@gmail.com):');
        await testLogin('employee@gmail.com', 'employee123');

        // Test employee login with company email
        console.log('\n3. Testing Employee Login (aziz.rahimov@company.uz):');
        await testLogin('aziz.rahimov@company.uz', 'password123');

        // Test employee login with fullName (old method)
        console.log('\n4. Testing Employee Login (Aziz Rahimov):');
        await testLogin('Aziz Rahimov', 'password123');

        console.log('\n' + '='.repeat(60));
    }

    main();
}).catch(err => {
    console.error('Error:', err);
});
