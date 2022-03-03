/* eslint-disable camelcase */
const {  newBoard, drawingGameBoard, drawingAllShips,
  drawingGoodShot } = require('./drawing.js');

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

function placeAllShips(callback, ctx, img) {
  const promise = new Promise((resolve) => {
    fillFieldShips();
    drawingAllShips(field, ctx, img).then(() => callback(resolve));
  });
  return promise;
}

// for (let i = 0; i < 9; i++) {
//   console.log(field[i].join(' '));
// }

function shot(row, col) {
  if ([1, 2, 3].includes(field[row][col])) {
    console.log('Good shot');
    field[row][col] = 5;
  } else field[row][col] = 6;
}

// for (let i = 0; i < 9; i++) {
//   console.log(field[i].join(' '));
// }

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
      field: [],
      board: {}
    },
    user2: {
      field: [],
      board: {}
    },
    queue: null,
    gameOver: false
  };

  game.queue = 1;
  const { img, ctx } = newBoard();
  drawingGameBoard(null, ctx, img)
    .then(() => placeAllShips(sendPicture.bind(null, bot, user1), ctx, img))
    .then(() => loop(bot, user1, user2));
}

function loop(bot, user1, user2) {
  bot.sendMessage(user1, 'Ваш хід, обирайте горизонталь', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '1',
            callback_data: 1 + user1
          },
          {
            text: '2',
            callback_data: 2 + user1
          },
          {
            text: '3',
            callback_data: 3 + user1
          },
          {
            text: '4',
            callback_data: 4 + user1
          },
          {
            text: '5',
            callback_data: 5 + user1
          },
          {
            text: '6',
            callback_data: 6 + user1
          },
          {
            text: '7',
            callback_data: 7 + user1
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
