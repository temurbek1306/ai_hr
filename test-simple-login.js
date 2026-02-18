// Simple login test
const testLogin = async (email, password) => {
    console.log(`\nTesting login: ${email}`);
    console.log('Password:', password);

    try {
        const response = await fetch('http://94.241.141.229:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        console.log('\nStatus:', response.status);
        console.log('Success:', data.success);
        console.log('Message:', data.message);

        if (data.success && data.body?.token) {
            console.log('\n✅ LOGIN SUCCESSFUL!');
            console.log('Token:', data.body.token.substring(0, 40) + '...');
            console.log('Role:', data.body.role);
            return true;
        } else {
            console.log('\n❌ LOGIN FAILED');
            console.log('Full response:', JSON.stringify(data, null, 2));
            return false;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
};

// Test different credentials
const runTests = async () => {
    console.log('='.repeat(60));
    console.log('TESTING DIFFERENT CREDENTIALS');
    console.log('='.repeat(60));

    // Test 1: admin@gmail.com
    await testLogin('admin@gmail.com', 'admin123');

    // Test 2: employee@gmail.com  
    await testLogin('employee@gmail.com', 'employee123');

    // Test 3: Try without @gmail.com
    await testLogin('admin', 'admin123');
    await testLogin('employee', 'employee123');
};

runTests();
