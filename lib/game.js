/* eslint-disable camelcase */
const {  newBoard, drawingGameBoard, drawingAllShips,
  drawingGoodShot, drawingBadShot } = require('./drawing.js');

const fs = require('fs');

let field = [];

function fillFieldZero() {
  for (let i = 0; i < 9; i++) {
    const array = new Array(9);
    array.fill(0);
    field.push(array);
  }

  for (let i = 0; i < 9; i++) {
    field[0][i] = 7;
    field[8][i] = 7;
    field[i][0] = 7;
    field[i][8] = 7;
  }
}

function placeShip3() {
  const row = Math.round(Math.random() * 4) + 1;
  const col = Math.round(Math.random() * 4) + 1;
  const random = Math.random() > 0.5;

  for (let i = 0; i < 3; i++) {
    if (random) {
      field[row + i][col] = '3';
      field[row + i][col + 1] = 4;
      field[row + i][col - 1] = 4;
      field[row - 1][col + i - 1] = 4;
      field[row + 3][col + i - 1] = 4;
    } else {
      field[row][col + i] = '3';
      field[row + 1][col + i] = 4;
      field[row - 1][col + i] = 4;
      field[row + i - 1][col - 1] = 4;
      field[row + i - 1][col + 3] = 4;
    }
  }
}

function placeShip2(n) {
  let row2, col2, row22, col22;
  const random = Math.random() > 0.5;

  do {
    row22 = row2 = Math.round(Math.random() * 6) + 1;
    col22 = col2 = Math.round(Math.random() * 6) + 1;

    if (random) {
      row22 = row2 + 1;
    } else col22 = col2 + 1;

  } while (field[row2][col2] !== 0 || field[row22][col22] !== 0);

  for (let i = 0; i < 2; i++) {
    if (random) {
      field[row2 + i][col2] = `2${n + 1}`;
      field[row2 + i][col2 + 1] = 4;
      field[row2 + i][col2 - 1] = 4;
      field[row2 - 1][col2 + i - 1] = 4;
      field[row2 + 2][col2 + i - 1] = 4;
      field[row2 - 1][col2 + i] = 4;
      field[row2 + 2][col2 + i] = 4;
    } else {
      field[row2][col2 + i] = `2${n + 1}`;
      field[row2 + 1][col2 + i] = 4;
      field[row2 - 1][col2 + i] = 4;
      field[row2 + i - 1][col2 - 1] = 4;
      field[row2 + i - 1][col2 + 2] = 4;
      field[row2 + i][col2 - 1] = 4;
      field[row2 + i][col2 + 2] = 4;
    }
  }
}

function placeShip1() {
  let row3, col3, counter = 0;

  if (counter < 20) {
    do {
      row3 = Math.round(Math.random() * 6) + 1;
      col3 = Math.round(Math.random() * 6) + 1;
      counter += 1;
    } while (field[row3][col3] !== 0);
  } else {
    do {
      row3 += 1;
      col3 = field[row3].indexOf(0);
    } while (col3 === -1);
  }

  field[row3][col3] = '1';
  field[row3][col3 - 1] = 4;
  field[row3][col3 + 1] = 4;

  for (let i = 0; i < 3; i++) {
    field[row3 - 1][col3 - 1 + i] = 4;
    field[row3 + 1][col3 - 1 + i] = 4;
  }
}

function fillFieldShips() {
  field = [];
  fillFieldZero();
  for (let i = 0; i < 3; i++) {
    (i < 1) ? placeShip3() : null;
    (i < 2) ? placeShip2(i) : null;
    placeShip1();
  }
  return field;
}

function placeAllShips(callback, path, ctx, img, field) {
  const promise = new Promise((resolve) => {
    drawingAllShips(field, path, ctx, img).then(() => callback(resolve));
  });
  return promise;
}

function shot(row, col, game, bot, user) {
  const user1 = game.currentPlayer.chatId;
  const user2 = game.enemyPlayer.ChatId;
  const ctx1 = game.currentPlayer.board.ctx;
  const img1 = game.currentPlayer.board.img;
  const ctx2 = game.enemyPlayer.enemyBoard.ctx;
  const img2 = game.enemyPlayer.enemyBoard.img;
  const path = game.currentPlayer.path;
  const otherPath = game.enemyPlayer.otherPath;

  row = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(row) + 1;
  console.log(col, row);
  const field = game.enemyPlayer.field;
  if (['1', '2', '3'].includes(field[row][col][0])) {
    bot.sendMessage(user1, 'Вітаю, капітане, влучний постріл!');
    bot.sendMessage(user2, 'Противник влучив у Ваш корабель..');
    console.log('Good shot');
    if (field[row][col] === '3') {
      game.currentPlayer.enemyShips.three -= 1;
      game.currentPlayer.enemyShips.all -= 1;
    } else if (field[row][col] === '21') {
      game.currentPlayer.enemyShips.two1 -= 1;
      game.currentPlayer.enemyShips.all -= 1;
    } else if (field[row][col] === '22') {
      game.currentPlayer.enemyShips.two2 -= 1;
      game.currentPlayer.enemyShips.all -= 1;
    }

    if (field[row][col] === '1' || game.currentPlayer.enemyShips.three === 0 ||
    game.currentPlayer.enemyShips.two1 === 0 ||
    game.currentPlayer.enemyShips.two2 === 0) {
      bot.sendMessage(user1, 'Корабель суперника затоплено!!!');
      if (field[row][col] === '1') {
        game.currentPlayer.enemyShips.all -= 1;
      } else if (game.currentPlayer.enemyShips.three === 0) {
        game.currentPlayer.enemyShips.three -= 1;
      } else if (game.currentPlayer.enemyShips.two1 === 0) {
        game.currentPlayer.enemyShips.two1 -= 1;
      } else if (game.currentPlayer.enemyShips.two2 === 0) {
        game.currentPlayer.enemyShips.two2 -= 1;
      }
    }

    field[row][col] = 5;
    if (game.currentPlayer.enemyShips.all === 0) {
      drawingGoodShot(sendPicture.bind(null, path, bot, user1),
        path, row, col, 1, ctx1, img1);
      drawingGoodShot(sendPicture.bind(null, otherPath, bot, user2),
        otherPath, row, col, 0, ctx2, img2);
      bot.sendMessage(user1, 'Всі корабелі суперника затоплено!!!');
      bot.sendMessage(user1, 'Ви перемогли!!!');
      bot.sendMessage(user2, 'Всі ваші кораблі затоплені');
      bot.sendMessage(user2, 'Перемогу отримує ваш суперник');
      return;
    }

    Promise.all([
      drawingGoodShot(sendPicture.bind(null, path, bot, user1),
        path, row, col, 1, ctx1, img1),
      drawingGoodShot(sendPicture.bind(null, otherPath, bot, user2),
        otherPath, row, col, 0, ctx2, img2)
    ]).then(() => loop(bot, game));
  } else {
    bot.sendMessage(user1, 'На жаль цей постріл невдалий..');
    bot.sendMessage(user2, 'Противник не влучив, кораблі цілі');
    console.log('Bad shot');
    field[row][col] = 6;
    game.currentPlayer = (user === game.user1.chatId) ? game.user2 : game.user1;
    game.enemyPlayer = (user === game.user1.chatId) ? game.user2 : game.user1;

    Promise.all([
      drawingBadShot(sendPicture.bind(null, path, bot, user1),
        path, row, col, 1, ctx1, img1),
      drawingBadShot(sendPicture.bind(null, otherPath, bot, user2),
        otherPath, row, col, 0, ctx2, img2)
    ]).then(() => loop(bot, game));
  }
}

const userBase = new Object();
const fileContent = fs.readFileSync('userBase.txt', 'utf8');

const state = {
  playing: [],
  games: {}
};

function start(username, chatId) {
  if (userBase[username]) return;
  userBase[username] = chatId;
  const fileContent = fs.readFileSync('userBase.txt', 'utf8');
  const newUser = '\n' + username + ' : ' + chatId.toString();
  fs.writeFileSync('userBase.txt', fileContent + newUser);
}

function launch() {
  const baseArray = fileContent.split('\n');
  for (const row of baseArray) {
    const userArray = row.split(' : ');
    userBase[userArray[0]] = userArray[1];
  }
}

launch();

function check(user) {
  return !Object.keys(userBase).includes(user);
}

function getChatId(user) {
  return userBase[user];
}

function startGameCheck(user1, user2) {
  return (state.playing.includes(user1) || state.playing.includes(user2));
}

function game(userr1, userr2, bot) {
  if (startGameCheck(userr1, userr2)) {
    return;
  }

  state.playing.push(userr1, userr2);
  const game = {
    user1: {
      chatId: userr1,
      field: [],
      board: {},
      path: null,
      enemyShips: {
        all: 10,
        three: 3,
        two1: 2,
        two2: 2
      }
    },
    user2: {
      chatId: userr2,
      field: [],
      board: {},
      path: null,
      enemyShips: {
        all: 10,
        three: 3,
        two1: 2,
        two2: 2
      }
    },
    currentPlayer: null,
    enemyPlayer: null,
    gameOver: false
  };

  const array = newBoard();
  const img1 = array[0];
  const ctx1 = array[1];
  game.user1.field = fillFieldShips();
  game.user1.board.img = img1;
  game.user1.board.ctx = ctx1;
  game.user1.path = `./gameBoards/${userr1}.png`;

  const array2 = newBoard();
  const img2 = array2[0];
  const ctx2 = array2[1];
  game.user2.field = fillFieldShips();
  game.user2.board.img = img2;
  game.user2.board.ctx = ctx2;
  game.user2.path = `./gameBoards/${userr2}.png`;

  game.currentPlayer = game.user2;
  game.enemyPlayer = game.user1;
  const field1 = game.user1.field;
  const field2 = game.user2.field;
  const path1 = game.user1.path;
  const path2 = game.user2.path;

  Promise.all([drawingGameBoard(null, path1, ctx1, img1)
    .then(() => placeAllShips(sendPicture.bind(null, path1, bot, userr1),
      path1, ctx1, img1, field1)),
  drawingGameBoard(null, path2, ctx2, img2)
    .then(() => placeAllShips(sendPicture.bind(null, path2, bot, userr2),
      path2, ctx2, img2, field2))]).then(() => loop(bot, game));

  bot.on('callback_query', (query) => {
    const chatIdCurrentUser = query.data.slice(2, 12);

    if ([1, 2, 3, 4, 5, 6, 7].includes(Number(query.data[0])) &&
    chatIdCurrentUser === game.currentPlayer.chatId) {
      const user = chatIdCurrentUser;
      bot.sendMessage(user, 'Добре, тепер вертикаль', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'a',
                callback_data: `a${query.data[0]}` + user
              },
              {
                text: 'b',
                callback_data: `b${query.data[0]}` + user
              },
              {
                text: 'c',
                callback_data: `c${query.data[0]}` + user
              },
              {
                text: 'd',
                callback_data: `d${query.data[0]}` + user
              },
              {
                text: 'e',
                callback_data: `e${query.data[0]}` + user
              },
              {
                text: 'f',
                callback_data: `f${query.data[0]}` + user
              },
              {
                text: 'g',
                callback_data: `g${query.data[0]}` + user
              },
            ]
          ]
        }
      });
    }

    if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(query.data[0]) &&
    chatIdCurrentUser === game.currentPlayer.chatId) {
      const user = chatIdCurrentUser;
      bot.sendMessage(user, query.data.slice(0, 2));
      const row = query.data[0];
      const col = Number(query.data[1]);
      shot(row, col, game, bot, user);
    }
  });
}

function loop(bot, game) {
  const user = game.currentPlayer.chatId;
  bot.sendMessage(user, 'Ваш хід, обирайте горизонталь', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '1',
            callback_data: 10 + user
          },
          {
            text: '2',
            callback_data: 20 + user
          },
          {
            text: '3',
            callback_data: 30 + user
          },
          {
            text: '4',
            callback_data: 40 + user
          },
          {
            text: '5',
            callback_data: 50 + user
          },
          {
            text: '6',
            callback_data: 60 + user
          },
          {
            text: '7',
            callback_data: 70 + user
          },
        ]
      ]
    }
  });
}

function sendPicture(path, bot, chatId, resolve) {
  bot.sendPhoto(chatId, path)
    .then(() => { if (resolve) resolve('result'); });
  console.log(chatId);
}

module.exports = { placeAllShips, start, check, getChatId, game };
