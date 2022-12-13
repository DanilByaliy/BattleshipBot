'use strict'

const gameDAO = require('../dao/gameDAO');

class Field {
    value
    neighborCells = [[-1, -1], [-1, 0], [-1, 1], 
        [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

    createRandomField() {
        this.setInitialField()
        this.placeThreeDeskShip();
        this.placeTwoDeskShips();
        this.placeOneDeskShips();
    }

    setInitialField() {
        const field = this.createEmptyFieldSizeOf(9);
        this.value = field;
        this.createEnvelope();
    }

    createEmptyFieldSizeOf(size) {
        let field = [];
        for (let i = 0; i < size; i++) {
            const row = new Array(size);
            row.fill(0);
            field.push(row);
        }
        return field;
    }

    placeTwoDeskShips() {
        for (let i = 0; i < 2; i++) {
            this.placeTwoDeskShip(i);
        }
    }

    placeOneDeskShips() {
        for (let i = 0; i < 3; i++) {
            this.placeOneDeskShip(i);
        }
    }

    createEnvelope() {
        for (let i = 0; i < 9; i++) {
            this.value[0][i] = 9;
            this.value[8][i] = 9;
            this.value[i][0] = 9;
            this.value[i][8] = 9;
        }
    }

    placeThreeDeskShip() {
        const row = Math.round(Math.random() * 4) + 1;
        const col = Math.round(Math.random() * 4) + 1;
        const random = Math.random() > 0.5;
    
        if (random) this.placeThreeDeskShipVerticallyFrom(row, col);
        else this.placeThreeDeskShipHorisontallyFrom(row, col);

        this.makeWrapOf('3', '7');
    }
    
    placeThreeDeskShipHorisontallyFrom(row, col) {
        for (let i = 0; i < 3; i++) {
            this.value[row + i][col] = '3';
        }
    }
    
    placeThreeDeskShipVerticallyFrom(row, col) {
        for (let i = 0; i < 3; i++) {
            this.value[row][col + i] = '3';
        }
    }

    placeTwoDeskShip(n) {
        let row2, col2, row22, col22;
        const random = Math.random() > 0.5;
      
        do {
            row22 = row2 = Math.round(Math.random() * 6) + 1;
            col22 = col2 = Math.round(Math.random() * 6) + 1;
    
            if (random) {
                row22 = row2 + 1;
            } else col22 = col2 + 1;
    
        } while (this.value[row2][col2] !== 0 || this.value[row22][col22] !== 0);
    
        this.value[row2][col2] = `2${n + 1}`;
        this.value[row22][col22] = `2${n + 1}`;
        this.makeWrapOf(`2${n + 1}`, '7');
    }
    
    placeOneDeskShip(n) {
        let row, col = 0;
    
        do {
            row = Math.round(Math.random() * 6) + 1;
            col = Math.round(Math.random() * 6) + 1;
        } while (this.value[row][col] !== 0);
      
        this.value[row][col] = `1${n + 1}`;
        this.makeWrapOf(`1${n + 1}`, '7');
    }

    makeWrapOf(ship, wrapCell) {
        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 9; y++) {
            if (this.value[x][y] === ship) {
              this.neighborCells.forEach((val) => {
                const [a, b] = val;
    
                if (this.value[x + a][y + b] !== ship) {
                  this.value[x + a][y + b] = wrapCell;
                }
              })
            }
          }
        }
      }
}

class GameService {
    field = new Field();

    startShipDesks = {
        all: 10,
        threeDeck: 3,
        firstTwoDeck: 2,
        secondTwoDeck: 2,
    };
    
    state = {
        gameId: '',
        currentPlayer: '',
        opponentPlayer: '',
        gameOver: false,
        lastShotResult: null,
    };

    constructor(db) {
        this.db = db;
    }
}

module.exports = {
    GameService,
    gameService: new GameService(gameDAO)
};