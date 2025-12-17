// models.js
const { Sequelize, DataTypes } = require('sequelize');

// Setup SQLite (Change dialect to 'mysql' or 'postgres' if using those)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Creates a file-based DB
    logging: false // Clean console output
});

// --- Define Author Model ---
const Author = sequelize.define('Author', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validates email format
        }
    }
});

// --- Define Post Model ---
const Post = sequelize.define('Post', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
    // author_id is created automatically by the association below
});

// --- Relationships (The Core Requirement) ---
// One Author has Many Posts
Author.hasMany(Post, { 
    foreignKey: 'author_id', 
    onDelete: 'CASCADE' // REQUIREMENT: Deleting author deletes their posts
});

// A Post belongs to an Author
Post.belongsTo(Author, { 
    foreignKey: 'author_id' 
});

module.exports = { sequelize, Author, Post };