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

function sendPicture(resolve) {
  bot.sendPhoto(chatId, './board.png')
    .then(() => resolve('result'));
  console.log(chatId);
}

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
            callback_data: 'y' + chatId + chatId2
          },
          {
            text: 'No',
            callback_data: 'n' + chatId + chatId2
          }
        ],
      ]
    }
  });
});

bot.on('callback_query', (query) => {
  const chatIdUser1 = query.data.slice(1, 11);
  const chatIdUser2 = query.data.slice(11, 21);
  console.log([1, 2, 3, 4, 5, 6, 7].includes(query.data[0]));
  console.log(query.data[0]);
  console.log(chatIdUser1);

  if ([1, 2, 3, 4, 5, 6, 7].includes(Number(query.data[0]))) {
    bot.sendMessage(chatIdUser1, 'Добре, тепер вертикаль', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'a',
              callback_data: 1
            },
            {
              text: 'b',
              callback_data: 2
            },
            {
              text: 'c',
              callback_data: 3
            },
            {
              text: 'd',
              callback_data: 4
            },
            {
              text: 'e',
              callback_data: 5
            },
            {
              text: 'f',
              callback_data: 6
            },
            {
              text: 'g',
              callback_data: 7
            },
          ]
        ]
      }
    });
  }

  if (query.data[0] === 'y') {
    bot.sendMessage(chatIdUser1, 'Виклик прийнято!');
    game(chatIdUser1, chatIdUser2, bot);
  }
});

// Test

// drawingGameBoard(sendPicture)
//   .then(() => placeAllShips(sendPicture))
//   .then(() => drawingGoodShot(sendPicture, 1, 1));
