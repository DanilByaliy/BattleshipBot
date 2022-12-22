'use strict'

const fs = require('fs');

class DrawingService {
    db
    font

    constructor(db, font) {
        this.font = font;
        this.db = db;
    }

    async createBoardFor(player, board) {
        const boardSettings = this.#newBoard();
        const boardInfo = {
            ...boardSettings,
            player: player
        }
        this.db.save(boardInfo);

        this.drawingGameField(1);
        this.drawingGameField(2);
        this.drawingAllShips(board);
        await this.makeFile();
    }

    #newBoard() {
        const img = PImage.make(4800, 2400);
        const ctx = img.getContext('2d');
        ctx.strokeStyle = 'black';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 15;
        return {
            img: img,
            ctx: ctx,
        };
    }
}
