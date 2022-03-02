const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { drawingGameBoard, drawingGoodShot } = require('./lib/drawing.js');
const { placeAllShips } = require('./lib/game.js');
const token = process.env.MY_TELEGRAM_BOT_TOKEN;
const chatId = process.env.MY_TELEGRAM_CHAT_ID;

const userBase = new Object();

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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  userBase[username] = chatId;
  bot.sendMessage(chatId, username + ' : ' + chatId);
});

bot.onText(/\/game (.+)/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const user = match.slice(1);

  if (!Object.keys(userBase).includes(user)) {
    bot.sendMessage(chatId, `Користувач @${user} не використовує цього бота`);
    return;
  }
  bot.sendMessage(chatId, 'Виклик кинуто');
  bot.sendMessage(userBase[user], `Прийняти виклик від @${username}?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Yes',
            callback_data: 'y' + chatId
          }
        ],
        [
          {
            text: 'No',
            callback_data: 'n' + chatId
          }
        ]
      ]
    }
  });
});

bot.on('callback_query', (query) => {
  if (query.data.slice(0, 1) === 'y') {
    bot.sendMessage(query.data.slice(1, 11), 'Виклик прийнято!');
  } else bot.sendMessage(query.data.slice(1, 11), 'Виклик відхилено..');
});

// Test

drawingGameBoard(sendPicture)
  .then(() => placeAllShips(sendPicture))
  .then(() => drawingGoodShot(sendPicture, 1, 1));
