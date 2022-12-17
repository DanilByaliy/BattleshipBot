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
})
