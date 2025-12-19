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
        // Handle empty responses safely (like from DELETE)
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};
        return { status: response.status, data };
    } catch (error) {
        console.error(`Error connecting to ${endpoint}:`, error.message);
        process.exit(1);
    }
}

async function runTests() {
    console.log('🚀 Starting Full API Test (Create, Read, Update, Delete)...\n');

    let authorId = null;
    let postId = null;

    // --- SECTION 1: AUTHOR MANAGEMENT ---

    // 1. POST /authors
    console.log('1. Testing POST /authors (Create Author)...');
    const authorRes = await request('/authors', 'POST', {
        name: 'Author1',
        email: 'author1@gmail.com' // REMOVED TIMESTAMP
    });
    
    if (authorRes.status === 201) {
        authorId = authorRes.data.id;
        console.log(`✅ PASS: Created Author ID ${authorId}`);
        console.log('   [DATA]:', JSON.stringify(authorRes.data, null, 2));
    } else {
        console.error('❌ FAIL: Could not create author (Email might already exist if you ran this before)', authorRes.data);
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
        name: 'AuthorUpdated',
        email: 'AuthorUpdated@gmail.com' // REMOVED TIMESTAMP
    });
    if (updateAuthorRes.status === 200 && updateAuthorRes.data.name === 'AuthorUpdated') {
        console.log('✅ PASS: Author updated successfully');
        console.log('   [DATA]:', JSON.stringify(updateAuthorRes.data, null, 2));
    } else {
        console.error('❌ FAIL: Update Author failed');
    }

    // --- SECTION 2: POST MANAGEMENT ---

    // 5. POST /posts (Create)
    console.log('\n5. Testing POST /posts (Create Post)...');
    const postRes = await request('/posts', 'POST', {
        title: 'Author-1 Post',
        content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        author_id: authorId
    });

    if (postRes.status === 201) {
        postId = postRes.data.id;
        console.log(`✅ PASS: Created Post ID ${postId}`);
        console.log('   [DATA]:', JSON.stringify(postRes.data, null, 2));
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
        console.log('✅ PASS: Filtering by author_id works.');
        console.log('   [DATA]:', JSON.stringify(filterRes.data, null, 2));
    } else {
        console.error('❌ FAIL: Filtering failed');
    }

    // 8. GET /posts/:id (Single Post)
    console.log('\n8. Testing GET /posts/:id (Single Post)...');
    const getSinglePostRes = await request(`/posts/${postId}`);
    if (getSinglePostRes.status === 200 && getSinglePostRes.data.id === postId) {
        console.log('✅ PASS: Retrieved single post correctly');
        console.log('   [DATA]:', JSON.stringify(getSinglePostRes.data, null, 2));
    } else {
        console.error('❌ FAIL: Could not retrieve single post');
    }

    // 9. PUT /posts/:id (Update)
    console.log('\n9. Testing PUT /posts/:id (Update Post)...');
    const updatePostRes = await request(`/posts/${postId}`, 'PUT', {
        title: 'Author-1 Updated_Post',
        content: 'abcdefghijklmnopqrstuvwxyz'
    });
    if (updatePostRes.status === 200 && updatePostRes.data.title === 'Author-1 Updated_Post') {
        console.log('✅ PASS: Post updated successfully');
        console.log('   [DATA]:', JSON.stringify(updatePostRes.data, null, 2));
    } else {
        console.error('❌ FAIL: Update Post failed');
    }

    // --- SECTION 3: DELETION ---

    // 10. DELETE /posts/:id (Delete Single Post)
    console.log('\n10. Testing DELETE /posts/:id (Delete Single Post)...');
    // Create temp post to delete
    const tempPost = await request('/posts', 'POST', { title: 'Temp', content: 'Delete Me', author_id: authorId });
    const tempId = tempPost.data.id;
    
    const delPostRes = await request(`/posts/${tempId}`, 'DELETE');
    const checkDel = await request(`/posts/${tempId}`);
    
    if (delPostRes.status === 200 && checkDel.status === 404) {
        console.log(`✅ PASS: Post ${tempId} deleted successfully`);
    } else {
        console.error('❌ FAIL: Post deletion failed');
    }

    // 11. DELETE /authors/:id (Cascade Delete)
    console.log('\n11. Testing DELETE /authors/:id (Cascade Delete)...');
    console.log(`    Deleting Author ID ${authorId}...`);
    await request(`/authors/${authorId}`, 'DELETE');
    
    // Check if the post is gone
    const checkCascade = await request(`/posts/${postId}`);
    
    if (checkCascade.status === 404) { 
        console.log('✅ PASS: Author deleted AND Post automatically removed!');
    } else {
        console.error('❌ FAIL: Post still exists after Author deletion');
    }

    console.log('\n🎉 ALL TESTS COMPLETED.');
}

runTests();