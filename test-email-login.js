// test-email-login.js - Test if backend accepts email for employee login
import('axios').then(({ default: axios }) => {
    const API_URL = 'http://94.241.141.229:8000';

    async function createEmployeeWithEmail(token) {
        const employee = {
            fullName: 'Test User',
            email: 'test@company.uz',
            password: 'test123',
            position: 'Developer',
            department: 'IT'
        };

        try {
            console.log('\n📝 Creating employee with email...');
            const response = await axios.post(`${API_URL}/api/v1/employees`, employee, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Employee created:', employee.fullName);
            console.log('   Email:', employee.email);
            return employee;
        } catch (error) {
            console.error('❌ Failed:', error.response?.data?.message || error.message);
            return null;
        }
    }

    async function testLogin(username, password) {
        try {
            console.log(`\n🔐 Testing login with: ${username}`);
            const response = await axios.post(`${API_URL}/auth/login`, {
                username: username,
                password: password
            });
            console.log('✅ Login successful!');
            console.log('   Role:', response.data.body.role);
            return true;
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data?.message || error.message);
            return false;
        }
    }

    async function main() {
        try {
            // Login as admin
            console.log('🔐 Logging in as admin...');
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin@gmail.com',
                password: 'admin123'
            });
            const token = loginResponse.data.body.token;
            console.log('✅ Admin login successful!');

            // Create employee with email
            const employee = await createEmployeeWithEmail(token);
            if (!employee) return;

            console.log('\n' + '='.repeat(60));
            console.log('TESTING EMPLOYEE LOGIN METHODS');
            console.log('='.repeat(60));

            // Test 1: Login with email
            console.log('\n1️⃣ Test: Login with EMAIL');
            const emailSuccess = await testLogin(employee.email, employee.password);

            // Test 2: Login with fullName
            console.log('\n2️⃣ Test: Login with FULLNAME');
            const nameSuccess = await testLogin(employee.fullName, employee.password);

            console.log('\n' + '='.repeat(60));
            console.log('RESULTS:');
            console.log('='.repeat(60));
            console.log(`Email login (${employee.email}): ${emailSuccess ? '✅ WORKS' : '❌ FAILED'}`);
            console.log(`Name login (${employee.fullName}): ${nameSuccess ? '✅ WORKS' : '❌ FAILED'}`);
            console.log('='.repeat(60));

            if (emailSuccess) {
                console.log('\n🎉 Backend supports EMAIL login!');
                console.log('   You can use: test@company.uz / test123');
            } else if (nameSuccess) {
                console.log('\n⚠️  Backend only supports FULLNAME login');
                console.log('   You must use: Test User / test123');
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    main();
}).catch(err => {
    console.error('Error:', err);
});
