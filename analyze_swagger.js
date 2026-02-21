import fs from 'fs';

const swagger = JSON.parse(fs.readFileSync('api-docs-v3.json', 'utf8'));

const tags = new Set();
const paths = Object.keys(swagger.paths);

paths.forEach(path => {
    const methods = Object.keys(swagger.paths[path]);
    methods.forEach(method => {
        const operation = swagger.paths[path][method];
        if (operation.tags) {
            operation.tags.forEach(tag => tags.add(tag));
        }
    });
});

console.log('--- TAGS ---');
Array.from(tags).sort().forEach(tag => console.log(tag));

console.log('\n--- PATHS ---');
paths.sort().forEach(path => {
    const methods = Object.keys(swagger.paths[path]);
    console.log(`${path} [${methods.join(', ')}]`);
});
