'use strict'

const gameDAO = require('../dao/gameDAO');

class Field {
    value
    field
    changesField
    neighborCells = [[-1, -1], [-1, 0], [-1, 1], 
        [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]

    createRandomField() {
        this.setInitialField();
        this.placeThreeDeckShip();
        this.placeTwoDeckShips();
        this.placeOneDeckShips();
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

    createEnvelope() {
        for (let i = 0; i < 9; i++) {
            this.value[0][i] = 9;
            this.value[8][i] = 9;
            this.value[i][0] = 9;
            this.value[i][8] = 9;
        }
    }

    placeThreeDeckShip() {
        const row = Math.round(Math.random() * 4) + 1;
        const col = Math.round(Math.random() * 4) + 1;
        const random = Math.random() > 0.5;
    
        if (random) this.placeThreeDeckShipVerticallyFrom(row, col);
        else this.placeThreeDeckShipHorisontallyFrom(row, col);

        this.makeWrapOf('3', '7');
    }

    placeThreeDeckShipVerticallyFrom(row, col) {
        for (let i = 0; i < 3; i++) {
            this.value[row + i][col] = '3';
        }
    }
    
    placeThreeDeckShipHorisontallyFrom(row, col) {
        for (let i = 0; i < 3; i++) {
            this.value[row][col + i] = '3';
        }
    }

    placeTwoDeckShips() {
        for (let i = 0; i < 2; i++) {
            this.placeTwoDeckShip(i);
        }
    }

    placeOneDeckShips() {
        for (let i = 0; i < 3; i++) {
            this.placeOneDeckShip(i);
        }
    }


    placeTwoDeckShip(n = 1) {
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
    
    placeOneDeckShip(n = 1) {
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
        const [xLetter, yLetter] = cell.split('');
        const x = [null, 'a', 'b', 'c', 'd', 'e', 'f', 'g'].indexOf(xLetter);
        const y = Number(yLetter);
        return {x, y};
    }

    getCell(x, y) {
        return this.value[x][y];
    }

    updateField(cell, status) {
        this.normalizeField();
        const {x, y} = this.parseCellToCoordinates(cell);
    
        switch (status) {
            case 'sunk':
                this.value[x][y] += '0';
                const sunkShip = this.getCell(x, y);
                this.makeWrapOf(sunkShip, '68');
                this.value[x][y] += '8';
                break;
            case 'shelled':
                this.value[x][y] += '08';
                break;
            case 'past':
                this.value[x][y] = '68';
                break;
        }
    }

    normalizeField() {
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.isJustShelledShip(x, y) || this.isJustFiredCell(x, y)) {
                    this.value[x][y] = this.value[x][y].slice(0, -1);
                }
            }
        }
    }

    set(field) {
        this.setInitialField();
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.value[x][y] = field[x][y];
            }
        }
    }

    getRawField() {
        return this.value;
    }

    getField() {
        this.field = this.createEmptyFieldSizeOf(7);
        for (let x = 1; x < 8; x++) {
            for (let y = 1; y < 8; y++) {
                this.normalizeCell(x, y);
            }
        }
        return this.field;
    }

    normalizeCell(x, y) {
        if (this.isEmptyCell(x, y)) this.markCellAsEmpty(x, y);
        else if (this.isShipInCell(x, y)) this.markCellAsShip(x, y);
        else if (this.isShelledShip(x, y)) this.markСellAsShelledShip(x, y);
        else if (this.isFiredCell(x, y)) this.markCellAsFiredCell(x, y);
    }

    isEmptyCell(x, y) {
        return ['7', 0].includes(this.value[x][y]);
    }

    markCellAsEmpty(x, y) {
        this.field[x-1][y-1] = 0;
    }

    isShipInCell(x, y) {
        return ['11', '12', '13', '21', '22', '3']
        .includes(this.value[x][y]);
    }

    markCellAsShip(x, y) {
        this.field[x-1][y-1] = 1;
    }

    isShelledShip(x, y) {
        return ['110', '120', '130', '210', '220', '30', '1108', '1208', '1308', '2108', '2208', '308']
        .includes(this.value[x][y]);
    }

    markСellAsShelledShip(x, y) {
        this.field[x-1][y-1] = -1;
    }

    isFiredCell(x, y) {
        return ['6', '68']
        .includes(this.value[x][y]);
    }

    markCellAsFiredCell(x, y) {
        this.field[x-1][y-1] = 2;
    }

    getChangesField() {
        this.changesField = this.createEmptyFieldSizeOf(7);
        for (let x = 1; x < 8; x++) {
            for (let y = 1; y < 8; y++) {
                this.normalizeCellIfItHasJustBeenChanged(x, y);
            }
        }
        return this.changesField;
    }

    normalizeCellIfItHasJustBeenChanged(x, y) {
        if (this.isJustFiredCell(x, y)) {
            this.markCellAsJustFiredCell(x, y);
        }
        else if (this.isJustShelledShip(x, y)) {
            this.markСellAsJustShelledShip(x, y);
        }
    }

    isJustFiredCell(x, y) {
        return this.value[x][y] === '68';
    }

    markCellAsJustFiredCell(x, y) {
        this.changesField[x-1][y-1] = 2;
    }

    isJustShelledShip(x, y) {
        return ['1108', '1208', '1308', '2108', '2208', '308']
        .includes(this.value[x][y]);
    }

    markСellAsJustShelledShip(x, y) {
        this.changesField[x-1][y-1] = -1;
    }
}

class GameService {
    state = {
        gameId: '',
        currentPlayer: '',
        opponentPlayer: '',
        gameOver: false,
        lastMessage: '',
        lastShotStatus: null,
    };

    constructor(field, db) {
        this.field = field;
        this.db = db;
    }

    createGameFor(players) {
        this.clearState();
        this.setPlayers(players);
        this.setRandomFields();
        this.setInitialCharacteristic();
        this.setId();
        this.save();
        return this.getCurrentGameInfo();
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
    
        this.state[firstPlayerTag] = {};
        this.state[secondPlayerTag] = {};
    
        this.state[firstPlayerTag].field = this.field.createRandomField();
        this.state[secondPlayerTag].field = this.field.createRandomField();
    }

    setInitialCharacteristic() {
        this.state[this.state.currentPlayer].shipDecks = {
            all: 10,
            threeDeck: 3,
            firstTwoDeck: 2,
            secondTwoDeck: 2,
        };
        
        this.state[this.state.opponentPlayer].shipDecks = {
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

        this.setFieldForOpponentPlayer();
        this.setCellContent(cell);
        this.setShotStatusByCell();
        this.updateField(cell);
       
        if (this.isUnsuccessfulShot()) this.changeCurrentPlayer();
        else this.updateGameCharacteristic();
    
        if (this.checkIsOpponentHaveShips()) this.gameOver();

        await this.save();
        return this.getGameInfoAfterShot();
    }

    async setStateFor(id) {
        this.state = await this.getGameState(id);
    }

    async getGameState(id) {
        const state = await this.db.get(id);
        if (!state) throw new Error('State with the specified ID does not exist');
        return state;
    }

    checkIsGameOver() {
        return this.state.gameOver;
    }

    checkIsCurrentPlayer(player) {
        return this.state.currentPlayer === player;
    }

    setFieldForOpponentPlayer() {
        const opponent = this.state.opponentPlayer;
        const opponentField = this.state[opponent].field;
        this.field.set(opponentField);
    }

    setCellContent(cell) {
        this.cellContent = this.field.getCellContent(cell);
    }

    setShotStatusByCell() {
        const cellContent = this.cellContent;
        const shotStatus = this.getShotStatus(cellContent);
        this.state.lastShotStatus = shotStatus;
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
        if (typeOfShip === 'oneDeck') return true;
        const numberOfDeck = this.state[opponent].shipDecks[typeOfShip];
        return numberOfDeck === 1;
    }

    updateField(cell) {
        const shotStatus = this.state.lastShotStatus;
        this.field.updateField(cell, shotStatus);
        this.state[this.state.opponentPlayer].field = this.field.getRawField();
    }

    isUnsuccessfulShot() {
        const shotStatus = this.state.lastShotStatus;
        return shotStatus === 'past';
    }

    updateGameCharacteristic() {
        const ship = this.cellContent;
        const player = this.state.opponentPlayer;
        this.state[player].shipDecks[ship] -= 1;
        this.state[player].shipDecks.all -= 1;
    }

    changeCurrentPlayer() {
        const currentPlayer = this.state.currentPlayer;
        const opponentPlayer = this.state.opponentPlayer
        this.state.currentPlayer = opponentPlayer;
        this.state.opponentPlayer = currentPlayer;
    }

    checkIsOpponentHaveShips() {
        const opponent = this.state.opponentPlayer;
        return this.state[opponent].shipDecks.all === 0;
    }

    gameOver() {
        this.state.gameOver = true;
    }

    getGameInfoAfterShot() {
        const gameInfo = this.getCurrentGameInfo();
        const shotStatus = this.state.lastShotStatus;
        const isGameOver = this.state.gameOver;
        const message = this.getMessageByStatus();
        return {
            ...gameInfo,
            shotStatus: shotStatus,
            isGameOver: isGameOver,
            message: message,
        }
    }

    getCurrentGameInfo() {
        const gameId = this.state.gameId;
        const currentPlayer = this.state.currentPlayer;
        const opponentPlayer = this.state.opponentPlayer;
    
        const currentPlayerRawField = this.state[currentPlayer].field;
        const opponentPlayerRawField = this.state[opponentPlayer].field;
    
        this.field.set(currentPlayerRawField);
        const currentPlayerField = this.field.getField();
    
        this.field.set(opponentPlayerRawField);
        const opponentPlayerField = this.field.getField();

        let changes = {};
        
        if (this.isUnsuccessfulShot()) {
            this.field.set(currentPlayerRawField);
            changes.board = this.field.getChangesField();
            changes.currentPlayer = currentPlayer;
            changes.opponentPlayer = opponentPlayer;
        } else {
            this.field.set(opponentPlayerRawField);
            changes.board = this.field.getChangesField();
            changes.currentPlayer = opponentPlayer;
            changes.opponentPlayer = currentPlayer;
        }

        return {
            gameId: gameId,
            currentPlayer: currentPlayer,
            opponentPlayer: opponentPlayer,
            boards: {
                [currentPlayer]: currentPlayerField,
                [opponentPlayer]: opponentPlayerField
            },
            changes: changes
        }
    }

    getMessageByStatus() {
        const status = this.state.lastShotStatus;
        let message = '';
        switch (status) {
            case 'sunk':
                message = 'The ship is sunk';
                break;
            case 'shelled':
                message = 'The ship is shelled';
                break;
            case 'past':
                message = `You didn't hit the enemy ship`;
                break;
        }
        if (this.state.gameOver) message += '. Game over. You won!'
        return message;
    }

    async deleteGameById(id) {
        await this.db.delete(id);
    }
}

const field = new Field();

module.exports = {
    Field,
    GameService,
    gameService: new GameService(field, gameDAO)
};