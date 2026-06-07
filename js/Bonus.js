export class Bonus {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.size = 32;
    }

    draw() {
        let ctx = this.game.ctx;
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.type === 'life') {
            ctx.fillStyle = '#FF1744';
            ctx.fillText('♥', this.x + this.size / 2, this.y + this.size / 2);
        } else if (this.type === 'speed') {
            ctx.fillStyle = '#FFEA00';
            ctx.fillText('⚡', this.x + this.size / 2, this.y + this.size / 2);
        }
    }
}