import { Object } from "./Object.js";

export class Stone extends Object {
    /** @param {HTMLCanvasElement} canvas */
    constructor({ number = 1, color = 'red', width = 100, height = 130, ...kwargs }) {
        super({ type:'stone', width, height, ...kwargs });
        this.number = number;
        this.color = color;
    }
    draw() {
        super.draw();

        this.ctx.beginPath();
        this.ctx.arc(
            this.screenBounds.x + this.screenBounds.width / 2,
            this.screenBounds.y + this.screenBounds.height / 2 + 35 * this.canvas.panel.ratioHeight,
            10 * this.canvas.panel.ratioWidth, // radius
            0, 2 * Math.PI);
        this.ctx.lineWidth = 3 * this.canvas.panel.ratioWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(
            this.screenBounds.x + this.screenBounds.width / 2,
            this.screenBounds.y + this.screenBounds.height / 2 + 35 * this.canvas.panel.ratioHeight,
            4 * this.canvas.panel.ratioWidth, // radius
            0, 2 * Math.PI);
        this.ctx.lineWidth = 3 * this.canvas.panel.ratioWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();

        this.ctx.fillStyle = 'black';
        var FONTSIZE = 80;
        this.ctx.font = (this.canvas.panel.ratioHeight * FONTSIZE) + "px 'Fira Code'"
        this.ctx.fillText(this.number,
            this.screenBounds.x + this.screenBounds.width / 2 - (this.number.toString().length * FONTSIZE * 11 / 36 * this.canvas.panel.ratioWidth),
            this.screenBounds.y + this.screenBounds.height / 2 + (FONTSIZE * 2 / 36 * this.canvas.panel.ratioHeight),
        );

        this.ctx.fillStyle = this.color;
        var FONTSIZE = 72;
        this.ctx.font = (this.canvas.panel.ratioHeight * FONTSIZE) + "px 'Fira Code'"
        this.ctx.fillText(this.number,
            this.screenBounds.x + this.screenBounds.width / 2 - (this.number.toString().length * FONTSIZE * 11 / 36 * this.canvas.panel.ratioWidth),
            this.screenBounds.y + this.screenBounds.height / 2,
        );
    }
}