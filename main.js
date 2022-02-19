const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { drawingGameBoard, drawingGoodShot,
  drawingBadShot } = require('./lib/drawing.js');
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

function sendPicture() {
  console.log(chatId);
  bot.sendPhoto(chatId, './board.png');
}
// Test

drawingGameBoard(sendPicture)
  .then(() => drawingGoodShot(sendPicture, 1, 1))
  .then(() => drawingBadShot(sendPicture, 2, 2))
  .then(() => drawingGoodShot(sendPicture, 3, 2));
