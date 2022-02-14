const fs = require('fs');
const PImage = require('pureimage');

const font = PImage.registerFont('CourierNewPS-BoldMT.ttf', 'MyFont');

const img1 = PImage.make(2400, 2400);
const ctx = img1.getContext('2d');

function drawingGameBoard() {

  font.load(() => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 12;

    PImage.encodePNGToStream(img1, fs.createWriteStream('board.png'))
      .then(() => {
        console.log('wrote out the png file to out.png');
      }).catch(() => {
        console.log('there was an error writing');
      });
  });
}
