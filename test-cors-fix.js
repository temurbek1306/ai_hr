// Test CORS fix
const http = require('http');

const API_HOST = '94.241.141.229';
const API_PORT = 8000;

function testRequest(method, path, headers = {}, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: API_HOST,
            port: API_PORT,
            path: path,
            method: method,
            headers: {
                'Origin': 'http://localhost:5174',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => reject(error));

        if (body) {
            req.write(body);
        }
        req.end();
    });
}

async function runTests() {
    console.log('='.repeat(70));
    console.log('🧪 CORS Verification Test');
    console.log('='.repeat(70));
    console.log('Backend: http://94.241.141.229:8000');
    console.log('Origin: http://localhost:5174');
    console.log('='.repeat(70));

    // Test 1: OPTIONS preflight for login
    console.log('\n📋 Test 1: OPTIONS Preflight Request (Login)');
    console.log('-'.repeat(70));
    try {
        const result = await testRequest('OPTIONS', '/auth/login', {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        });

        console.log(`Status: ${result.status}`);
        console.log('\n🔍 CORS Headers:');
        console.log(`  Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || '❌ MISSING'}`);
        console.log(`  Access-Control-Allow-Methods: ${result.headers['access-control-allow-methods'] || '❌ MISSING'}`);
        console.log(`  Access-Control-Allow-Headers: ${result.headers['access-control-allow-headers'] || '❌ MISSING'}`);
        console.log(`  Access-Control-Max-Age: ${result.headers['access-control-max-age'] || 'Not set'}`);

        if (result.headers['access-control-allow-origin']) {
            console.log('\n✅ CORS Preflight: PASSED');
        } else {
            console.log('\n❌ CORS Preflight: FAILED - No Access-Control-Allow-Origin header');
        }
    } catch (error) {
        console.log(`\n❌ CORS Preflight: ERROR - ${error.message}`);
    }

    // Test 2: POST login request
    console.log('\n\n📋 Test 2: POST Login Request');
    console.log('-'.repeat(70));
    try {
        const loginData = JSON.stringify({
            username: 'admin',
            password: 'admin123'
        });

        const result = await testRequest('POST', '/auth/login', {
            'Content-Type': 'application/json',
            'Content-Length': loginData.length
        }, loginData);

        console.log(`Status: ${result.status}`);
        console.log('\n🔍 CORS Headers:');
        console.log(`  Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || '❌ MISSING'}`);

        console.log('\n📦 Response Body:');
        try {
            const parsed = JSON.parse(result.body);
            console.log(JSON.stringify(parsed, null, 2));

            if (parsed.success && parsed.body?.token) {
                console.log('\n✅ Login: PASSED - Token received');
            } else {
                console.log('\n⚠️ Login: Response received but no token');
            }
        } catch (e) {
            console.log(result.body.substring(0, 200));
        }
    } catch (error) {
        console.log(`\n❌ Login Request: ERROR - ${error.message}`);
    }

    // Test 3: OPTIONS preflight for register
    console.log('\n\n📋 Test 3: OPTIONS Preflight Request (Register)');
    console.log('-'.repeat(70));
    try {
        const result = await testRequest('OPTIONS', '/auth/register', {
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        });

        console.log(`Status: ${result.status}`);
        console.log('\n🔍 CORS Headers:');
        console.log(`  Access-Control-Allow-Origin: ${result.headers['access-control-allow-origin'] || '❌ MISSING'}`);

        if (result.headers['access-control-allow-origin']) {
            console.log('\n✅ Register Preflight: PASSED');
        } else {
            console.log('\n❌ Register Preflight: FAILED');
        }
    } catch (error) {
        console.log(`\n❌ Register Preflight: ERROR - ${error.message}`);
    }

    // Summary
    console.log('\n\n' + '='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log('\nIf all tests show ✅ PASSED, CORS is working correctly!');
    console.log('If any test shows ❌ FAILED, backend needs more fixes.');
    console.log('\n💡 Next step: Try logging in at http://localhost:5174');
    console.log('='.repeat(70));
}

runTests().catch(console.error);
