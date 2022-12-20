'use strict'

const { GameService, Field} = require('../src/services/gameService');

const testField = [
    [9,  9,   9,   9,   9,   9,   9,   9,  9],
    [9,  0,  '7', '7', '7', '7', '7',  0,  9],
    [9,  0,  '7', '3', '3', '3', '7',  0,  9],
    [9,  0,  '7', '7', '7', '7', '7', '7', 9],
    [9,  0,   0,  '7', '21','7', '11','7', 9],
    [9, '7', '7', '7', '21','7', '7', '7', 9],
    [9, '7', '12','7', '7', '7', '22','22',9],
    [9, '7', '7', '7', '13','7', '7', '7', 9],
    [9,  9,   9,   9,   9,   9,   9,   9,  9]
];

class DB {
    storage = new Map()
    save(state) {
        this.storage.set(state.gameId, state);
    }
    
    async get(gameId) {
        return await this.storage.get(gameId);
    }
    
    delete(gameId) {
        return this.storage.delete(gameId);
    }
}

let testGameService;
const mockField = new Field();
const testPlayers = { firstPlayerTag: '@first', secondPlayerTag: '@second' };

jest.spyOn(mockField, "createRandomField").mockImplementation(() => {});
jest.spyOn(mockField, "set").mockImplementation(() => {});
jest.spyOn(mockField, "getCellContent").mockImplementation(() => {});
jest.spyOn(mockField, "updateField").mockImplementation(() => {});
jest.spyOn(mockField, "getRawField").mockImplementation(() => {});
jest.spyOn(mockField, "getField").mockImplementation(() => {});


describe('GameService class:', () => {
    describe('- The createGameFor method:', () => {

        beforeEach(() => {
            testGameService = new GameService(mockField, new DB());
        })

        test('should create new game for two players and return boards', async () => {
            const { boards, currentPlayer, opponentPlayer } = testGameService.createGameFor(testPlayers);
            
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })
    })
});
