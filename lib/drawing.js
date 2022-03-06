const fs = require('fs');
const PImage = require('pureimage');

const font = PImage.registerFont('CourierNewPS-BoldMT.ttf', 'MyFont');

function newBoard() {
  const img = PImage.make(4800, 2400);
  const ctx = img.getContext('2d');
  ctx.strokeStyle = 'black';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 15;
  return [img, ctx];
}

function col(ctx, i, n) {
  ctx.beginPath();
  ctx.moveTo(2400 * n + 150 + 300 * i, 2250);
  ctx.lineTo(2400 * n + 150 + 300 * i, 150);
  ctx.lineTo(2400 * n + 165 + 300 * i, 2250);
  ctx.stroke();
  ctx.closePath();
}

function row(ctx, i, n) {
  ctx.beginPath();
  ctx.moveTo(2400 * n + 2250, 150 + 300 * i);
  ctx.lineTo(2400 * n + 150, 150 + 300 * i);
  ctx.lineTo(2400 * n + 2250, 165 + 300 * i);
  ctx.stroke();
  ctx.closePath();
}

function drawingLetters(n, ctx) {
  font.load(() => {
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = '#000000';
      ctx.font = '120pt MyFont';
      ctx.fillText('abcdefg'[i], 2400 * n + 270 + 300 * i, 95);
    }
  });
}

function drawingNumbers(n, ctx) {
  font.load(() => {
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = '#000000';
      ctx.font = '120pt MyFont';
      ctx.fillText((i + 1).toString(), 2400 * n + 30, 330 + 300 * i);
    }
  });
}

function encodPNGToStream(callback, path, resolve, img) {
  PImage.encodePNGToStream(img, fs.createWriteStream(`${path}`))
    .then(() => {
      if (callback) callback(resolve);
      else resolve('result');
      console.log(`wrote out the png file to ${path}`);
    }).catch(() => {
      console.log('there was an error writing');
    });
}

function drawingGameField(n, ctx) {
  ctx.fillRect(2400 * (n - 1) + 130, 130, 2140, 2140);
  ctx.clearRect(2400 * (n - 1) + 150, 150, 2100, 2100);
  drawingLetters(n - 1, ctx);
  drawingNumbers(n - 1, ctx);

  for (let i = 1; i < 7; i++) {
    col(ctx, i, n - 1);
    row(ctx, i, n - 1);
  }
}

function drawingGameBoard(callback, path, ctx, img) {
  const promise = new Promise((resolve) => {
    drawingGameField(1, ctx);
    drawingGameField(2, ctx);
    encodPNGToStream(callback, path, resolve, img);
  });
  return promise;
}

function drawingGoodShot(callback, path, i, j, n, ctx, img) {
  const promise = new Promise((resolve) => {
    i -= 1;
    j -= 1;
    ctx.beginPath();
    ctx.moveTo(2400 * n + 180 + i * 300, 180 + j * 300);
    ctx.lineTo(2400 * n + 420 + i * 300, 420 + j * 300);
    ctx.moveTo(2400 * n + 420 + i * 300, 180 + j * 300);
    ctx.lineTo(2400 * n + 180 + i * 300, 420 + j * 300);
    ctx.stroke();
    ctx.closePath();
    encodPNGToStream(callback, path, resolve, img);
  });
  return promise;
}

function drawingBadShot(callback, path, i, j, n, ctx, img) {
  const promise = new Promise((resolve) => {
    ctx.beginPath();
    ctx.arc(2400 * n + 300 * i, 300 * j, 50, 0, Math.PI, false);
    ctx.arc(2400 * n + 300 * i, 300 * j, 50, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    encodPNGToStream(callback, path, resolve, img);
  });
  return promise;
}

function drawingAllShips(array, path, ctx, img) {
  const promise = new Promise((resolve) => {
    for (let i = 1; i < 9; i++) {
      for (let j = 1; j < 9; j++) {
        [1, 2, 3].includes(array[i][j]) ? drawingShip(i, j, ctx) : null;
      }
    }
    encodPNGToStream(null, path, resolve, img);
  });
  return promise;
}

function drawingShip(i, j, ctx) {
  i -= 1;
  j -= 1;
  ctx.beginPath();
  ctx.moveTo(300 + i * 300, 200 + j * 300);
  ctx.lineWidth = 30;
  ctx.lineTo(420 + i * 300, 300 + j * 300);
  ctx.stroke();
  ctx.lineWidth = 26;
  ctx.lineTo(300 + i * 300, 420 + j * 300);
  ctx.stroke();
  ctx.lineWidth = 22;
  ctx.lineTo(185 + i * 300, 300 + j * 300);
  ctx.stroke();
  ctx.lineWidth = 18;
  ctx.lineTo(300 + i * 300, 150 + j * 300);
  ctx.stroke();
  ctx.closePath();
}

module.exports = { drawingGameBoard, drawingGoodShot, drawingBadShot,
  drawingAllShips, newBoard };
