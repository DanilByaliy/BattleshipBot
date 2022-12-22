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

    drawingGameField(n, ctx) {
        ctx.fillRect(2400 * (n - 1) + 130, 130, 2140, 2140);
        ctx.clearRect(2400 * (n - 1) + 150, 150, 2100, 2100);
        this.drawAxes();
      
        for (let i = 1; i < 7; i++) {
            this.drawVerticalLines(ctx, i, n - 1);
            this.drawHorisontalLines(ctx, i, n - 1);
        }
    }

    drawAxes(n, ctx) {
        font.load(() => {
            this.drawLetters(n, ctx);
            this.drawNumbers(n, ctx);
        });
    }
      
    drawLetters(n, ctx) {    
        for (let i = 0; i < 7; i++) {
            ctx.fillStyle = '#000000';
            ctx.font = '120pt MyFont';
            ctx.fillText('abcdefg'[i], 2400 * n + 270 + 300 * i, 95);
        }
    }

    drawNumbers(n, ctx) {
        for (let i = 0; i < 7; i++) {
            ctx.fillStyle = '#000000';
            ctx.font = '120pt MyFont';
            ctx.fillText((i + 1).toString(), 2400 * n + 30, 330 + 300 * i);
        }
    }

    drawVerticalLines(ctx, i, n) {
        ctx.beginPath();
        ctx.moveTo(2400 * n + 150 + 300 * i, 2250);
        ctx.lineTo(2400 * n + 150 + 300 * i, 150);
        ctx.lineTo(2400 * n + 165 + 300 * i, 2250);
        ctx.stroke();
        ctx.closePath();
    }

    drawHorisontalLines(ctx, i, n) {
        ctx.beginPath();
        ctx.moveTo(2400 * n + 2250, 150 + 300 * i);
        ctx.lineTo(2400 * n + 150, 150 + 300 * i);
        ctx.lineTo(2400 * n + 2250, 165 + 300 * i);
        ctx.stroke();
        ctx.closePath();
    }
}
