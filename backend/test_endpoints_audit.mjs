const BASE_URL = 'http://localhost:8000/api/v1';
let token = '';

async function runTests() {
    console.log('--- STARTING COMPREHENSIVE API TESTS ---');

    // 1. Auth Tests
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        if (loginData.success && loginData.body?.token) {
            token = loginData.body.token;
            console.log('✅ Auth /login: SUCCESS');
        } else {
            console.error('❌ Auth /login: FAILED', loginData);
            return; // Halt if login fails
        }
    } catch (err) {
        console.error('❌ Auth /login: ERROR', err.message);
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Employees GET
    try {
        const empRes = await fetch(`${BASE_URL}/employees`, { headers });
        const empData = await empRes.json();
        if (empRes.ok && empData.success) {
            console.log('✅ Employees GET: SUCCESS (' + (empData.body?.length || 0) + ' found)');
        } else {
            console.error('❌ Employees GET: FAILED', empData);
        }
    } catch (err) { console.error('❌ Employees GET: ERROR', err.message); }

    // 3. Analytics Overview (Real route)
    try {
        const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, { headers });
        if (dashRes.ok) console.log('✅ Dashboard /admin/dashboard: SUCCESS');
        else console.error('❌ Dashboard /admin/dashboard: FAILED', dashRes.status);
    } catch (err) { console.error('❌ Dashboard /admin/dashboard: ERROR', err.message); }

    // 4. Analytics Extended (Real Route)
    try {
        const extRes = await fetch(`${BASE_URL}/admin/dashboard/extended-stats`, { headers });
        if (extRes.ok) console.log('✅ Analytics /admin/dashboard/extended-stats: SUCCESS');
        else console.error('❌ Analytics /admin/dashboard/extended-stats: FAILED', await extRes.text());
    } catch (err) { console.error('❌ Analytics /admin/dashboard/extended-stats: ERROR', err.message); }

    // 5. Tests GET
    try {
        const testRes = await fetch(`${BASE_URL}/tests`, { headers });
        if (testRes.ok) console.log('✅ Tests GET: SUCCESS');
        else console.error('❌ Tests GET: FAILED', await testRes.text());
    } catch (err) { console.error('❌ Tests GET: ERROR', err.message); }

    // 6. Content GET (Real Route)
    try {
        const contRes = await fetch(`${BASE_URL}/knowledge/articles`, { headers });
        if (contRes.ok) console.log('✅ Content /knowledge/articles: SUCCESS');
        else console.error('❌ Content /knowledge/articles: FAILED', await contRes.text());
    } catch (err) { console.error('❌ Content /knowledge/articles: ERROR', err.message); }

    console.log('--- TESTS FINISHED ---');
}

runTests();
