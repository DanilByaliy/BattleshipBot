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
        this.createEnvelope();
        return this.value;
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

    getCellContent(cell) {
        const {x, y} = this.parseCellToCoordinates(cell);
        const receivedCell = this.getCell(x, y);
        switch (receivedCell) {
            case '11':
                return 'oneDeck'
            case '12':
                return 'oneDeck'
            case '13':
                return 'oneDeck'
            case '21':
                return 'firstTwoDeck'
            case '22':
                return 'secondTwoDeck'
            case '3':
                return 'threeDeck'
            default:
                return 'noShip'
        }
    }

    parseCellToCoordinates(cell) {
        const [xLetter, y] = cell.split('');
        const x = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(xLetter);
        return {x, y};
    }
}

class GameService {
    field = new Field();

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

    createGameFor(players) {
        this.clearState();
        this.setPlayers(players);
        this.setRandomFields();
        this.setInitialCharacteristic();
        this.setId();
        this.save();
        return this.state;
    }

    createGameForTest(players) {
        this.clearState();
        this.setPlayers(players);
        this.setConstFields();
        this.setInitialCharacteristic();
        this.setId();
        this.save();
        return this.state;
    }

    clearState() {
        this.state = {
            gameId: '',
            currentPlayer: '',
            opponentPlayer: '',
            gameOver: false,
            lastMessage: '',
            lastShotStatus: null,
        };
    }

    setPlayers(players) {
        const { firstPlayerTag, secondPlayerTag } = players;
        this.state.currentPlayer = firstPlayerTag;
        this.state.opponentPlayer = secondPlayerTag;
    }

    setRandomFields() {
        const firstPlayerTag = this.state.currentPlayer;
        const secondPlayerTag = this.state.opponentPlayer;
    
        this.state[firstPlayerTag] = {}
        this.state[firstPlayerTag] = {}
    
        this.state[firstPlayerTag].field = this.field.createRandomField();
        this.state[secondPlayerTag].field = this.field.createRandomField();
    }

    setConstFields() {
        const firstPlayerTag = this.state.currentPlayer;
        const secondPlayerTag = this.state.opponentPlayer;
    
        this.state[firstPlayerTag] = {field: this.field.getConstField()}
        this.state[secondPlayerTag] = {field: this.field.getConstField()}
    }

    setInitialCharacteristic() {
        this.state[this.state.currentPlayer].shipDesks = {
            all: 10,
            threeDeck: 3,
            firstTwoDeck: 2,
            secondTwoDeck: 2,
        };
        
        this.state[this.state.opponentPlayer].shipDesks = {
            all: 10,
            threeDeck: 3,
            firstTwoDeck: 2,
            secondTwoDeck: 2,
        };
    }
    
    setId() {
        this.state.gameId = this.state.currentPlayer + this.state.opponentPlayer;
    }
    
    save() {
        this.db.save(this.state);
    }

    async shot(gameId, player, cell) {
        this.setStateFor(gameId);
        if (this.checkIsGameOver()) throw new Error('Game Over');
        if (!this.checkIsCurrentPlayer(player)) throw new Error('Not your turn');
    
        const opponent = this.state.opponentPlayer
    
        this.field.parse(this.state[opponent].field);
        this.field.showRaw();
        const cellContent = this.field.getCellContent(cell);
        const shotStatus = this.getShotStatus(cellContent);
        this.state.lastShotStatus = shotStatus;
    
        this.updateField(cell, shotStatus);
    
        this.state.lastMessage = this.getMessageByStatus(shotStatus);
        
        if (this.isSuccessShot(shotStatus)) {
            this.updateGameCharacteristic(opponent, cellContent);
        } else this.changeCurrentPlayer();
    
        if (this.checkIsOpponentHaveShips()) this.gameOver()
        this.save();
    }

    getGameboardsFor(gameId) {
        this.setStateFor(gameId);
        const currentPlayer = this.state.currentPlayer;
        const opponentPlayer = this.state.opponentPlayer;
    
        const currentPlayerRawField = this.state[this.state.currentPlayer].field;
        const opponentPlayerRawField = this.state[this.state.opponentPlayer].field;
    
        this.field.parse(currentPlayerRawField);
        const currentPlayerField = this.field.getField();
    
        this.field.parse(opponentPlayerRawField);
        const opponentPlayerField = this.field.getField();
    
        return {
            [currentPlayer]: currentPlayerField,
            [opponentPlayer]: opponentPlayerField
        }
    }

    getCurrentPlayer(gameId) {
        this.setStateFor(gameId);
        return this.state.currentPlayer;
    }

    getShotStatus(cellContent) {
        if (!this.isShip(cellContent)) return 'past';
        if (this.hasShipSunk(cellContent)) return 'sunk';
        else return 'shelled';
    }

    isShip(cellContent) {
        return ['oneDeck', 'firstTwoDeck', 'secondTwoDeck', 'threeDeck']
        .includes(cellContent);
    }

    hasShipSunk(typeOfShip) {
        const opponent = this.state.opponentPlayer;
        if (typeOfShip === 'oneDeck') return true
        const numberOfDeck = this.state[opponent].shipDecks[typeOfShip]
        console.log(typeOfShip);
        console.log('num of deck:' + numberOfDeck);
        return numberOfDeck === 1;
    }

    getMessageByStatus(status) {
        switch (status) {
            case 'sunk':
                return 'The ship is sunk';
            case 'shelled':
                return 'The ship is shelled';
            case 'past':
                return `You didn't hit the enemy ship`;
        }
    }

    async getLastMessage(gameId) {
        console.log(gameId);
        await this.setStateFor(gameId);
        return this.state.lastMessage;
    }

    checkIsCurrentPlayer(player) {
        return this.state.currentPlayer === player;
    }
    
    isSuccessShot(shotStatus) {
        return shotStatus !== 'past';
    }

    updateGameCharacteristic(player, ship) {
        this.state[player].shipDecks[ship] -= 1;
        this.state[player].shipDecks.all -= 1;
    }

    checkIsOpponentHaveShips() {
        const opponent = this.state.opponentPlayer;
        return this.state[opponent].shipDecks.all === 0;
    }

    updateField(cell, shotStatus) {
        this.field.updateField(cell, shotStatus);
        this.state[this.state.opponentPlayer].field = this.field.getRawField();
    }

    checkIsGameOver() {
        return this.state.gameOver;
    }

    gameOver() {
        this.state.gameOver = true;
    }

    changeCurrentPlayer() {
        const currentPlayer = this.state.currentPlayer;
        const opponentPlayer = this.state.opponentPlayer
        this.state.currentPlayer = opponentPlayer;
        this.state.opponentPlayer = currentPlayer;
    }

    async getGameState(id) {
        const state = await this.db.get(id);
        if (!state) throw new Error('State with the specified ID does not exist');
        return state;
    }

    async setStateFor(id) {
        this.state = await this.getGameState(id);
    }

    getGameboardsFor(gameId) {
        this.setStateFor(gameId);
        const currentPlayer = this.state.currentPlayer;
        const opponentPlayer = this.state.opponentPlayer;
    
        const currentPlayerRawField = this.state[currentPlayer].field;
        const opponentPlayerRawField = this.state[opponentPlayer].field;
    
        this.field.parse(currentPlayerRawField);
        const currentPlayerField = this.field.getField();
    
        this.field.parse(opponentPlayerRawField);
        const opponentPlayerField = this.field.getField();
    
        return {
            [currentPlayer]: currentPlayerField,
            [opponentPlayer]: opponentPlayerField
        }
    }

    async deleteGameById(id) {
        await this.db.delete(id);
    }
}

module.exports = {
    GameService,
    gameService: new GameService(gameDAO)
};