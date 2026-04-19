// ============================================================
// tower.js - Класс башен    team - core : @lafneroo  ( Остапчук Андрей )
// ============================================================
class Tower {
    constructor(x, y, isPlayer, position) {
        this.x = x;
        this.y = y;
        this.isPlayer = isPlayer;
        this.position = position; // 'left', 'right', 'king'
        this.side = isPlayer ? 'player' : 'enemy';
        
        // Характеристики из конфига
        const towerConfig = window.CONFIG.GAME.towers[`${this.side}${position === 'king' ? 'King' : position.charAt(0).toUpperCase() + position.slice(1)}`];
        
        this.maxHp = towerConfig?.maxHp || (position === 'king' ? 3000 : 1500);
        this.hp = this.maxHp;
        this.damage = towerConfig?.damage || 50;
        this.range = towerConfig?.range || 100;
        this.attackCooldown = 0;
        this.attackSpeed = 0.8; // атак в секунду
    }
    
    update(delta, units, gameState) {
        if (this.hp <= 0) return;
        
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        // Поиск цели в радиусе
        const target = this.findTarget(units);
        
        if (target && this.attackCooldown <= 0) {
            this.attack(target);
            this.attackCooldown = this.attackSpeed;
        }
    }
    
    findTarget(units) {
        // Башня атакует вражеских юнитов в радиусе
        let closestTarget = null;
        let closestDist = Infinity;
        
        for (let unit of units) {
            if (unit.isPlayer !== this.isPlayer && unit.hp > 0) {
                const dist = Math.hypot(this.x - unit.x, this.y - unit.y);
                if (dist < this.range && dist < closestDist) {
                    closestDist = dist;
                    closestTarget = unit;
                }
            }
        }
        
        return closestTarget;
    }
    
    attack(target) {
        target.hp = Math.max(0, target.hp - this.damage);
        
        if (window.SoundFX) window.SoundFX.playTowerHit();
        console.log(`🏰 Башня ${this.side} ${this.position} атакует на ${this.damage} урона`);
    }
}

window.Tower = null;
