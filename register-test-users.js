// Register test users via API
const registerUsers = async () => {
    const users = [
        {
            email: "admin@gmail.com",
            password: "admin123",
            firstName: "Admin",
            lastName: "User",
            role: "admin"
        },
        {
            email: "employee@gmail.com",
            password: "employee123",
            firstName: "Test",
            lastName: "Employee",
            role: "employee"
        }
    ];

    for (const user of users) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Registering ${user.role}: ${user.email}`);
        console.log('='.repeat(60));

        try {
            // Try /auth/register
            const response = await fetch('http://94.241.141.229:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });

            console.log('Status:', response.status, response.statusText);
            const data = await response.json();
            console.log('Response:', JSON.stringify(data, null, 2));

            if (data.success) {
                console.log('✅ Registration successful!');
            } else {
                console.log('❌ Registration failed:', data.message);

                // Try alternative endpoint
                console.log('\nTrying /api/v1/auth/register...');
                const response2 = await fetch('http://94.241.141.229:8000/api/v1/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(user)
                });

                console.log('Status:', response2.status, response2.statusText);
                const data2 = await response2.json();
                console.log('Response:', JSON.stringify(data2, null, 2));
            }

        } catch (error) {
            console.error('❌ Error:', error.message);
        }
    }

    // Now test login
    console.log('\n\n' + '='.repeat(60));
    console.log('TESTING LOGIN AFTER REGISTRATION');
    console.log('='.repeat(60));

    try {
        const loginResponse = await fetch('http://94.241.141.229:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "employee@gmail.com",
                password: "employee123"
            })
        });

        console.log('\nLogin Status:', loginResponse.status);
        const loginData = await loginResponse.json();
        console.log('Login Response:', JSON.stringify(loginData, null, 2));

        if (loginData.success && loginData.body?.token) {
            console.log('\n✅✅✅ SUCCESS! Employee can now login!');
            console.log('Token:', loginData.body.token.substring(0, 30) + '...');
        }
    } catch (error) {
        console.error('Login test error:', error.message);
    }
};

registerUsers();
