// Test both admin and employee credentials
const testBothLogins = async () => {
    const testCases = [
        { email: "admin@gmail.com", password: "admin123", role: "Admin" },
        { email: "employee@gmail.com", password: "employee123", role: "Employee" }
    ];

    for (const creds of testCases) {
        console.log(`\n${'='.repeat(50)}`);
        console.log(`Testing ${creds.role} login: ${creds.email}`);
        console.log('='.repeat(50));

        try {
            const response = await fetch('http://94.241.141.229:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: creds.email,
                    password: creds.password
                })
            });

            console.log('Status:', response.status, response.statusText);
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));

            if (data.success && data.body?.token) {
                console.log('✅ Login successful!');
                console.log('Token:', data.body.token.substring(0, 20) + '...');
                console.log('Role:', data.body.role);
            } else {
                console.log('❌ Login failed:', data.message);
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }
};

testBothLogins();
