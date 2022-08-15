import { requestAnimation } from "./lib.js";
import { Board } from "./lib/Board.js";
import { Stone } from "./lib/Stone2.js";
import { Obj } from "./lib/Object2.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.bgColor = 'black';
canvas.width = 1920;
canvas.height = 1080;
canvas.ratio = canvas.width / canvas.height;
ctx.translate(canvas.width / 2, canvas.height / 2);
canvas.screenToWorldPoint = (p) => {
    let { x, y } = p;

    x -= (window.innerWidth - parseInt(canvas.style.width)) / 2;
    x -= parseInt(canvas.style.width) / 2;
    x *= canvas.width / parseInt(canvas.style.width);

    y -= (window.innerHeight - parseInt(canvas.style.height)) / 2
    y -= parseInt(canvas.style.height) / 2;
    y *= canvas.height / parseInt(canvas.style.height);

    return { x, y };
}
canvas.worldToScreenPoint = (p) => {
    let { x, y } = p;

    x += (window.innerWidth - parseInt(canvas.style.width)) / 2;
    x += parseInt(canvas.style.width) / 2;
    x /= canvas.width / parseInt(canvas.style.width);

    y += (window.innerHeight - parseInt(canvas.style.height)) / 2
    y += parseInt(canvas.style.height) / 2;
    y /= canvas.height / parseInt(canvas.style.height);

    return { x, y };
}

document.body.style.backgroundColor = '#aaa';
canvas.style.backgroundColor = '#a3a';

(window.onload = window.onresize = () => {
    let width = window.innerWidth;
    let height = width / canvas.ratio;

    if (height > window.innerHeight) {
        height = window.innerHeight;
        width = height * canvas.ratio;
    }

    canvas.style.width = width + "px";
    setTimeout(function () {
        canvas.style.height = height + "px";
    }, 0);
})();

function getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// let colors = ['red', 'blue', 'black', 'orange'];
// for (let j = 0; j < 2; j++) {
//     for (let c = 0; c < colors.length; c++) {
//         const color = colors[c];
//         for (let i = 1; i <= 13; i++) {
//             new Stone({
//                 number: i,
//                 color,
//                 x: getRndInt(-canvas.width / 2 + 100, canvas.width / 2 - 200),
//                 y: getRndInt(-canvas.height / 2 + 100, canvas.height / 2 - 200),
//             });
//         }
//     }
//     new Stone({ number: '*', color: 'brown' });
// }
// Stone.allObjects.shuffle();
new Stone({ number: '*', color: 'brown', targetPlaceholderIndex: 0});
new Stone({ number: 1, color: 'red', targetPlaceholderIndex: 1});
new Stone({ number: 2, color: 'blue', targetPlaceholderIndex: 2});
let board = new Board();

requestAnimation(() => {
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    ctx.fillStyle = ctx.bgColor;
    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    //obj.draw();
    board.draw();
    Stone.drawAll();
    Stone.moveAll();


    {
        ctx.textAlign = 'start';
        ctx.fillStyle = '#fff';
        var fontSize = 24;
        ctx.font = fontSize + "px 'Fira Code'"

        let infos = [
            `Canvas      |  ${canvas.width} x ${canvas.height}`,
            `Style       |  ${canvas.style.width} x ${canvas.style.height}`,
        ]

        for (let i = 0; i < infos.length; i++) {
            const info = infos[i];
            ctx.fillText(
                info,
                -canvas.width / 2 + 10,
                -canvas.height / 2 + 10 + fontSize + i * (fontSize + 5),
            )
        }
    }
});

