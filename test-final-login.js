// Final test with correct credentials
const finalTest = async () => {
    console.log('='.repeat(60));
    console.log('FINAL LOGIN TEST');
    console.log('='.repeat(60));

    const credentials = {
        username: "azizbek@gmail.com",
        password: "aziz123"
    };

    console.log('\nTesting with:', credentials.username);

    try {
        const response = await fetch('http://94.241.141.229:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        console.log('\nStatus:', response.status);
        console.log('Success:', data.success);

        if (data.success && data.body?.token) {
            console.log('\n✅✅✅ LOGIN SUCCESSFUL! ✅✅✅');
            console.log('\nToken:', data.body.token.substring(0, 50) + '...');
            console.log('Role:', data.body.role);
            console.log('\n🎉 Frontend is now ready to use!');
            console.log('📝 Demo credentials: azizbek@gmail.com / aziz123');
        } else {
            console.log('\n❌ Failed:', data.message);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

finalTest();
