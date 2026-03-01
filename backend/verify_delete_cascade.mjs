const BASE_URL = 'http://localhost:8000/api/v1';

async function testDeleteCascade() {
    let token = '';

    // 1. Admin Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    if (loginData.success) {
        token = loginData.body.token;
    } else {
        console.error('Login failed');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Create a Dummy Test
    const createTestRes = await fetch(`${BASE_URL}/admin/tests`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            title: 'Dummy Delete Test',
            description: 'Testing CASCADE delete',
            passingScore: 50,
            duration: 10,
            questions: [
                {
                    text: 'What is 2+2?',
                    type: 'SINGLE',
                    options: [
                        { text: '3', isCorrect: false },
                        { text: '4', isCorrect: true }
                    ]
                }
            ]
        })
    });
    const testData = await createTestRes.json();
    const testId = testData.body?.id;
    console.log('Created Test ID:', testId);

    if (!testId) {
        console.error('Failed to create test', testData);
        return;
    }

    // 3. Try to Delete the Test
    console.log('Attempting to delete test...');
    const deleteRes = await fetch(`${BASE_URL}/admin/tests/${testId}`, {
        method: 'DELETE',
        headers
    });

    const deleteData = await deleteRes.json();
    console.log('Delete Response:', deleteRes.status, deleteData);
}

testDeleteCascade();
