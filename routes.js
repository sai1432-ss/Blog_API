// routes.js
const express = require('express');
const router = express.Router();
const controller = require('./controller');

// Author Routes
router.post('/authors', controller.createAuthor);
router.get('/authors', controller.getAuthors);
router.get('/authors/:id', controller.getAuthorById);
router.put('/authors/:id', controller.updateAuthor); // [NEW]
router.delete('/authors/:id', controller.deleteAuthor);

// Post Routes
router.post('/posts', controller.createPost);
router.get('/posts', controller.getPosts);
router.get('/posts/:id', controller.getPostById);
router.put('/posts/:id', controller.updatePost); // [NEW]
router.delete('/posts/:id', controller.deletePost); // [NEW]

// Nested Route
router.get('/authors/:id/posts', controller.getPostsByAuthorId);

module.exports = router;