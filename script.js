import { requestAnimation } from "./lib.js";
import { Board } from "./lib/Board.js";
import { Stone } from "./lib/Stone.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
(window.onload = window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.style.backgroundColor = '#aaa';
    canvas.style.backgroundColor = '#aaa';
    canvas.style.width = canvas.width + "px";
    setTimeout(function () {
        canvas.style.height = canvas.height + "px";
    }, 0);

    canvas.screen = { width: 1920, height: 1080 };

    canvas.panel = { ratio: canvas.screen.width / canvas.screen.height };
    canvas.panel.width = canvas.width;
    canvas.panel.height = canvas.panel.width / canvas.panel.ratio;
    if (canvas.panel.height > canvas.height) {
        canvas.panel.height = canvas.height;
        canvas.panel.width = canvas.panel.height * canvas.panel.ratio;
    }
    Object.defineProperty(canvas.panel, 'ratioWidth', {
        get: function () { return this.width / canvas.screen.width; }
    });
    Object.defineProperty(canvas.panel, 'ratioHeight', {
        get: function () { return this.height / canvas.screen.height; }
    });
})();

for (let j = 0; j < 2; j++) {
    for (let i = 1; i <= 13; i++) {
        new Stone({ canvas, number: i, color: 'red' });
    }
    for (let i = 1; i <= 13; i++) {
        new Stone({ canvas, number: i, color: 'blue' });
    }
    for (let i = 1; i <= 13; i++) {
        new Stone({ canvas, number: i, color: 'black' });
    }
    for (let i = 1; i <= 13; i++) {
        new Stone({ canvas, number: i, color: 'orange' });
    }
    new Stone({ canvas, number: '*', color: 'brown' });
}

Stone.allObjects.shuffle();

let board = new Board({ canvas });

requestAnimation(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(
        canvas.width / 2 - canvas.panel.width / 2,
        canvas.height / 2 - canvas.panel.height / 2,
        canvas.panel.width, canvas.panel.height);

    ctx.fillStyle = '#fff';
    ctx.font = canvas.panel.ratioHeight * 16 + "px 'Fira Code'"

    let infos = [
        `Base Screen |  ${canvas.screen.width} x ${canvas.screen.height}`,
        `Canvas      |  ${canvas.width} x ${canvas.height}`,
        `Panel       |  ${canvas.panel.width} x ${canvas.panel.height}`,
    ]

    for (let i = 0; i < infos.length; i++) {
        const info = infos[i];
        ctx.fillText(info,
            (canvas.width / 2 - canvas.panel.width / 2) + 10 * canvas.panel.ratioWidth,
            (canvas.height / 2 - canvas.panel.height / 2) + (25 + i * 20) * canvas.panel.ratioHeight
        )
    }

    board.draw();
    Stone.drawAll();
});

