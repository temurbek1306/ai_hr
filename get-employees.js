// get-employees.js - Get all employees from backend
import('axios').then(({ default: axios }) => {
    const API_URL = 'http://94.241.141.229:8000';

    async function main() {
        try {
            // Login as admin
            console.log('🔐 Logging in as admin...');
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin@gmail.com',
                password: 'admin123'
            });
            const token = loginResponse.data.body.token;
            console.log('✅ Login successful!\n');

            // Get all employees
            console.log('📋 Fetching all employees...\n');
            const response = await axios.get(`${API_URL}/api/v1/admin/employees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const employees = response.data.body || response.data;
            console.log(`Found ${employees.length} employees:\n`);
            console.log('='.repeat(80));

            employees.forEach((emp, index) => {
                console.log(`\n${index + 1}. ${emp.fullName || (emp.firstName + ' ' + emp.lastName)}`);
                console.log(`   ID: ${emp.id}`);
                console.log(`   Email: ${emp.email || 'N/A'}`);
                console.log(`   Position: ${emp.position || 'N/A'}`);
                console.log(`   Department: ${emp.department || 'N/A'}`);

                // Try to determine login username
                if (emp.email) {
                    console.log(`   ✅ Login with: ${emp.email}`);
                } else if (emp.fullName) {
                    console.log(`   ✅ Login with: ${emp.fullName}`);
                }
            });

            console.log('\n' + '='.repeat(80));
            console.log('\n💡 To login as employee, use the email or fullName shown above');
            console.log('   Default password: password123 or employee123');

        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
        }
    }

    main();
}).catch(err => {
    console.error('Error:', err);
});
