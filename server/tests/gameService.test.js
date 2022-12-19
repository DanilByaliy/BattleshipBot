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

const mockField = new Field();
jest.spyOn(mockField, "createRandomField").mockImplementation(() => testField);


class DB {
    save() {}
    get() {}
}

const testGameService = new GameService(mockField, new DB());
const testPlayers = {firstPlayerTag: '@first', secondPlayerTag: '@second'};

describe('GameService class:', () => {
    describe('- The createGameFor method:', () => {
        test('should create new game for two players and return boards', async () => {
            const { boards, currentPlayer, opponentPlayer } = testGameService.createGameFor(testPlayers);
            
            expect(currentPlayer).toBe('@first');
            expect(opponentPlayer).toBe('@second');
            expect(boards['@first']).toEqual([
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 0],
                [0, 0, 0, 1, 0, 0, 0],
                [0, 1, 0, 0, 0, 1, 1],
                [0, 0, 0, 1, 0, 0, 0]
            ])
            expect(boards['@second']).toEqual([
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 0],
                [0, 0, 0, 1, 0, 0, 0],
                [0, 1, 0, 0, 0, 1, 1],
                [0, 0, 0, 1, 0, 0, 0]
            ])
        })
    })
});
