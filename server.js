// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/', routes);

// Sync Database and Start Server
// force: false ensures we DO NOT drop tables on restart (Persists Data)
sequelize.sync({ force: false }).then(() => {
    console.log('Database connected and tables synced.');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});