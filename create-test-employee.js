// create-test-employee.js
import('axios').then(({ default: axios }) => {
    const API_URL = 'http://94.241.141.229:8000';

    // Login to get token
    async function login() {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin@gmail.com',
            password: 'admin123'
        });
        return response.data.body.token;
    }

    // Create employee with specific email
    async function createEmployee(token, employee) {
        try {
            const response = await axios.post(`${API_URL}/api/v1/employees`, employee, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ Created: ${employee.fullName} (${employee.email})`);
            return response.data;
        } catch (error) {
            console.error(`❌ Failed to create ${employee.fullName}:`, error.response?.data?.message || error.message);
        }
    }

    // Test employee for web access
    const testEmployee = {
        fullName: 'Test Employee',
        email: 'employee@gmail.com',
        password: 'employee123',
        position: 'Software Developer',
        department: 'IT'
    };

    async function main() {
        try {
            console.log('🔐 Logging in as admin...');
            const token = await login();
            console.log('✅ Login successful!\n');

            console.log('👤 Creating test employee for web access...\n');
            await createEmployee(token, testEmployee);

            console.log('\n✅ Test employee created successfully!');
            console.log('\n📝 Login credentials:');
            console.log('   Email: employee@gmail.com');
            console.log('   Password: employee123');
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    main();
}).catch(err => {
    console.error('Please install axios: npm install axios');
    console.error(err);
});
