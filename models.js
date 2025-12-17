const { Sequelize, DataTypes } = require('sequelize');

// Setup SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
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
            isEmail: true
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
});

// --- Relationships ---
Author.hasMany(Post, { 
    foreignKey: 'author_id', 
    onDelete: 'CASCADE' 
});

Post.belongsTo(Author, { 
    foreignKey: 'author_id' 
});

// *** THIS EXPORT IS CRITICAL ***
module.exports = { sequelize, Author, Post };