const fs = require('fs');
const PImage = require('pureimage');

const font = PImage.registerFont('CourierNewPS-BoldMT.ttf', 'MyFont');

const img1 = PImage.make(2400, 2400);
const ctx = img1.getContext('2d');

function col(ctx, i) {
  console.log(i);
  ctx.beginPath();
  ctx.moveTo(150 + 300 * i, 2250);
  ctx.lineTo(150 + 300 * i, 150);
  ctx.lineTo(165 + 300 * i, 2250);
  ctx.stroke();
  ctx.closePath();
}

function row(ctx, i) {
  console.log(i);
  ctx.moveTo(2250, 150 + 300 * i);
  ctx.lineTo(150, 150 + 300 * i);
  ctx.lineTo(2250, 165 + 300 * i);
  ctx.stroke();
  ctx.closePath();
}

function drawingGameBoard(callback) {

  font.load(() => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 15;

    ctx.fillRect(130, 130, 2140, 2140);
    ctx.clearRect(150, 150, 2100, 2100);

    for (let i = 1; i < 7; i++) {
      col(ctx, i);
      row(ctx, i);
    }

    PImage.encodePNGToStream(img1, fs.createWriteStream('board.png'))
      .then(() => {
        callback();
        console.log('wrote out the png file to board.png');
      }).catch(() => {
        console.log('there was an error writing');
      });
  });
}

module.exports = { drawingGameBoard };
