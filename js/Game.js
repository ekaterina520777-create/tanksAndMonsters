import { Tank } from './Tank.js';
import { Monster } from './Monster.js';
import { Bonus } from './Bonus.js';

export class Game {
    constructor(canvasId, leaderboardApp) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 40; 
        
        this.leaderboardApp = leaderboardApp; 
        this.map = [];
        this.keys = {};
        this.bullets = [];
        this.monsters = [];
        this.bonuses = [];
        this.isPaused = false;
        this.tankSpeed = 3;
        this.isRunning = false;

        this.p1 = null;
        this.p2 = null;

        this.initGlobalEvents();
    }

    initGlobalEvents() {
        window.addEventListener('keydown', e => { 
            this.keys[e.code] = true; 
            if (e.code === 'KeyP' && this.isRunning) {
                this.togglePause();
            }
        });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseOverlay').classList.toggle('hidden', !this.isPaused);
    }

    setupLevel(mapGrid, selectedSpeed, monsterDamage, lives) {
        this.map = mapGrid;
        this.tankSpeed = parseInt(selectedSpeed);
        this.bullets = [];
        this.bonuses = [];
        this.isPaused = false;
        document.getElementById('pauseOverlay').classList.add('hidden');

        const initialLives = parseInt(lives) || 3;

        this.p1 = new Tank(this, this.tileSize * 1.2, this.tileSize * 1.2, '#4CAF50', {
            up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', shoot: 'Enter'
        });
        this.p1.lives = initialLives;

        this.p2 = new Tank(this, this.tileSize * 13.2, this.tileSize * 9.2, '#2196F3', {
            up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', shoot: 'Space'
        });
        this.p2.lives = initialLives;

        this.monsters = [
            new Monster(this, this.tileSize * 7 + 4, this.tileSize * 5 + 4, parseInt(monsterDamage))
        ];

        this.isRunning = true;
    }

    isColliding(x, y, size) {
        let corners = [
            { cx: x, cy: y },
            { cx: x + size - 1, cy: y },
            { cx: x, cy: y + size - 1 },
            { cx: x + size - 1, cy: y + size - 1 }
        ];
        for (let corner of corners) {
            let gridX = Math.floor(corner.cx / this.tileSize);
            let gridY = Math.floor(corner.cy / this.tileSize);
            if (this.map[gridY] && this.map[gridY][gridX] === 1) return true;
        }
        return false;
    }

    hitTank(bullet, tank) {
        return bullet.x > tank.x && bullet.x < tank.x + tank.size && 
               bullet.y > tank.y && bullet.y < tank.y + tank.size;
    }

    hitMonster(bullet, monster) {
        return bullet.x > monster.x && bullet.x < monster.x + monster.size &&
               bullet.y > monster.y && bullet.y < monster.y + monster.size;
    }

    checkBonusCollision(tank, bonus) {
        return tank.x < bonus.x + bonus.size &&
               tank.x + tank.size > bonus.x &&
               tank.y < bonus.y + bonus.size &&
               tank.y + tank.size > bonus.y;
    }

    update() {
        if (!this.isRunning || this.isPaused) return;

        this.p1.move();
        this.p2.move();

        for (let monster of this.monsters) {
            monster.update();
        }

        let winnerMessage = null;

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            let b = this.bullets[i];
            b.update();

            if (!b.isMonsterBullet) {
                for (let m = this.monsters.length - 1; m >= 0; m--) {
                    let monster = this.monsters[m];
                    if (this.hitMonster(b, monster)) {
                        monster.hp -= b.damage;
                        b.active = false;
                        
                        if (monster.hp <= 0) {
                            const bonusType = Math.random() < 0.5 ? 'life' : 'speed';
                            this.bonuses.push(new Bonus(this, monster.x, monster.y, bonusType));
                            
                            this.monsters.splice(m, 1);
                        }
                        break;
                    }
                }
            }

            if (this.hitTank(b, this.p1) && b.color !== this.p1.color) {
                this.p1.hp -= b.damage;
                b.active = false;
                if (this.p1.hp <= 0) {
                    this.p1.lives--;
                    if (this.p1.lives <= 0) {
                        winnerMessage = b.isMonsterBullet ? 'Синий победил (Зеленый уничтожен турелью)!' : 'Синий Танк выиграл дуэль!';
                    } else {
                        this.p1.hp = 100;
                        this.p1.x = this.tileSize * 1.2;
                        this.p1.y = this.tileSize * 1.2;
                    }
                }
            }

            if (this.hitTank(b, this.p2) && b.color !== this.p2.color) {
                this.p2.hp -= b.damage;
                b.active = false;
                if (this.p2.hp <= 0) {
                    this.p2.lives--;
                    if (this.p2.lives <= 0) {
                        winnerMessage = b.isMonsterBullet ? 'Зеленый победил (Синий уничтожен турелью)!' : 'Зеленый Танк выиграл дуэль!';
                    } else {
                        this.p2.hp = 100;
                        this.p2.x = this.tileSize * 13.2;
                        this.p2.y = this.tileSize * 9.2;
                    }
                }
            }

            if (!b.active) {
                this.bullets.splice(i, 1);
            }
        }

        for (let i = this.bonuses.length - 1; i >= 0; i--) {
            let bonus = this.bonuses[i];

            if (this.checkBonusCollision(this.p1, bonus)) {
                if (bonus.type === 'life') {
                    this.p1.lives++;
                } else if (bonus.type === 'speed') {
                    this.p1.bulletSpeedMultiplier = 2.0; 
                }
                this.bonuses.splice(i, 1);
                continue;
            }

            if (this.checkBonusCollision(this.p2, bonus)) {
                if (bonus.type === 'life') {
                    this.p2.lives++;
                } else if (bonus.type === 'speed') {
                    this.p2.bulletSpeedMultiplier = 2.0;
                }
                this.bonuses.splice(i, 1);
            }
        }

        if (winnerMessage) {
            this.isRunning = false;
            alert(winnerMessage);
            this.leaderboardApp.addRecord(winnerMessage);
        }
    }

   render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.isRunning) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText('Настройте параметры и нажмите "Запустить"', 100, 220);
            return;
        }

        this.ctx.fillStyle = '#444';
        for (let r = 0; r < this.map.length; r++) {
            for (let c = 0; c < this.map[r].length; c++) {
                if (this.map[r][c] === 1) {
                    this.ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }

        for (let bonus of this.bonuses) {
            bonus.draw();
        }

        for (let monster of this.monsters) monster.draw();
        this.p1.draw();
        this.p2.draw();
        for (let b of this.bullets) b.draw();

        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('P1: ' + '♥'.repeat(this.p1.lives) + ' (' + this.p1.hp + '%)', 30, 25);

        this.ctx.fillStyle = '#2196F3';
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillText('P2: ' + '♥'.repeat(this.p2.lives) + ' (' + this.p2.hp + '%)', this.canvas.width - 210, 25);
    }

    loop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.loop());
    }
}