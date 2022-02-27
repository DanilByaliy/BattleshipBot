const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { drawingGameBoard, drawingGoodShot } = require('./lib/drawing.js');
const { placeAllShips } = require('./lib/game.js');
const token = process.env.MY_TELEGRAM_BOT_TOKEN;
const chatId = process.env.MY_TELEGRAM_CHAT_ID;

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

function sendPicture(resolve) {
  bot.sendPhoto(chatId, './board.png')
    .then(() => resolve('result'));
  console.log(chatId);
}

// Test

drawingGameBoard(sendPicture)
  .then(() => placeAllShips(sendPicture))
  .then(() => drawingGoodShot(sendPicture, 1, 1));
