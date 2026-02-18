// Test both login formats
const testBothFormats = async () => {
    console.log('='.repeat(70));
    console.log('TESTING BOTH LOGIN FORMATS');
    console.log('='.repeat(70));

    const testCases = [
        {
            name: 'Email Format',
            credentials: {
                username: "azizbek@gmail.com",
                password: "aziz123"
            }
        },
        {
            name: 'Full Name Format',
            credentials: {
                username: "Azizbek Meliqulov",
                password: "aziz123"
            }
        }
    ];

    for (const test of testCases) {
        console.log(`\n${'='.repeat(70)}`);
        console.log(`Testing: ${test.name}`);
        console.log('='.repeat(70));
        console.log('Username:', test.credentials.username);

        try {
            const response = await fetch('http://94.241.141.229:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(test.credentials)
            });

            const data = await response.json();

            console.log('Status:', response.status);
            console.log('Success:', data.success);

            if (data.success && data.body?.token) {
                console.log(`✅ ${test.name} - LOGIN SUCCESSFUL!`);
                console.log('Token:', data.body.token.substring(0, 30) + '...');
                console.log('Role:', data.body.role);
            } else {
                console.log(`❌ ${test.name} - FAILED:`, data.message);
            }
        } catch (error) {
            console.error(`❌ ${test.name} - Error:`, error.message);
        }
    }

    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log('Both formats should work on the frontend!');
    console.log('Users can login with either:');
    console.log('  1. Email: azizbek@gmail.com');
    console.log('  2. Full Name: Azizbek Meliqulov');
};

testBothFormats();
