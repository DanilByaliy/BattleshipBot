const field = [];

function fillField() {
  for (let i = 0; i < 7; i++) {
  const array = new Array(7);
  array.fill(0);
  field.push(array);
  }
}

function placeShip3() {
  const row = Math.round(Math.random()*4);
  const col = Math.round(Math.random()*4);
  for (let i = 0; i < 3; i++) {
    if (row > 2) {
      field[row+i][col] = 1;
    } else {
      field[row][col+i] = 1;
    }
  }
}

fillField();
placeShip3();
console.dir(field);