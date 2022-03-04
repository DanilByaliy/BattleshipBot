/* eslint-disable camelcase */
const {  newBoard, drawingGameBoard, drawingAllShips,
  drawingGoodShot, drawingBadShot } = require('./drawing.js');

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
      field[row + i][col] = 3;
      field[row + i][col + 1] = 4;
      field[row + i][col - 1] = 4;
      field[row - 1][col + i - 1] = 4;
      field[row + 3][col + i - 1] = 4;
    } else {
      field[row][col + i] = 3;
      field[row + 1][col + i] = 4;
      field[row - 1][col + i] = 4;
      field[row + i - 1][col - 1] = 4;
      field[row + i - 1][col + 3] = 4;
    }
  }
}

function placeShip2() {
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
      field[row2 + i][col2] = 2;
      field[row2 + i][col2 + 1] = 4;
      field[row2 + i][col2 - 1] = 4;
      field[row2 - 1][col2 + i - 1] = 4;
      field[row2 + 2][col2 + i - 1] = 4;
      field[row2 - 1][col2 + i] = 4;
      field[row2 + 2][col2 + i] = 4;
    } else {
      field[row2][col2 + i] = 2;
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

  field[row3][col3] = 1;
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
    (i < 2) ? placeShip2() : null;
    placeShip1();
  }
  return field;
}

function placeAllShips(callback, ctx, img, field) {
  const promise = new Promise((resolve) => {
    drawingAllShips(field, ctx, img).then(() => callback(resolve));
  });
  return promise;
}

function shot(row, col, game, bot, user) {
  const ctx = game.user1.board.ctx;
  const img = game.user1.board.img;
  row = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(row) + 1;
  console.log(col, row);
  const field = game.user1.field;
  if ([1, 2, 3].includes(field[row][col])) {
    console.log('Good shot');
    drawingGoodShot(sendPicture.bind(null, bot, user), row, col, ctx, img);
    field[row][col] = 5;
  } else {
    console.log('Bad shot');
    drawingBadShot(sendPicture.bind(null, bot, user), row, col, ctx, img);
    field[row][col] = 6;
  }
}

const userBase = new Object();
const state = {
  playing: [],
  games: {}
};

function start(username, chatId) {
  userBase[username] = chatId;
}

function check(user) {
  return !Object.keys(userBase).includes(user);
}

function getChatId(user) {
  return userBase[user];
}

function startGameCheck(user1, user2) {
  return (state.playing.includes(user1) || state.playing.includes(user2));
}

function game(user1, user2, bot) {
  if (startGameCheck(user1, user2)) {
    return;
  }

  state.playing.push(user1, user2);
  const game = {
    user1: {
      chatId: null,
      field: [],
      board: {}
    },
    user2: {
      chatId: null,
      field: [],
      board: {}
    },
    queue: null,
    gameOver: false
  };

  game.queue = 1;
  const { img, ctx } = newBoard();
  game.user1.field = fillFieldShips();
  game.user1.board.img = img;
  game.user1.board.ctx = ctx;
  const field1 = game.user1.field;
  drawingGameBoard(null, ctx, img)
    .then(() => placeAllShips(sendPicture.bind(null, bot, user1),
      ctx, img, field1))
    .then(() => loop(bot, user1, user2, game));
}

function loop(bot, user1, user2, game) {

  bot.on('callback_query', (query) => {
    const chatIdUser1 = query.data.slice(2, 12);
    const chatIdUser2 = query.data.slice(12, 22);
    if (['a', 'b', 'c', 'd', 'e', 'f', 'g'].includes(query.data[0])) {
      bot.sendMessage(chatIdUser1, query.data.slice(0, 2));
      const row = query.data[0];
      const col = Number(query.data[1]);
      shot(row, col, game, bot, user1);
    }
  });

  bot.sendMessage(user1, 'Ваш хід, обирайте горизонталь', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '1',
            callback_data: 10 + user1
          },
          {
            text: '2',
            callback_data: 20 + user1
          },
          {
            text: '3',
            callback_data: 30 + user1
          },
          {
            text: '4',
            callback_data: 40 + user1
          },
          {
            text: '5',
            callback_data: 50 + user1
          },
          {
            text: '6',
            callback_data: 60 + user1
          },
          {
            text: '7',
            callback_data: 70 + user1
          },
        ]
      ]
    }
  });
}

function sendPicture(bot, chatId, resolve) {
  bot.sendPhoto(chatId, './board.png')
    .then(() => { if (resolve) resolve('result'); });
  console.log(chatId);
}

module.exports = { placeAllShips, start, check, getChatId, game };
