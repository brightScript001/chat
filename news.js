const axios = require('axios');

async function getNewsHeadlines(country = 'us') {
    const apiKey = process.env.NEWS_API_KEY;
    const apiUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news headlines:', error);
        return [];
    }
}

module.exports = { getNewsHeadlines };
