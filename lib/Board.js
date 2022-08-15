import { isPointInsideBox, roundRect } from "../lib.js";
import { Stone } from "./Stone2.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
export class Board {
    static padding = 20;
    static margin = 40;

    static maxStonesHorizontal = 13;
    static lines = 2;

    static width = Stone.width * Board.maxStonesHorizontal + 2 * Board.padding;
    static height = Board.lines * Stone.height + 2 * Board.padding;

    static x = -Board.width / 2;
    static y = canvas.height / 2 - Board.height - Board.margin;

    static bgColor = '#aaa';
    static placeholderColor = '#00000050';
    static placeHolders = [];
    static placeHoldersLoaded = false;

    constructor() {
        Board.y = canvas.height / 2 - Board.height - Board.margin;


        canvas.addEventListener('mousedown', e => {
            let phIndex = Board.placeHolders.flat().findIndex(ph => isPointInsideBox(canvas.screenToWorldPoint(e), ph))
            let ph = Board.getPlaceholder(phIndex);
            if (ph) {
                console.log( phIndex, ph);
            }
            
        });
    }

    static getPlaceholder(phIndex = 0) {
        return Board.placeHolders.flat()[phIndex];
    }

    draw() {
        ctx.fillStyle = Board.bgColor;
        roundRect(Board.x, Board.y, Board.width, Board.height, 10, true);

        ctx.strokeStyle = Board.placeholderColor;
        for (let j = 0; j < Board.lines; j++) {
            if (!Board.placeHolders[j])
                Board.placeHolders[j] = [];
            for (let i = 0; i < 13; i++) {
                Board.placeHolders[j][i] = {
                    x: Board.x + Board.padding + i * Stone.width,
                    y: Board.y + Board.padding + j * Stone.height,
                    width: Stone.width,
                    height: Stone.height,
                    roundRadius: Stone.roundRadius,
                }
                roundRect(...Object.values(Board.placeHolders[j][i]))
            }
        }

        if (Board.placeHoldersLoaded != true) {
            Board.placeHoldersLoaded = true;
            console.log('Placeholders loaded.')
            Stone.allObjects.filter(o => !isNaN(o.targetPlaceholderIndex)).forEach(o => {
                let targetPlaceholder = Board.getPlaceholder(o.targetPlaceholderIndex);
                o.setTarget(targetPlaceholder);
            })
        }

    }
}