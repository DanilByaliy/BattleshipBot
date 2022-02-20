const fs = require('fs');
const PImage = require('pureimage');

// const font = PImage.registerFont('CourierNewPS-BoldMT.ttf', 'MyFont');

const img1 = PImage.make(2400, 2400);
const ctx = img1.getContext('2d');
ctx.strokeStyle = 'black';
ctx.fillStyle = '#000000';
ctx.lineWidth = 15;

function col(ctx, i) {
  ctx.beginPath();
  ctx.moveTo(150 + 300 * i, 2250);
  ctx.lineTo(150 + 300 * i, 150);
  ctx.lineTo(165 + 300 * i, 2250);
  ctx.stroke();
  ctx.closePath();
}

function row(ctx, i) {
  ctx.beginPath();
  ctx.moveTo(2250, 150 + 300 * i);
  ctx.lineTo(150, 150 + 300 * i);
  ctx.lineTo(2250, 165 + 300 * i);
  ctx.stroke();
  ctx.closePath();
}

function encodPNGToStream(callback, resolve) {
  PImage.encodePNGToStream(img1, fs.createWriteStream('board.png'))
    .then(() => {
      if (callback) callback();
      setTimeout(() => {
        resolve('result');
      }, 5);
      console.log('wrote out the png file to board.png');
    }).catch(() => {
      console.log('there was an error writing');
    });
}

function drawingGameBoard(callback) {
  const promise = new Promise((resolve) => {

    ctx.fillRect(130, 130, 2140, 2140);
    ctx.clearRect(150, 150, 2100, 2100);

    for (let i = 1; i < 7; i++) {
      col(ctx, i);
      row(ctx, i);
    }
    encodPNGToStream(callback, resolve);
  });
  return promise;
}

function drawingGoodShot(callback, i, j) {
  const promise = new Promise((resolve) => {
    i -= 1;
    j -= 1;
    ctx.beginPath();
    ctx.moveTo(180 + i * 300, 180 + j * 300);
    ctx.lineTo(420 + i * 300, 420 + j * 300);
    ctx.moveTo(420 + i * 300, 180 + j * 300);
    ctx.lineTo(180 + i * 300, 420 + j * 300);
    ctx.stroke();
    ctx.closePath();
    encodPNGToStream(callback, resolve);
  });
  return promise;
}

function drawingBadShot(callback, i, j) {
  const promise = new Promise((resolve) => {
    ctx.beginPath();
    ctx.arc(300 * i, 300 + 300 * j, 50, 0, Math.PI, false);
    ctx.arc(300 * i, 300 + 300 * j, 50, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();
    encodPNGToStream(callback, resolve);
  });
  return promise;
}

function drawingAllShips(array) {
  const promise = new Promise((resolve) => {
    for (let i = 1; i < 9; i++) {
      for (let j = 1; j < 9; j++) {
        [1, 2, 3].includes(array[i][j]) ? drawingShip(i, j) : null;
      }
    }
    encodPNGToStream(null, resolve);
  });
  return promise;
}

function drawingShip(i, j) {
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
  drawingAllShips };
