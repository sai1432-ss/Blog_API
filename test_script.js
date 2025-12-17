// test_script.js
const BASE_URL = 'http://localhost:3000';
// Helper function to make requests nicely
async function request(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        // Handle empty responses safely
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error connecting to ${endpoint}:`, error.message);
        process.exit(1);
    }
}

async function runTests() {
    console.log('🚀 Starting API Test (Create, Read, Update ONLY)...\n');

    let authorId = null;
    let postId = null;

    // --- SECTION 1: AUTHOR MANAGEMENT ---

    // 1. POST /authors
    console.log('1. Testing POST /authors (Create Author)...');
    const authorRes = await request('/authors', 'POST', {
        name: 'Test User',
        email: `test${Date.now()}@example.com`
    });
    
    if (authorRes.status === 201) {
        authorId = authorRes.data.id;
        console.log(`✅ PASS: Created Author ID ${authorId}`);
    } else {
        console.error('❌ FAIL: Could not create author', authorRes.data);
        return;
    }

    // 2. GET /authors (List)
    console.log('\n2. Testing GET /authors (List all)...');
    const listAuthorsRes = await request('/authors');
    if (listAuthorsRes.status === 200 && Array.isArray(listAuthorsRes.data)) {
        console.log(`✅ PASS: Retrieved list of ${listAuthorsRes.data.length} authors`);
    } else {
        console.error('❌ FAIL: Could not get author list');
    }

    // 3. GET /authors/:id (Single)
    console.log('\n3. Testing GET /authors/:id (Single Author)...');
    const getAuthorRes = await request(`/authors/${authorId}`);
    if (getAuthorRes.status === 200 && getAuthorRes.data.id === authorId) {
        console.log('✅ PASS: Retrieved single author correctly');
    } else {
        console.error('❌ FAIL: Could not get single author');
    }

    // 4. PUT /authors/:id (Update)
    console.log('\n4. Testing PUT /authors/:id (Update Author)...');
    const updateAuthorRes = await request(`/authors/${authorId}`, 'PUT', {
        name: 'Updated Name',
        email: `updated${Date.now()}@example.com`
    });
    if (updateAuthorRes.status === 200 && updateAuthorRes.data.name === 'Updated Name') {
        console.log('✅ PASS: Author updated successfully');
    } else {
        console.error('❌ FAIL: Update Author failed');
    }

    // --- SECTION 2: POST MANAGEMENT ---

    // 5. POST /posts (Create)
    console.log('\n5. Testing POST /posts (Create Post)...');
    const postRes = await request('/posts', 'POST', {
        title: 'My Test Post',
        content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        author_id: authorId
    });

    if (postRes.status === 201) {
        postId = postRes.data.id;
        console.log(`✅ PASS: Created Post ID ${postId}`);
    } else {
        console.error('❌ FAIL: Could not create post');
        return;
    }

    // 6. GET /posts (List & N+1 Check)
    console.log('\n6. Testing GET /posts (Check N+1 Optimization)...');
    const getPostsRes = await request('/posts');
    const hasAuthorData = getPostsRes.data.some(p => p.id === postId && p.Author && p.Author.name);
    if (hasAuthorData) {
        console.log('✅ PASS: Post response includes nested Author data');
    } else {
        console.error('❌ FAIL: Author data missing from post response');
    }

    // 7. GET /posts?author_id=... (Filtering)
    console.log('\n7. Testing GET /posts?author_id=... (Filtering)...');
    const filterRes = await request(`/posts?author_id=${authorId}`);
    const allMatch = filterRes.data.every(p => p.author_id === authorId);
    if (filterRes.status === 200 && filterRes.data.length > 0 && allMatch) {
        console.log('✅ PASS: Filtering by author_id works');
    } else {
        console.error('❌ FAIL: Filtering failed or returned empty list');
    }

    // 8. PUT /posts/:id (Update)
    console.log('\n8. Testing PUT /posts/:id (Update Post)...');
    const updatePostRes = await request(`/posts/${postId}`, 'PUT', {
        title: 'Updated Title',
        content: 'abcdefghijklmnopqrstuvwxyz'
    });
    if (updatePostRes.status === 200 && updatePostRes.data.title === 'Updated Title') {
        console.log('✅ PASS: Post updated successfully');
    } else {
        console.error('❌ FAIL: Update Post failed');
    }

    // --- SECTION 3: NESTED RESOURCES ---

    // 9. NESTED ROUTE GET /authors/:id/posts
    console.log('\n9. Testing GET /authors/:id/posts (Nested Resource)...');
    const nestedRes = await request(`/authors/${authorId}/posts`);
    if (nestedRes.status === 200 && Array.isArray(nestedRes.data)) {
        console.log(`✅ PASS: Retrieved ${nestedRes.data.length} posts for author`);
    } else {
        console.error('❌ FAIL: Nested route failed');
    }

    console.log('\n🎉 ALL NON-DESTRUCTIVE TESTS COMPLETED.');
}

runTests();