import { isPointInsideBox } from "../lib.js";

export class Object {
    static allObjects = [];
    /** @param {{canvas:HTMLCanvasElement}}*/
    constructor({ type = 'object', canvas, x = 0, y = 0, width = 100, height = 100, bgColor = 'white', draggable = true, debugInfo = false }) {
        this.type = type;
        this.id = Object.allObjects.length;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.position = { x, y };
        this.size = { width, height };
        this.bgColor = bgColor;
        this.events = {}
        this.draggable = draggable;
        this.isDragged = false;
        this.dragOffset = { x: 0, y: 0 };
        this.isPointInsideBox = false;
        this.debugInfo = debugInfo;

        document.addEventListener('mousedown', e => {
            if (!this.isPointInsideBox) return;

            let clickedObjects = Object.allObjects.filter(o => o.isPointInsideBox);
            console.log(clickedObjects.length)
            if (clickedObjects[clickedObjects.length - 1] != this) return;

            Object.allObjects.splice(Object.allObjects.findIndex(o => o == this), 1);
            Object.allObjects.push(this);
            this.isDragged = true;
            this.dragOffset = { x: this.screenBounds.x - e.x, y: this.screenBounds.y - e.y };

        });
        document.addEventListener('mouseup', e => {
            this.isDragged = false;
            this.dragOffset = { x: 0, y: 0 };
        });
        document.addEventListener('mousemove', e => {
            this.isPointInsideBox = isPointInsideBox(e, this.screenBounds);
            if (this.isDragged)
                this.setScreenPosition(e, this.dragOffset);
        });

        Object.allObjects.push(this);
    }
    on(eventType, cb = () => { }) {
        if (this.events[eventType])
            document.removeEventListener(eventType, this.events[eventType]);
        this.events[eventType] = cb;
        document.addEventListener(eventType, (...args) => {
            if (isPointInsideBox(args[0], this.screenBounds)) {
                console.log('Object', this.id, eventType);
                cb(...args);
            }
        });
    }
    get bounds() {
        let { x, y } = this.position;
        let { width, height } = this.size;
        return { x, y, width, height };
    }
    set bounds({ x, y, width, height }) {
        Object.assign(this.position, { x, y });
        Object.assign(this.size, { width, height });
    }
    get screenBounds() {
        let width = this.size.width * this.canvas.panel.ratioWidth;
        let height = this.size.height * this.canvas.panel.ratioHeight;
        let x = this.position.x + this.canvas.width / 2 - width / 2;
        let y = this.position.y + this.canvas.height / 2 - height / 2;
        return { x, y, width, height };
    }
    setScreenPosition(newPos, offset = { x: 0, y: 0 }) {
        let width = this.size.width * this.canvas.panel.ratioWidth;
        let height = this.size.height * this.canvas.panel.ratioHeight;
        this.position.x = newPos.x - this.canvas.width / 2 + width / 2 + offset.x;
        this.position.y = newPos.y - this.canvas.height / 2 + height / 2 + offset.y;
    }
    draw() {
        let { x, y, width, height } = this.screenBounds;

        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(x, y, width, height);

        if (this.debugInfo) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = (this.canvas.panel.ratioHeight * 16) + "px 'Fira Code'"
            let infos = [
                `${~~width}x${~~height}`,
                `${~~x},${~~y}`,
                `------------------`,
                `${~~this.size.width}x${~~this.size.height}`,
                `${~~this.position.x},${~~this.position.y}`,
            ]

            for (let i = 0; i < infos.length; i++) {
                const info = infos[i];
                this.ctx.fillText(
                    info,
                    x + 2 * this.canvas.panel.ratioWidth,
                    y + (15 + i * 15) * this.canvas.panel.ratioHeight,
                    width - (2 * this.canvas.panel.ratioWidth) * 2

                );
            }
        }
    }
    static drawAll() {
        this.allObjects.forEach(obj => {
            obj.draw();
        });
    }
}