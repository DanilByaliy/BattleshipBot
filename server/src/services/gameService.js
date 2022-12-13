'use strict'

class Field {
    value

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
}
