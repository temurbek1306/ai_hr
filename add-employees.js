const axios = require('axios');

const API_URL = 'http://94.241.141.229:8000';

// Login to get token
async function login() {
    const response = await axios.post(`${API_URL}/auth/login`, {
        username: 'admin@gmail.com',
        password: 'admin123'
    });
    return response.data.body.token;
}

// Create employee
async function createEmployee(token, employee) {
    try {
        const response = await axios.post(`${API_URL}/api/v1/employees`, employee, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ Created: ${employee.fullName}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to create ${employee.fullName}:`, error.response?.data?.message || error.message);
    }
}

// Sample employees
const employees = [
    { fullName: 'Aziz Rahimov', password: 'password123' },
    { fullName: 'Madina Aliyeva', password: 'password123' },
    { fullName: 'Jamshid Tursunov', password: 'password123' },
    { fullName: 'Laylo Karimova', password: 'password123' },
    { fullName: 'Bobur Sobirov', password: 'password123' },
    { fullName: 'Dilnoza Yusupova', password: 'password123' },
    { fullName: 'Sardor Mahmudov', password: 'password123' },
    { fullName: 'Nilufar Ergasheva', password: 'password123' },
    { fullName: 'Otabek Karimov', password: 'password123' },
    { fullName: 'Gulnora Sharipova', password: 'password123' }
];

async function main() {
    try {
        console.log('🔐 Logging in...');
        const token = await login();
        console.log('✅ Login successful!\n');

        console.log('👥 Creating 10 employees...\n');
        for (const employee of employees) {
            await createEmployee(token, employee);
            await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
        }

        console.log('\n✅ All employees created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
