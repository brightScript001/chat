require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const messagesRoute = require('./routes/messages');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/messages', messagesRoute);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
