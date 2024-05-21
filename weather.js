const axios = require('axios');

async function getWeatherDataForCity(city) {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error);
        return null;
    }
}

module.exports = { getWeatherDataForCity };
