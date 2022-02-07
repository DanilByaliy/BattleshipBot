const TelegramBot = require('node-telegram-bot-api');
const token = MY_TELEGRAM_BOT_TOKEN;

console.log('Bot has been started....');

const bot = new TelegramBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});