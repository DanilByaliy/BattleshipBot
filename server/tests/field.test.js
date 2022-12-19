'use strict'

const { Field } = require('../src/services/gameService');

const getNumberOfDeck = (gameBoard) => {
    let numberOfDeck = 0;
    for (let row of gameBoard) {
        for (let cell of row) {
            if (cell === 1) numberOfDeck++;
        }
    }
    return numberOfDeck;
}

const testField = [
    //   1   2   3   4   5   6   7
    [9,  9,  9,  9,  9,  9,  9,  9,  9],
    [9,'11', 0,  0,  0,  0,  0,'21', 9], // a
    [9,  0,  0,'12', 0,  0,  0,'21', 9], // b
    [9,  0,  0,  0,  0,  0,  0,  0,  9], // c
    [9,  0,  0,  0,  0,  0,  0,  0,  9], // d
    [9,  0,  0,  0,  0,  0,  0,  0,  9], // e
    [9,  0,  0,  0,  0,'22','22',0,  9], // f
    [9,  0,'13', 0,  0,  0,  0,  0,  9], // g
    [9,  9,  9,  9,  9,  9,  9,  9,  9],
]

describe('Field class:', () => {
    test('The createEmptyFieldSizeOf function should create an empty field of the given size', () => {
        const field = new Field();

        const emptyFieldSizeOf2 = field.createEmptyFieldSizeOf(2);
        const emptyFieldSizeOf7 = field.createEmptyFieldSizeOf(7);

        expect(emptyFieldSizeOf2).toEqual([
            [0, 0],
            [0, 0]
        ]);
        expect(emptyFieldSizeOf7).toEqual([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]);
    })

    test('The setInitialField function should create and save the initial field', () => {
        const field = new Field();
        
        field.setInitialField();
        const resultField = field.getField();

        expect(resultField).toEqual([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]);
    })

    test('The parseCellToCoordinates function should parse the cell name into its coordinates', () => {
        const field = new Field();

        const coordinateB1 = field.parseCellToCoordinates('b1');
        const coordinateC4 = field.parseCellToCoordinates('c4');
        const coordinateG7 = field.parseCellToCoordinates('g7');

        expect(coordinateB1).toEqual({x: 2, y: 1});
        expect(coordinateC4).toEqual({x: 3, y: 4});
        expect(coordinateG7).toEqual({x: 7, y: 7});
    })

    test(`The placeThreeDeskShipHorizontallyFrom function should place a ship 
            with three decks horizontally from the specified coordinate`, () => {
        const field = new Field();
        field.setInitialField();

        field.placeThreeDeskShipHorisontallyFrom(2, 3);
        const contentOfCellB3 = field.getCellContent('b3');
        const contentOfCellB4 = field.getCellContent('b4');
        const contentOfCellB5 = field.getCellContent('b5');
        const gameBoard = field.getField();

        expect(contentOfCellB3).toEqual('threeDeck');
        expect(contentOfCellB4).toEqual('threeDeck');
        expect(contentOfCellB5).toEqual('threeDeck');
        expect(gameBoard).toEqual([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]);
    })

    test(`The placeThreeDeskShipVerticallyFrom function should place a ship 
            with three decks vertically from the specified coordinate`, () => {
        const field = new Field();

        field.setInitialField();
        field.placeThreeDeskShipVerticallyFrom(2, 3);
        const contentOfCellB3 = field.getCellContent('b3');
        const contentOfCellC3 = field.getCellContent('c3');
        const contentOfCellD3 = field.getCellContent('d3');
        const gameBoard = field.getField();

        expect(contentOfCellB3).toEqual('threeDeck');
        expect(contentOfCellC3).toEqual('threeDeck');
        expect(contentOfCellD3).toEqual('threeDeck');
        expect(gameBoard).toEqual([
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ]);
    })

    test('The placeOneDeskShip function should place one deck on the field', () => {
        const field = new Field();
        field.setInitialField();

        field.placeOneDeskShip();
        const gameBoard = field.getField();

        expect(getNumberOfDeck(gameBoard)).toEqual(1);
    })

    test('The placeTwoDeskShip function should place two deck on the field', () => {
        const field = new Field();
        field.setInitialField();

        field.placeTwoDeskShip();
        const gameBoard = field.getField();

        expect(getNumberOfDeck(gameBoard)).toEqual(2);
    })

    test('The createRandomField function should place ten deck on the field', () => {
        const field = new Field();
        field.setInitialField();

        field.createRandomField();
        const gameBoard = field.getField();

        expect(getNumberOfDeck(gameBoard)).toEqual(10);
    })

    test('The getCellContent function should return type of ship', () => {
        const field = new Field();
        field.setInitialField();
        field.set(testField);

        const contentOfCellA1 = field.getCellContent('a1');
        const contentOfCellB3 = field.getCellContent('b3');
        const contentOfCellG2 = field.getCellContent('g2');
        const contentOfCellA7 = field.getCellContent('a7');
        const contentOfCellB7 = field.getCellContent('b7');
        const contentOfCellF5 = field.getCellContent('f5');
        const contentOfCellF6 = field.getCellContent('f6');


        const gameBoard = field.getField();
        expect(contentOfCellA1).toEqual('oneDeck');
        expect(contentOfCellB3).toEqual('oneDeck');
        expect(contentOfCellG2).toEqual('oneDeck');
        expect(contentOfCellA7).toEqual('firstTwoDeck');
        expect(contentOfCellB7).toEqual('firstTwoDeck');
        expect(contentOfCellF5).toEqual('secondTwoDeck');
        expect(contentOfCellF6).toEqual('secondTwoDeck');
        expect(gameBoard).toEqual([
            [1, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 1],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0],
        ]);
    })

    describe('- The updateField method:', () => {
        test('should update the field after a failed shot', () => {
            const field = new Field();
            field.setInitialField();

            field.updateField('a1', 'past');
            field.updateField('b3', 'past');
            field.updateField('c7', 'past');
            field.updateField('d4', 'past');
            field.updateField('g6', 'past');
            const gameBoard = field.getField();

            expect(gameBoard).toEqual([
                [2, 0, 0, 0, 0, 0, 0],
                [0, 0, 2, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 2, 0],
            ]);
        })

        test('should update field after shelling the three-deck ship', () => {
            const field = new Field();
            field.setInitialField();
            field.placeThreeDeskShipHorisontallyFrom(2, 3);
            
            field.updateField('b3', 'shelled');
            const contentOfCellB3 = field.getCellContent('b3');
            const gameBoard = field.getField();
    
            expect(contentOfCellB3).toEqual('noShip');
            expect(gameBoard).toEqual([
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, -1, 1, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
            ]);
        })
    })
})
