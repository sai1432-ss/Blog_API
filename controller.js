// controller.js
const { Author, Post } = require('./models');

// --- AUTHOR CONTROLLERS ---

exports.createAuthor = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newAuthor = await Author.create({ name, email });
        res.status(201).json(newAuthor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAuthors = async (req, res) => {
    const authors = await Author.findAll();
    res.json(authors);
};

exports.getAuthorById = async (req, res) => {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
};

// [NEW] Update Author
exports.updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);
        if (!author) return res.status(404).json({ error: 'Author not found' });

        const { name, email } = req.body;
        await author.update({ name, email });
        res.json(author);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteAuthor = async (req, res) => {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    
    await author.destroy(); // Cascades to posts automatically
    res.json({ message: 'Author and associated posts deleted' });
};

// --- POST CONTROLLERS ---

exports.createPost = async (req, res) => {
    try {
        const { title, content, author_id } = req.body;

        const author = await Author.findByPk(author_id);
        if (!author) {
            return res.status(400).json({ error: 'Invalid author_id: Author does not exist' });
        }

        const newPost = await Post.create({ title, content, author_id });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { author_id } = req.query;
        const whereClause = author_id ? { author_id } : {};

        const posts = await Post.findAll({
            where: whereClause,
            include: [{
                model: Author,
                attributes: ['name', 'email']
            }]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    const post = await Post.findByPk(req.params.id, {
        include: [{ model: Author, attributes: ['name', 'email'] }]
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
};

// [NEW] Update Post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const { title, content } = req.body;
        await post.update({ title, content });
        res.json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// [NEW] Delete Post
exports.deletePost = async (req, res) => {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    await post.destroy();
    res.json({ message: 'Post deleted' });
};

// --- NESTED RESOURCE ---
exports.getPostsByAuthorId = async (req, res) => {
    const author_id = req.params.id;
    const author = await Author.findByPk(author_id);
    if (!author) return res.status(404).json({ error: 'Author not found' });

    const posts = await Post.findAll({ where: { author_id } });
    res.json(posts);
};