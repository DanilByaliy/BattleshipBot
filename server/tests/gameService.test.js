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
let testGameId;

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

    describe('- The shot method:', () => {

        beforeEach(() => {
            testGameService = new GameService(mockField, new DB());
            const { gameId } = testGameService.createGameFor(testPlayers);
            testGameId = gameId;
        })

        test('should return info about failed shot', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'noShip');

            const shotResult = await testGameService.shot('@first@second', '@first', 'a1');
            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;

            expect(shotStatus).toBe('past');
            expect(message).toBe(`You didn't hit the enemy ship`);
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@second');
            expect(opponentPlayer).toBe('@first');
        })

        test(`should return an error if a player tries to roll when it's not their turn`, async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'noShip');

            await testGameService.shot('@first@second', '@first', 'a1');

            expect(async () => await testGameService.shot('@first@second', '@first', 'a1')).rejects.toThrow('Not your turn')
        })

        test('should return information about the shelling of the three-deck ship when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'threeDeck');

            const shotResult = await testGameService.shot('@first@second', '@first', 'a1');
            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;

            expect(shotStatus).toBe('shelled');
            expect(message).toBe('The ship is shelled');
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })

        test('should return information about the shelling of the two-deck ship when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'firstTwoDeck');

            const shotResult = await testGameService.shot('@first@second', '@first', 'a1');
            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;

            expect(shotStatus).toBe('shelled');
            expect(message).toBe('The ship is shelled');
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })

        test('should return information about the sinking of a one-deck ship when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'oneDeck');

            const shotResult = await testGameService.shot(testGameId, '@first', 'a1');

            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;
            expect(shotStatus).toBe('sunk');
            expect(message).toBe('The ship is sunk');
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })

        test('should return information about the sinking of a two-deck ship when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'firstTwoDeck');

            await testGameService.shot('@first@second', '@first', 'a1');
            const shotResult = await testGameService.shot('@first@second', '@first', 'a2');

            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;
            expect(shotStatus).toBe('sunk');
            expect(message).toBe('The ship is sunk');
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })

        test('should return information about the sinking of a three-deck ship when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'threeDeck');

            await testGameService.shot('@first@second', '@first', 'a1');
            await testGameService.shot('@first@second', '@first', 'a2');
            const shotResult = await testGameService.shot('@first@second', '@first', 'a3');

            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;
            expect(shotStatus).toBe('sunk');
            expect(message).toBe('The ship is sunk');
            expect(isGameOver).toBe(false);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
        })

        test('should return game completion information when it happened', async () => {
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'threeDeck');
            await testGameService.shot('@first@second', '@first', 'a1');
            await testGameService.shot('@first@second', '@first', 'a2');
            await testGameService.shot('@first@second', '@first', 'a3');
    
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'firstTwoDeck');
            await testGameService.shot('@first@second', '@first', 'c1');
            await testGameService.shot('@first@second', '@first', 'c2');
    
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'secondTwoDeck');
            await testGameService.shot('@first@second', '@first', 'e1');
            await testGameService.shot('@first@second', '@first', 'e2');
    
            jest.spyOn(mockField, "getCellContent").mockImplementation((_) => 'oneDeck');
            await testGameService.shot('@first@second', '@first', 'g1');
            await testGameService.shot('@first@second', '@first', 'g3');
    
    
            const shotResult = await testGameService.shot(testGameId, '@first', 'g5');
    

            const { shotStatus, message, isGameOver, currentPlayer, opponentPlayer } = shotResult;
            expect(shotStatus).toBe('sunk');
            expect(message).toBe('The ship is sunk. Game over. You won!');
            expect(isGameOver).toBe(true);
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
            expect(async () => await testGameService.shot('@first@second', '@first', 'g7')).rejects.toThrow('Game Over');
        })
    })
});
