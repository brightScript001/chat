require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const messagesRoute = require('./routes/messages');
const { getNewsHeadlines } = require('./news');
const { getWeatherDataForCity } = require('./weather');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));

app.use('/api/messages', messagesRoute);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// Webhook endpoint for receiving messages from Twilio
app.post('/webhook', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();

    // Extract message data from the incoming request
    const messageBody = req.body.Body.toLowerCase();

    // Logic to generate response based on the incoming message
    let responseMessage = '';

    if (messageBody.includes('hello') || messageBody.includes('hi') || messageBody.includes('hey')) {
        responseMessage = 'Welcome to Cici! How can I assist you today?';
    } else if (messageBody.includes('inquiry') || messageBody.includes('question') || messageBody.includes('help')) {
        responseMessage = 'For any other inquiries or assistance, feel free to reach out to our customer service team. We\'re here to help!';
    } else if (messageBody.includes('appointment') || messageBody.includes('booking')) {
        responseMessage = 'To book an appointment, please visit our website or call our customer service hotline. Our representatives will assist you in scheduling your appointment at your convenience.';
    } else if (messageBody.includes('promotion') || messageBody.includes('discount')) {
        responseMessage = 'Check out our current promotions and discounts on our website or social media pages. We frequently offer special deals on selected items.';
    } else if (messageBody.includes('okay') || messageBody.includes('alright') || messageBody.includes('sure')) {
        responseMessage = 'Okay, let me know if you have any other questions!';
    } else if (messageBody.includes('order status') || messageBody.includes('tracking')) {
        responseMessage = 'Your order is currently being processed. You can expect delivery within 2-3 business days. If you have any further questions, feel free to contact us!';
    } else if (messageBody.includes('return') || messageBody.includes('refund')) {
        responseMessage = 'Our return and refund policy allows for returns within 30 days of purchase. Refunds will be issued upon receipt of the returned item in its original condition. Please contact our customer service for assistance with returns and refunds.';
    } else if (messageBody.includes('open')) {
        responseMessage = 'We are open from Monday to Friday, 9:00 AM to 5:00 PM. We are closed on Saturday and Sunday.';
    } else if (messageBody.includes('price') || messageBody.includes('pricing') || messageBody.includes('features')) {
        responseMessage = 'Our cakes come in various sizes and types. Here are our offerings:\n\n1. Chocolate Cake - $20\n2. Vanilla Cake - $18\n3. Red Velvet Cake - $25\n\nFeel free to ask if you have any specific questions about our products!';
    } else if (messageBody.includes('news')) {
        const newsHeadlines = await getNewsHeadlines();
        if (newsHeadlines.length > 0) {
            let newsSummary = 'Latest News Headlines:\n';
            for (const article of newsHeadlines) {
                newsSummary += `${article.title}\n${article.description}\nRead more: ${article.url}\n\n`;
            }
            responseMessage = newsSummary;
        } else {
            responseMessage = 'Sorry, I couldn\'t fetch the latest news headlines.';
        }
    } else if (messageBody.includes('weather in')) {
        const city = messageBody.split('weather in')[1].trim();
        const cityWeatherData = await getWeatherDataForCity(city);
        if (cityWeatherData) {
            const temperature = cityWeatherData.main.temp;
            const weatherDescription = cityWeatherData.weather[0].description;
            responseMessage = `The current weather in ${city} is ${weatherDescription} with a temperature of ${temperature}°C.`;
        } else {
            responseMessage = `Sorry, I couldn't fetch the weather data for ${city}.`;
        }
    } else {
        responseMessage = 'I\'m sorry, I didn\'t understand that. Please try again.';
    }

    // Construct TwiML response with the generated message
    twiml.message(responseMessage);

    // Send the TwiML response back to the user
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
