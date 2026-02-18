// Test with username field instead of email
const testWithUsername = async () => {
    console.log('Testing with USERNAME field (backend expects this):\n');

    const credentials = {
        username: "azizbek@gmail.com",  // Backend expects "username"
        password: "aziz123"
    };

    try {
        const response = await fetch('http://94.241.141.229:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));

        if (data.success && data.body?.token) {
            console.log('\n✅✅✅ SUCCESS! Login works with USERNAME field!');
            console.log('Token:', data.body.token.substring(0, 40) + '...');
            console.log('Role:', data.body.role);
        } else {
            console.log('\n❌ Failed:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testWithUsername();
