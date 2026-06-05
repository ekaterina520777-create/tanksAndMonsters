import { Bullet } from './Bullet.js';

export class Tank {
    constructor(game, x, y, color, controls) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = 24;
        this.color = color;
        this.controls = controls;
        this.dx = 0;
        this.dy = -1;
        this.cooldown = 0;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.fillStyle = '#fff';
        let cx = this.x + this.size / 2;
        let cy = this.y + this.size / 2;
        ctx.fillRect(cx - 3 + this.dx * 12, cy - 3 + this.dy * 12, 6, 6);
    }

    move() {
        let nextX = this.x;
        let nextY = this.y;
        let keys = this.game.keys;
        let speed = this.game.tankSpeed;

        if (keys[this.controls.up]) { nextY -= speed; this.dx = 0; this.dy = -1; }
        else if (keys[this.controls.down]) { nextY += speed; this.dx = 0; this.dy = 1; }
        else if (keys[this.controls.left]) { nextX -= speed; this.dx = -1; this.dy = 0; }
        else if (keys[this.controls.right]) { nextX += speed; this.dx = 1; this.dy = 0; }

        if (!this.game.isColliding(nextX, nextY, this.size)) {
            this.x = nextX;
            this.y = nextY;
        }

        if (this.cooldown > 0) this.cooldown--;
        if (keys[this.controls.shoot] && this.cooldown === 0) {
            this.game.bullets.push(new Bullet(this.game, this.x + this.size/2, this.y + this.size/2, this.dx, this.dy, this.color));
            this.cooldown = 30;
        }
    }
}