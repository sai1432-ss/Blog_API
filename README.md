**Blog API with Author and Post Relationships — RESTful Backend with Node.js & Sequelize**

A clean and production-ready RESTful Blog API built using Node.js, Express, and Sequelize (SQLite).
This project showcases real-world backend fundamentals: CRUD operations, relational data modeling, cascade deletes, validation, and performance optimization (N+1 query problem solved the right way).

**Key Features**

*Author Management*

Create, read, update, and delete authors

Cascade delete: deleting an author removes all their posts automatically

*Post Management*

Full CRUD operations for blog posts

Posts are always linked to an author

Fetch posts with author details in a single query

*Relationships & Performance*

One-to-Many relationship (Author → Posts)

Eager loading (include) to avoid the N+1 query problem

Clean relational schema using Sequelize ORM

*Tech Stack*

Runtime	Node.js

Framework	Express.js

ORM	Sequelize

Database	SQLite

API Style	REST


**SQLite is used for simplicity and portability — no external DB setup needed.**

**Installation & Setup**

*1.Clone the Repository*

git clone https://github.com/sai1432-ss/Blog_API.git

cd Blog-API

*2.Install Dependencies*

npm install

*3.Start the Server*

node server.js


Server runs at:
http://localhost:3000

The SQLite database (database.sqlite) is created automatically on first run.

**Testing**

Option 1: 

A full test suite to validate all API functionality.

node test_script.js

✔ Tests:

Author CRUD

Post CRUD

Filtering

Cascade delete behavior

Option 2: Postman Collection

Steps:

Open Postman

Import blog_api.postman_collection.json

Run requests and inspect responses

**API Reference**

*Authors API*

POST	/authors	Create a new author

GET	/authors	Get all authors

GET	/authors/:id	Get author by ID

PUT	/authors/:id	Update author

DELETE	/authors/:id	Delete author (cascade posts)

*Posts API*

POST	/posts	Create a post

GET	/posts	Get all posts 

GET	/posts?author_id=1	Filter posts by author

GET	/posts/:id	Get post by ID

PUT	/posts/:id	Update post

DELETE	/posts/:id	Delete post
