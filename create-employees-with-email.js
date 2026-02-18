// create-employees-with-email.js
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

    // Create employee with email
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

    // Employees with email addresses
    const employees = [
        {
            fullName: 'Aziz Rahimov',
            email: 'aziz.rahimov@company.uz',
            password: 'password123',
            position: 'Software Developer',
            department: 'IT'
        },
        {
            fullName: 'Madina Aliyeva',
            email: 'madina.aliyeva@company.uz',
            password: 'password123',
            position: 'HR Manager',
            department: 'HR'
        },
        {
            fullName: 'Jamshid Tursunov',
            email: 'jamshid.tursunov@company.uz',
            password: 'password123',
            position: 'Designer',
            department: 'Design'
        },
        {
            fullName: 'Test Employee',
            email: 'employee@gmail.com',
            password: 'employee123',
            position: 'Software Developer',
            department: 'IT'
        }
    ];

    async function main() {
        try {
            console.log('🔐 Logging in as admin...');
            const token = await login();
            console.log('✅ Login successful!\n');

            console.log('👥 Creating employees with email addresses...\n');
            for (const employee of employees) {
                await createEmployee(token, employee);
                await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
            }

            console.log('\n✅ All employees created successfully!');
            console.log('\n📝 Login credentials (email):');
            employees.forEach(emp => {
                console.log(`   ${emp.email} / ${emp.password}`);
            });
        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    main();
}).catch(err => {
    console.error('Please install axios: npm install axios');
    console.error(err);
});
