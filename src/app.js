require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const messagesRoute = require('./routes/messages');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Route handler for incoming messages
app.use('/api/messages', messagesRoute);

// Route handler for webhook endpoint
app.post('/webhook', (req, res) => {
    // Process incoming webhook request here
    console.log('Received webhook request:', req.body);

    // Send a response if necessary
    res.sendStatus(200); // Send a HTTP 200 OK response
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
