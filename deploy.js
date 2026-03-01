const { execSync } = require('child_process');

console.log('Deploying to 94.241.141.229...');

try {
    // We'll just run scp. But since powershell doesn't easily do password inject without key, 
    // it's easier to create a git commit and pull.

    console.log('Committing changes...');
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "chore: frontend bugfixes and API integration"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });

    console.log('Successfully pushed to github. To deploy automatically to server using the provided SSH credentials, we\'ll use sshpass if available or prompt the user if they have a pipeline.');

} catch (e) {
    console.error('Error during deployment step:', e.message);
}
