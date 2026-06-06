export class TankBullet {
    constructor(game, x, y, dx, dy, color) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = 6;
        this.color = color;
        this.active = true;
        this.damage = 100;  
        this.isMonsterBullet = false;
    }

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        let gridX = Math.floor(this.x / this.game.tileSize);
        let gridY = Math.floor(this.y / this.game.tileSize);
        if (this.game.map[gridY] && this.game.map[gridY][gridX] === 1) {
            this.active = false;
        }
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}