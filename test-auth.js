// Test script to verify CORS and authentication
const https = require('http');

const API_URL = 'http://94.241.141.229:8000';

// Test registration
async function testRegistration() {
    console.log('\n🔍 Testing Registration...\n');

    const data = JSON.stringify({
        fullName: 'Test User',
        username: 'testuser' + Date.now(),
        password: 'Test123!'
    });

    const options = {
        hostname: '94.241.141.229',
        port: 8000,
        path: '/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Origin': 'http://localhost:5173'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Headers:');
            console.log('  Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
            console.log('  Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
            console.log('  Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log('\nResponse Body:', body);
                resolve({ status: res.statusCode, headers: res.headers, body });
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Test login
async function testLogin() {
    console.log('\n🔍 Testing Login...\n');

    const data = JSON.stringify({
        username: 'admin',
        password: 'admin123'
    });

    const options = {
        hostname: '94.241.141.229',
        port: 8000,
        path: '/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'Origin': 'http://localhost:5173'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Headers:');
            console.log('  Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
            console.log('  Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
            console.log('  Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log('\nResponse Body:', body);
                resolve({ status: res.statusCode, headers: res.headers, body });
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error.message);
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

// Test OPTIONS (preflight)
async function testPreflight() {
    console.log('\n🔍 Testing CORS Preflight (OPTIONS)...\n');

    const options = {
        hostname: '94.241.141.229',
        port: 8000,
        path: '/auth/login',
        method: 'OPTIONS',
        headers: {
            'Origin': 'http://localhost:5173',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            console.log('Response Headers:');
            console.log('  Access-Control-Allow-Origin:', res.headers['access-control-allow-origin']);
            console.log('  Access-Control-Allow-Methods:', res.headers['access-control-allow-methods']);
            console.log('  Access-Control-Allow-Headers:', res.headers['access-control-allow-headers']);
            console.log('  Access-Control-Max-Age:', res.headers['access-control-max-age']);

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (body) console.log('\nResponse Body:', body);
                resolve({ status: res.statusCode, headers: res.headers });
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request Error:', error.message);
            reject(error);
        });

        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log('='.repeat(60));
    console.log('🧪 CORS & Authentication Test');
    console.log('='.repeat(60));

    try {
        await testPreflight();
        await testLogin();
        await testRegistration();

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests completed!');
        console.log('='.repeat(60));
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

runTests();
