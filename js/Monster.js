import { TankBullet } from './TankBullet.js';

export class Monster {
    constructor(game, x, y, damage) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = 32;
        this.color = '#FF5722';
        this.cooldown = 0;
        this.damage = damage;
    }

    update() {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        const p1 = this.game.p1;
        const p2 = this.game.p2;
        if (!p1 || !p2) return;

        const dist1 = Math.hypot(p1.x - this.x, p1.y - this.y);
        const dist2 = Math.hypot(p2.x - this.x, p2.y - this.y);
        const target = dist1 < dist2 ? p1 : p2;

        let dx = 0;
        let dy = 0;

        if (Math.abs(target.x - this.x) > Math.abs(target.y - this.y)) {
            dx = target.x > this.x ? 1 : -1;
        } else {
            dy = target.y > this.y ? 1 : -1;
        }
        let b = new TankBullet(this.game, this.x + this.size / 2, this.y + this.size / 2, dx, dy, '#FF5722');
        b.damage = this.damage;
        b.isMonsterBullet = true;
        this.game.bullets.push(b);

        this.cooldown = 90;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(this.x + 10, this.y + 10, 12, 12);
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(this.x + 14, this.y + 14, 4, 4);
    }
}