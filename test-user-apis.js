import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';
const CREDENTIALS = {
    username: 'admin@gmail.com',
    password: 'admin123'
};

async function testEndpoint(name, method, path, token, params = {}) {
    try {
        const config = {
            method,
            url: `${API_URL}${path}`,
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            params
        };

        const start = Date.now();
        const response = await axios(config);
        const duration = Date.now() - start;

        console.log(`[PASS] ${name.padEnd(25)} | ${method.padEnd(4)} | ${path.padEnd(45)} | Status: ${response.status} | Time: ${duration}ms`);
        return { success: true, data: response.data };
    } catch (error) {
        const status = error.response ? error.response.status : 'ERR';
        const message = error.response?.data?.message || error.message;
        console.log(`[FAIL] ${name.padEnd(25)} | ${method.padEnd(4)} | ${path.padEnd(45)} | Status: ${status} | Error: ${message}`);
        return { success: false, status, message };
    }
}

async function runTests() {
    console.log('='.repeat(120));
    console.log('USER SECTION API TESTING'.padStart(70));
    console.log('='.repeat(120));

    // 1. LOGIN
    console.log('\n🔐 Authenticating...');
    const loginResult = await testEndpoint('Login', 'POST', '/auth/login', null, {}, CREDENTIALS);

    // axios post doesn't take params like that in my helper, let's fix the helper or just handle login specially
    let token = '';
    try {
        const res = await axios.post(`${API_URL}/auth/login`, CREDENTIALS);
        token = res.data.body.token;
        console.log('✅ Token obtained successfully.');
    } catch (e) {
        console.error('❌ Failed to authenticate. Aborting tests.');
        return;
    }

    console.log('\n' + 'Category'.padEnd(25) + ' | Meth | Path'.padEnd(48) + ' | Result');
    console.log('-'.repeat(120));

    // 2. PROFILE
    await testEndpoint('Profile: Me', 'GET', '/api/v1/employees/me', token);
    await testEndpoint('Profile: Summary', 'GET', '/api/v1/employees/me/summary', token);
    await testEndpoint('Profile: Growth', 'GET', '/api/v1/employees/me/growth', token);
    await testEndpoint('Profile: Notif Settings', 'GET', '/api/v1/employees/me/settings/notifications', token);
    await testEndpoint('Profile: Activities', 'GET', '/api/v1/employees/me/activities', token);
    await testEndpoint('Profile: Feedback Hist', 'GET', '/api/v1/employees/me/feedback', token);

    // 3. TESTS
    const testsRes = await testEndpoint('Tests: Available', 'GET', '/api/v1/tests/available', token);
    await testEndpoint('Tests: Results', 'GET', '/api/v1/employees/me/test-results', token);

    // 4. KNOWLEDGE BASE
    await testEndpoint('KB: Categories', 'GET', '/api/v1/knowledge/categories', token);
    await testEndpoint('KB: Articles', 'GET', '/api/v1/knowledge/articles', token);

    // 5. SURVEYS
    await testEndpoint('Surveys: List', 'GET', '/api/v1/surveys', token);

    // 6. NOTIFICATIONS & EVENTS
    await testEndpoint('Notifications: List', 'GET', '/api/v1/notifications', token);
    await testEndpoint('Events: List', 'GET', '/api/v1/events', token);

    // 7. ONBOARDING & NDA
    await testEndpoint('Onboarding: Materials', 'GET', '/api/v1/onboarding/materials', token);
    await testEndpoint('NDA: Current', 'GET', '/api/v1/nda/current', token);

    // 8. OTHERS (Services identify them)
    await testEndpoint('Content: All', 'GET', '/api/v1/content', token);

    console.log('\n' + '='.repeat(120));
    console.log('Testing Complete.');
}

runTests();
