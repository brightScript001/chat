const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Endpoint to send a message
router.post('/', async (req, res) => {
    const { message } = req.body;

    try {
        const twilioMessage = await client.messages.create({
            body: message,
            from: 'whatsapp:' + process.env.WHATSAPP_PHONE_NUMBER,
            to: 'whatsapp:' + process.env.RECIPIENT_PHONE_NUMBER
        });

        res.json({ message: `Message sent: ${twilioMessage.body}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Endpoint to receive incoming messages from Twilio
router.post('/incoming', (req, res) => {
    const message = req.body.Body;
    const from = req.body.From;

    console.log(`Received message from ${from}: ${message}`);

    // Send an automatic reply to the incoming message
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Thanks for your message!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Endpoint to handle incoming webhook requests
router.post('/webhook', async (req, res) => {
    // Handle incoming webhook request here

    // Forward the message to Twilio for processing (optional)
    try {
        const twilioMessage = await client.messages.create({
            body: req.body.message,
            from: 'whatsapp:' + process.env.WHATSAPP_PHONE_NUMBER,
            to: 'whatsapp:' + process.env.RECIPIENT_PHONE_NUMBER
        });

        console.log(`Message sent to Twilio: ${twilioMessage.body}`);
        res.sendStatus(200); // Send a HTTP 200 OK response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send message to Twilio' });
    }
});

module.exports = router;
