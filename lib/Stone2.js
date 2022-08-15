import { Obj } from "./Object2.js";

export class Stone extends Obj {
    static width = 100;
    static height = 140;
    static roundRadius = 10;
    constructor({ number = 1, color = 'red', width = Stone.width, height = Stone.height, targetPlaceholderIndex, ...kwargs }) {
        super({ type: 'stone', width, height, roundRadius: Stone.roundRadius, ...kwargs });
        this.number = number;
        this.color = color;
        this.targetPlaceholderIndex = targetPlaceholderIndex;
    }
    draw() {
        super.draw();

        // this.ctx.beginPath();
        // this.ctx.arc(
        //     this.centerX,
        //     this.centerY + 35,
        //     10, // radius
        //     0, 2 * Math.PI);
        // this.ctx.lineWidth = 3;
        // this.ctx.strokeStyle = this.color;
        // this.ctx.stroke();

        // this.ctx.beginPath();
        // this.ctx.arc(
        //     this.centerX,
        //     this.centerY + 35,
        //     4, // radius
        //     0, 2 * Math.PI);
        // this.ctx.lineWidth = 3;
        // this.ctx.strokeStyle = this.color;
        // this.ctx.stroke();

        this.ctx.textAlign = 'center';

        if (this.ctx.strokeStyle == this.color)
            this.ctx.strokeStyle = 'white';
        this.ctx.font = "72px 'Fira Code'"
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeText(this.number,
            this.centerX,
            this.centerY,
        );
        this.ctx.fillStyle = this.color;
        this.ctx.fillText(this.number,
            this.centerX,
            this.centerY,
        );

        this.ctx.font = "32px 'Fira Code'"
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeText('○',
            this.centerX,
            this.centerY+44,
        );
        this.ctx.fillStyle = this.color;
        this.ctx.fillText('○',
            this.centerX,
            this.centerY+44,
        );
    }
}