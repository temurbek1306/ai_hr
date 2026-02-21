import fs from 'fs';

const swagger = JSON.parse(fs.readFileSync('api-docs-v3.json', 'utf8'));

const tagsMap = {};

Object.keys(swagger.paths).forEach(path => {
    Object.keys(swagger.paths[path]).forEach(method => {
        const op = swagger.paths[path][method];
        const tags = op.tags || ['No Tag'];
        tags.forEach(tag => {
            if (!tagsMap[tag]) tagsMap[tag] = [];
            tagsMap[tag].push(`${method.toUpperCase()} ${path}`);
        });
    });
});

let report = '# Swagger API Report\n\n';
Object.keys(tagsMap).sort().forEach(tag => {
    report += `## ${tag}\n`;
    tagsMap[tag].sort().forEach(endpoint => {
        report += `- ${endpoint}\n`;
    });
    report += '\n';
});

fs.writeFileSync('swagger_report.md', report);
console.log('Report generated in swagger_report.md');
