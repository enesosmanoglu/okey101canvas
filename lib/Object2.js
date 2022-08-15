import { areBoxesCollide, getPointDistance, isPointInsideBox, roundRect } from "../lib.js";
import { Board } from "./Board.js";

export class Obj {
    static allObjects = [];
    static speed = 5;

    type = 'object'
    debugInfo = false;

    canvas = document.querySelector('canvas');
    ctx = this.canvas?.getContext('2d');

    x = 0;
    y = 0;
    width = 100;
    height = 100;
    roundRadius = 10;
    bgColor = 'white';

    draggable = true;

    isDragged = false;
    dragOffset = { x: 0, y: 0 };
    isPointInsideBox = false;
    events = {};

    targetX = this.x;
    targetY = this.y;

    /** 
     * @param {{
*           canvas:HTMLCanvasElement
     * }}
     * */
    constructor(
        {
            x = this.x,
            y = this.y,
            centered = false,
            width = this.width,
            height = this.height,
            bgColor = this.bgColor,
            type = this.type,
            debugInfo = this.debugInfo,
            canvas = this.canvas,
            draggable = this.draggable,
            roundRadius = this.roundRadius,
        }
    ) {
        this.type = type;
        this.debugInfo = debugInfo;

        this.id = Obj.allObjects.length;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
        if (!centered) {
            this.x = x;
            this.y = y;
        } else {
            this.centerX = x;
            this.centerY = y;
        }
        this.bgColor = bgColor;

        this.draggable = draggable;
        this.roundRadius = roundRadius;

        this.events.mousedown = e => {
            if (!this.isPointInsideBox) return;
            console.log('Clicked Object', canvas.screenToWorldPoint(e), this.isPointInsideBox, this.bounds)

            let clickedObjects = Obj.allObjects.filter(o => o.isPointInsideBox);
            if (clickedObjects[clickedObjects.length - 1] != this) return;

            Obj.allObjects.splice(Obj.allObjects.findIndex(o => o == this), 1);
            Obj.allObjects.push(this);
            this.isDragged = true;
            this.dragOffset = { x: this.x - canvas.screenToWorldPoint(e).x, y: this.y - canvas.screenToWorldPoint(e).y };

        };
        canvas.addEventListener('mousedown', this.events.mousedown);

        this.events.mouseup = e => {
            this.isDragged = false;
            this.dragOffset = { x: 0, y: 0 };

            let colliders = Board.placeHolders.flat().filter(ph => areBoxesCollide(this, ph))
            if (colliders.length) {
                let distances = colliders.map(c => getPointDistance(c, this));
                let closestIndex = distances.indexOf(Math.min(...distances));
                let closest = colliders[closestIndex];
                this.setTarget(closest);
            }
        };
        canvas.addEventListener('mouseup', this.events.mouseup);

        this.events.mousemove = e => {
            this.isPointInsideBox = isPointInsideBox(canvas.screenToWorldPoint(e), this.bounds);
            if (this.isDragged) {
                this.setTarget(canvas.screenToWorldPoint(e), this.dragOffset);

            }
        };
        canvas.addEventListener('mousemove', this.events.mousemove);


        Obj.allObjects.push(this);
    }
    on(eventType, cb = () => { }) {
        if (this.events[eventType])
            document.removeEventListener(eventType, this.events[eventType]);
        this.events[eventType] = cb;
        document.addEventListener(eventType, (...args) => {
            if (isPointInsideBox(args[0], this.bounds)) {
                console.log('Object', this.id, eventType);
                cb(...args);
            }
        });
    }

    get centerX() {
        return this.x + this.width / 2;
    }
    set centerX(x) {
        this.x = x - this.width / 2;
    }
    get centerY() {
        return this.y + this.height / 2;
    }
    set centerY(y) {
        this.y = y - this.height / 2;
    }

    get position() {
        return { x: this.x, y: this.y };
    }
    set position({ x = this.x, y = this.y }) {
        this.x = x;
        this.y = y;
    }
    get size() {
        return { width: this.width, height: this.height };
    }
    set size({ width = this.width, height = this.height }) {
        this.width = width;
        this.height = height;
    }
    get bounds() {
        let { x, y, width, height } = this;
        return { x, y, width, height };
    }
    set bounds({ x = this.x, y = this.y, width = this.width, height = this.height }) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    getPosition() {
        return this.position;
    }
    setPosition(point = { x: this.x, y: this.y }, offset = { x: 0, y: 0 }) {
        this.x = (point?.x ?? this.x) + (offset?.x ?? 0);
        this.y = (point?.y ?? this.y) + (offset?.y ?? 0);
        this.targetX = this.x;
        this.targetY = this.y;
    }
    setTarget(point = { x: this.targetX, y: this.targetY }, offset = { x: 0, y: 0 }) {
        this.targetX = (point?.x ?? this.targetX) + (offset?.x ?? 0);
        this.targetY = (point?.y ?? this.targetY) + (offset?.y ?? 0);
    }

    draw() {
        let { x, y, width, height } = this;
        let { centerX, centerY } = this;

        this.ctx.fillStyle = this.bgColor;
        // this.ctx.fillRect(
        //     x, y,
        //     width, height
        // );
        roundRect(x, y, width, height, this.roundRadius, true)

        if (this.debugInfo) {
            var fontSize = 12;
            this.ctx.font = fontSize + "px 'Fira Code'"
            this.ctx.fillStyle = this.bgColor;
            this.ctx.textAlign = "center";

            this.ctx.fillText(
                `(${~~(x)},${~~(y)})`,
                x,
                y - 5,
            );
            this.ctx.fillText(
                `(${~~(x + width)},${~~(y)})`,
                x + width,
                y - 5,
            );
            this.ctx.fillText(
                `(${~~(x + width)},${~~(y + height)})`,
                x + width,
                y + height + fontSize + 5,
            );
            this.ctx.fillText(
                `(${~~(x)},${~~(y + height)})`,
                x,
                y + height + fontSize + 5,
            );
            this.ctx.fillStyle = this.ctx.bgColor;
            this.ctx.fillText(
                `(${~~(centerX)},${~~(centerY)})`,
                centerX,
                centerY + fontSize / 4,
            );

            var fontSize = 16;
            this.ctx.font = fontSize + "px 'Fira Code'"
            this.ctx.fillStyle = '#a3a';
            let infos = [
                `${~~width}x${~~height}`,
            ]

            for (let i = 0; i < infos.length; i++) {
                const info = infos[i];
                this.ctx.fillText(
                    info,
                    this.centerX,
                    this.y + (fontSize) + (i * (fontSize + 2)),
                    width - 2 * 2
                );
            }
        }
    }
    static drawAll() {
        this.allObjects.forEach(obj => {
            obj.draw();
        });
    }

    move() {
        if (this.targetX != this.x) {
            this.x += (this.targetX - this.x) / Obj.speed;
        }
        if (this.targetY != this.y) {
            this.y += (this.targetY - this.y) / Obj.speed;
        }
    }
    static moveAll() {
        this.allObjects.forEach(obj => {
            obj.move();
        });
    }
}