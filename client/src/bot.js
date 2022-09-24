/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const listener = require('./listener');

const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

listener(bot);

console.log('Bot has been started....');
