/* eslint-disable camelcase */
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const { drawingGameBoard, drawingGoodShot } = require('./lib/drawing.js');
const { placeAllShips, start, check, getChatId,
  game } = require('./lib/game.js');
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

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  start(username, chatId);
  bot.sendMessage(chatId, username + ' : ' + chatId);
});

bot.onText(/\/game (.+)/, (msg, [source, match]) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const user = match.slice(1);
  const chatId2 = getChatId(user);

  if (check(user)) {
    bot.sendMessage(chatId, `Користувач @${user} не використовує цього бота`);
    return;
  }
  bot.sendMessage(chatId, 'Виклик кинуто');
  bot.sendMessage(chatId2, `Прийняти виклик від @${username}?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Yes',
            callback_data: 'ye' + chatId + chatId2
          },
          {
            text: 'No',
            callback_data: 'no' + chatId + chatId2
          }
        ],
      ]
    }
  });
});

bot.on('callback_query', (query) => {
  const chatIdUser1 = query.data.slice(2, 12);
  const chatIdUser2 = query.data.slice(12, 22);

  if (query.data[0] === 'y') {
    bot.sendMessage(chatIdUser1, 'Виклик прийнято!');
    game(chatIdUser1, chatIdUser2, bot);
  }
});

// Test

// drawingGameBoard(sendPicture)
//   .then(() => placeAllShips(sendPicture))
//   .then(() => drawingGoodShot(sendPicture, 1, 1));
