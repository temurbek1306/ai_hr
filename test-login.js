// Test employee login directly
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
            console.log('Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error) {
            console.error('❌ Login failed!');
            console.error('Error:', error.response?.data || error.message);
            return null;
        }
    }

    async function getAllEmployees() {
        try {
            // First login as admin
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin@gmail.com',
                password: 'admin123'
            });
            const token = loginResponse.data.body.token;

            console.log('\n📋 Fetching all employees...');
            const response = await axios.get(`${API_URL}/api/v1/admin/employees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('\n✅ Employees list:');
            const employees = response.data.body || response.data;
            employees.forEach((emp, index) => {
                console.log(`\n${index + 1}. ${emp.fullName || emp.firstName + ' ' + emp.lastName}`);
                console.log(`   Email: ${emp.email || 'N/A'}`);
                console.log(`   ID: ${emp.id}`);
            });

            return employees;
        } catch (error) {
            console.error('❌ Failed to fetch employees:', error.response?.data || error.message);
            return null;
        }
    }

    async function main() {
        console.log('='.repeat(60));
        console.log('TESTING EMPLOYEE LOGIN');
        console.log('='.repeat(60));

        // Test admin login
        await testLogin('admin@gmail.com', 'admin123');

        // Test employee login
        await testLogin('employee@gmail.com', 'employee123');

        // Get all employees
        await getAllEmployees();

        console.log('\n' + '='.repeat(60));
    }

    main();
}).catch(err => {
    console.error('Error:', err);
});
