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
}
