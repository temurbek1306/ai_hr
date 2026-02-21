import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function probeUserTests() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };

    try {
        console.log('--- 1. Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;

        console.log('--- 2. Create Test with videoUrl as Admin ---');
        const testData = {
            title: `Test with Video ${Date.now()}`,
            type: 'GENERAL',
            passScore: 70,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            questions: [
                { questionText: 'Is this a video?', options: ['Yes', 'No'], correctAnswer: 'Yes' }
            ]
        };
        const createTestRes = await axios.post(`${BASE_URL}/api/v1/tests`, testData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const testId = createTestRes.data.body.id;
        console.log('Test Created ID:', testId);

        console.log('--- 3. Create Employee and Assign Test ---');
        const empEmail = `test_usr_${Date.now()}@test.com`;
        const empData = {
            firstName: 'Test',
            lastName: 'User',
            email: empEmail,
            phone: '+998909998877',
            position: 'Tester',
            department: 'QA',
            startDate: '2024-01-01',
            videoUrl: 'https://www.youtube.com/watch?v=emp-video' // Employee level video
        };
        const createEmpRes = await axios.post(`${BASE_URL}/api/v1/admin/employees`, empData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const empId = createEmpRes.data.body.id;

        // Assign the test
        await axios.post(`${BASE_URL}/api/v1/employees/${empId}/assignments`, {
            assignmentType: 'TEST',
            referenceId: testId
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log('--- 4. Register and Login as Employee ---');
        await axios.post(`${BASE_URL}/auth/register`, {
            fullName: 'Test User',
            username: empEmail,
            password: 'password123',
            phoneNumber: '+998909998877'
        });
        const empLogin = await axios.post(`${BASE_URL}/auth/login`, {
            username: empEmail,
            password: 'password123'
        });
        const empToken = empLogin.data.body.token;

        console.log('--- 5. Fetch /me ---');
        const meRes = await axios.get(`${BASE_URL}/api/v1/employees/me`, {
            headers: { Authorization: `Bearer ${empToken}` }
        });
        console.log('Employee /me videoUrl:', meRes.data.body.videoUrl || 'MISSING');

        console.log('--- 6. Fetch /available tests ---');
        const availableRes = await axios.get(`${BASE_URL}/api/v1/tests/available`, {
            headers: { Authorization: `Bearer ${empToken}` }
        });
        const availableTests = availableRes.data.body || [];
        console.log('Available test count:', availableTests.length);
        const myTest = availableTests.find(t => t.id === testId);
        if (myTest) {
            console.log('Assigned Test data for user:', JSON.stringify(myTest, null, 2));
            console.log('Test videoUrl:', myTest.videoUrl || 'MISSING');
        } else {
            console.log('Test not found in available list');
        }

    } catch (e) {
        console.error('Probe failed:', e.response?.status, JSON.stringify(e.response?.data, null, 2));
    }
}

probeUserTests();
