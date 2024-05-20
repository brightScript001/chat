const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

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

module.exports = router;
