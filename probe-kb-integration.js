import axios from 'axios';

const API_URL = 'http://94.241.141.229:8000';

async function probeKB() {
    console.log('--- Probing Knowledge Base Integration (with Auth) ---');
    try {
        // 0. Login
        console.log('0. Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            username: 'admin', // assuming default admin username
            password: 'password' // assuming default admin password or from env
        });
        const token = loginRes.data.body.token;
        const authHeader = { Authorization: `Bearer ${token}` };

        // 1. Get Categories
        console.log('\n1. Fetching categories...');
        const catRes = await axios.get(`${API_URL}/api/v1/knowledge/categories`, { headers: authHeader });
        const categories = catRes.data;
        console.log('Categories found:', categories.length);
        const categoryId = categories.length > 0 ? categories[0].id : null;

        if (!categoryId) {
            console.log('No categories found, creating one...');
            const newCat = await axios.post(`${API_URL}/api/v1/knowledge/categories`, { name: 'Test Category' }, { headers: authHeader });
            console.log('Category created:', newCat.data.id);
            return;
        }

        // 2. Create Article with Link
        console.log('\n2. Creating article with link...');
        const timestamp = Date.now();
        const articleData = {
            title: `Test Video ${timestamp}`,
            content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            type: 'VIDEO',
            categoryId: categoryId,
            status: 'PUBLISHED'
        };

        const createRes = await axios.post(`${API_URL}/api/v1/knowledge/articles`, articleData, { headers: authHeader });
        console.log('Article created successfully');

        // 3. Fetch Articles (User side)
        console.log('\n3. Fetching articles (User perspective)...');
        const articlesRes = await axios.get(`${API_URL}/api/v1/knowledge/articles`, { headers: authHeader });
        const body = articlesRes.data.body || articlesRes.data;

        const found = (Array.isArray(body) ? body : []).find(a => a.title === articleData.title);
        if (found) {
            console.log('SUCCESS: Article found in list.');
            console.log('Data:', JSON.stringify(found, null, 2));
        } else {
            console.log('FAILED: Article not found in list.');
        }

    } catch (error) {
        console.error('Error during probe:', error.response?.status, error.response?.data || error.message);
    }
}

probeKB();
