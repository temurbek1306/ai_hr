import axios from 'axios';

const BASE_URL = 'http://94.241.141.229:8000';

async function finalCleanup() {
    const adminCreds = { username: 'admin@gmail.com', password: 'admin123' };

    try {
        console.log('--- Login as Admin ---');
        const adminLogin = await axios.post(`${BASE_URL}/auth/login`, adminCreds);
        const adminToken = adminLogin.data.body.token;
        const headers = { Authorization: `Bearer ${adminToken}` };

        console.log('--- Cleaning Knowledge Base Articles ---');
        const articlesRes = await axios.get(`${BASE_URL}/api/v1/knowledge/articles`, { headers });
        const articles = articlesRes.data.body || articlesRes.data;
        if (Array.isArray(articles)) {
            for (const a of articles) {
                if (a.title?.includes('Probe') || a.title?.includes('KB Probe')) {
                    console.log('Deleting article:', a.title);
                    try {
                        await axios.delete(`${BASE_URL}/api/v1/knowledge/articles/${a.id}`, { headers });
                    } catch (err) {
                        console.log('Delete failed for', a.id, err.response?.status);
                    }
                }
            }
        }

        console.log('Final cleanup complete.');
    } catch (e) {
        console.error('Cleanup failed:', e.response?.status, e.response?.data || e.message);
    }
}

finalCleanup();
