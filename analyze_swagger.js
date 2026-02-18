
const fs = require('fs');
const path = require('path');

const swaggerPath = 'c:/Users/USER/.gemini/antigravity/brain/555452d0-6151-4522-bf49-b566935fd1c6/backend_swagger.json';

try {
    const rawData = fs.readFileSync(swaggerPath);
    const swagger = JSON.parse(rawData);

    console.log('Swagger Version:', swagger.openapi || swagger.swagger);
    console.log('Total Paths:', Object.keys(swagger.paths).length);
    console.log('\n--- API ENDPOINTS ---');

    Object.keys(swagger.paths).sort().forEach(endpoint => {
        const methods = Object.keys(swagger.paths[endpoint]).map(m => m.toUpperCase()).join(', ');
        console.log(`${endpoint} [${methods}]`);
    });

} catch (error) {
    console.error('Error parsing swagger:', error.message);
}
