const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();  
// in upper side we install 3 requreid  depedency for this peoject 



 // access env file here 
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize the Telegram bot
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function getRandomWikipediaArticle() {
  try {
    // Fetch a random article summary
    const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/random/summary');
    const data = response.data;
    


    const title = data.title;
    const summary = data.extract;
    const url = data.content_urls.desktop.page;
    
    return { title, summary, url };
  } catch (error) {
    console.error('Error fetching Wikipedia article:', error);
    return null;
  }
}
async function getWikipediaArticleByName(name) {
  try {
    // Fetch article summary by name
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
    const data = response.data;
    
    const title = data.title;
    const summary = data.extract;
    const url = data.content_urls.desktop.page;
    
    return { title, summary, url };
  } catch (error) {
    console.error(`Error fetching Wikipedia article for ${name}:`, error);
    return null;
  }
}

async function postToTelegram(title, summary, url) {
  const message = `**${title}**\n\n${summary}\n\n[Read more](${url})`;
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'Markdown' });
    console.log('Summery posted to Telegram successfully.');
  } catch (error) {
    console.error('Error posting message to Telegram:', error);
  }
}

(async () => {
  const articleName = process.argv[2];  // Get the article name from command-line arguments
  let article;

  if (articleName) {
    article = await getWikipediaArticleByName(articleName);
  } else {
    article = await getRandomWikipediaArticle();
  }

  if (article) {
    const { title, summary, url } = article;
    await postToTelegram(title, summary, url);
  }
})();