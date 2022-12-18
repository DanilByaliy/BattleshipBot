'use strict'

const { Field } = require('../src/services/gameService');

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
})
