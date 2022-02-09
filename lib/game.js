const field = [];

function fillField() {
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
  const row = Math.round(Math.random()*4) + 1;
  const col = Math.round(Math.random()*4) + 1;
  const random = Math.random();
  
  for (let i = 0; i < 3; i++) {
    if (random > 0.5) {
      field[row+i][col] = 3;
      field[row+i][col+1] = 4;
      field[row+i][col-1] = 4;
      field[row-1][col+i-1] = 4;
      field[row+3][col+i-1] = 4;
    } else {
      field[row][col+i] = 3;
      field[row+1][col+i] = 4;
      field[row-1][col+i] = 4;
      field[row+i-1][col-1] = 4;
      field[row+i-1][col+3] = 4;
    }
  }
}

function placeShip2() {
  let row2, col2, row22, col22;
  const random = Math.random();

  do {
    row22 = row2 = Math.round(Math.random()*4) + 1;
    col22 = col2 = Math.round(Math.random()*4) + 1;

    if (random > 0.5) {
      row22 = row2 + 1;
    } else col22 = col2 + 1;

  } while (field[row2][col2] !== 0 || field[row22][col22] !== 0);

  for (let i = 0; i < 2; i++) {
    if (random > 0.5) {
      field[row2+i][col2] = 2;
      field[row2+i][col2+1] = 4;
      field[row2+i][col2-1] = 4;
      field[row2-1][col2+i-1] = 4;
      field[row2+2][col2+i-1] = 4;
      field[row2-1][col2+i] = 4;
      field[row2+2][col2+i] = 4;
    } else {
      field[row2][col2+i] = 2;
      field[row2+1][col2+i] = 4;
      field[row2-1][col2+i] = 4;
      field[row2+i-1][col2-1] = 4;
      field[row2+i-1][col2+2] = 4;
      field[row2+i][col2-1] = 4;
      field[row2+i][col2+2] = 4;
    }
  }
}

fillField();
placeShip3();
placeShip2();
placeShip2();

for (let i = 0; i < 9; i++) {
  console.log(field[i].join(' '));
}
