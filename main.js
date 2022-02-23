const TelegramBot = require('node-telegram-bot-api');
const token = MY_TELEGRAM_BOT_TOKEN;

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
  bot.sendMessage(userBase[user], `Прийняти виклик від @${username}?`);
});
