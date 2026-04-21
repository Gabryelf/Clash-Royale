// ============================================================
// unit.js - Класс юнита
// ============================================================

class Unit {
    constructor(x, y, unitType, isPlayer, lane, card = null) {
        const stats = window.CONFIG.CARDS[unitType] || window.CONFIG.CARDS.knight;
        
        this.x = x;
        this.y = y;
        this.type = unitType;
        this.isPlayer = isPlayer;
        this.lane = lane;
        this.card = card;
        
        // Характеристики из конфига
        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.damage = stats.damage;
        this.range = stats.range;
        this.speed = stats.speed;
        this.attackCooldown = 0;
        this.attackSpeed = stats.attackSpeed || 1.0;
        
        // Цель
        this.target = null;
        this.targetType = null; // 'unit', 'tower'

        this.attackType = stats.attackType || 'melee'; // 'melee' или 'ranged'
        this.attackRange = stats.range;
    }
    
    update(delta, allUnits, towers) {
        // Обновляем кулдаун атаки
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        // Поиск цели
        this.findTarget(allUnits, towers);
        
        // Атака или движение
        if (this.target && this.attackCooldown <= 0) {
            this.attack();
        } else if (this.target) {
            // Двигаемся к цели
            this.moveToTarget();
        } else {
            // Двигаемся к вражеской башне
            this.moveToTower(towers);
        }
    }
    
    findTarget(allUnits, towers) {
        let closestUnit = null;
        let closestDist = Infinity;
        
        for (let unit of allUnits) {
            if (unit.isPlayer !== this.isPlayer && unit.lane === this.lane && unit.hp > 0) {
                const dist = Math.hypot(this.x - unit.x, this.y - unit.y);
                // Для дальних юнитов - атакуем в пределах range
                // Для ближних - подходим вплотную
                const effectiveRange = this.attackType === 'ranged' ? this.attackRange : this.attackRange;
                if (dist < effectiveRange && dist < closestDist) {
                    closestDist = dist;
                    closestUnit = unit;
                }
            }
        }
        
        if (closestUnit) {
            this.target = closestUnit;
            this.targetType = 'unit';
            return;
        }
        
        // Поиск башни
        const targetTower = this.getTargetTower(towers);
        if (targetTower && targetTower.hp > 0) {
            const dist = Math.hypot(this.x - targetTower.x, this.y - targetTower.y);
            const effectiveRange = this.attackType === 'ranged' ? this.attackRange : this.attackRange;
            if (dist < effectiveRange) {
                this.target = targetTower;
                this.targetType = 'tower';
                return;
            }
        }
        
        this.target = null;
        this.targetType = null;
    }
    
    getTargetTower(towers) {
        if (this.isPlayer) {
            // Игрок атакует вражеские башни
            if (towers.enemyLeft?.hp > 0 && this.lane === 'left') return towers.enemyLeft;
            if (towers.enemyRight?.hp > 0 && this.lane === 'right') return towers.enemyRight;
            return towers.enemyKing;
        } else {
            // Враг атакует башни игрока
            if (towers.playerLeft?.hp > 0 && this.lane === 'left') return towers.playerLeft;
            if (towers.playerRight?.hp > 0 && this.lane === 'right') return towers.playerRight;
            return towers.playerKing;
        }
    }
    
    attack() {
        if (!this.target) return;
        
        if (this.targetType === 'unit') {
            this.target.hp -= this.damage;
        } else if (this.targetType === 'tower') {
            this.target.hp = Math.max(0, this.target.hp - this.damage);
        }
        
        this.attackCooldown = this.attackSpeed;
        
        if (window.SoundFX) window.SoundFX.playHit();
        console.log(`⚔️ ${this.type} атакует ${this.targetType} на ${this.damage} урона`);
    }
    
    moveToTarget() {
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        // Для дальних юнитов - останавливаемся на дистанции атаки
        const stopDistance = this.attackType === 'ranged' ? this.attackRange * 0.8 : 10;
        
        if (dist > stopDistance) {
            const moveX = (dx / dist) * this.speed;
            const moveY = (dy / dist) * this.speed;
            this.x += moveX;
            this.y += moveY;
        }
    }
    
    moveToTower(towers) {
        const targetTower = this.getTargetTower(towers);
        if (!targetTower) return;
        
        const dx = targetTower.x - this.x;
        const dy = targetTower.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 5) {
            const moveX = (dx / dist) * this.speed;
            const moveY = (dy / dist) * this.speed;
            this.x += moveX;
            this.y += moveY;
        }
    }
}

window.Unit = null;
