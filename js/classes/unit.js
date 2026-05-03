class Unit {
    constructor(x, y, unitType, isPlayer, lane, card = null) {
        const stats = window.CONFIG.CARDS[unitType] || window.CONFIG.CARDS.knight;

        this.attackType = stats.attackType || 'melee';
        this.attackRange = stats.range || 30;
        this.bridgeX = lane === 'left' ? 150 : 750;
        this.hasCrossedBridge = false;

        this.x = x;
        this.y = y;
        this.type = unitType;
        this.isPlayer = isPlayer;
        this.lane = lane;
        this.card = card;
        
        this.hp = stats.hp;
        this.maxHp = stats.hp;
        this.damage = stats.damage;
        this.range = stats.range;
        this.speed = stats.speed;
        this.attackCooldown = 0;
        this.attackSpeed = stats.attackSpeed || 1.0;
        
        this.target = null;
        this.targetType = null;
    }
    
    update(delta, allUnits, towers) {
        const centerY = window.CONFIG.GAME.height / 2;
        
        // ===== ЛОГИКА ПЕРЕХОДА ЧЕРЕЗ МОСТ =====
        if (!this.hasCrossedBridge) {
            // Определяем целевую Y координату для достижения моста
            let targetY;
            if (this.isPlayer) {
                // Игрок идет СНИЗУ ВВЕРХ к мосту (от y=500 к y=300)
                targetY = centerY - 30;
            } else {
                // Враг идет СВЕРХУ ВНИЗ к мосту (от y=100 к y=300)
                targetY = centerY + 30;
            }
            
            // Двигаемся к мосту
            const dy = targetY - this.y;
            if (Math.abs(dy) > 2) {
                this.y += Math.sign(dy) * this.speed;
            } else {
                // Достигли моста
                this.hasCrossedBridge = true;
                console.log(`🌉 ${this.isPlayer ? 'Игрок' : 'Враг'} перешел мост на ${this.lane} дорожке`);
            }
            
            // Корректируем X позицию к центру дорожки
            const dxToBridge = this.bridgeX - this.x;
            if (Math.abs(dxToBridge) > 2) {
                this.x += Math.sign(dxToBridge) * Math.min(Math.abs(dxToBridge), this.speed);
            }
            
            return; // Пока не перешли мост - ничего больше не делаем
        }
        
        // ===== ПОСЛЕ ПЕРЕХОДА МОСТА =====
        // Обновляем кулдаун атаки
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        // Поиск цели
        this.findTarget(allUnits, towers);
        
        // Атака или движение
        if (this.target && this.attackCooldown <= 0 && this.isInAttackRange(this.target)) {
            this.attack();
        } else if (this.target) {
            this.moveToTarget();
        } else {
            this.moveToTower(towers);
        }
    }
    
    isInAttackRange(target) {
        const dist = Math.hypot(this.x - target.x, this.y - target.y);
        return dist <= this.range;
    }
    
    findTarget(allUnits, towers) {
        // Сначала ищем вражеских юнитов
        let closestUnit = null;
        let closestDist = Infinity;
        
        for (let unit of allUnits) {
            if (unit !== this && unit.isPlayer !== this.isPlayer && unit.lane === this.lane && unit.hp > 0) {
                const dist = Math.hypot(this.x - unit.x, this.y - unit.y);
                if (dist < closestDist) {
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
        
        // Если нет юнитов - ищем башню
        const targetTower = this.getTargetTower(towers);
        if (targetTower && targetTower.hp > 0) {
            this.target = targetTower;
            this.targetType = 'tower';
            return;
        }
        
        this.target = null;
        this.targetType = null;
    }
    
    getTargetTower(towers) {
        if (this.isPlayer) {
            // Игрок атакует вражеские башни
            if (this.lane === 'left' && towers.enemyLeft?.hp > 0) return towers.enemyLeft;
            if (this.lane === 'right' && towers.enemyRight?.hp > 0) return towers.enemyRight;
            return towers.enemyKing;
        } else {
            // Враг атакует башни игрока
            if (this.lane === 'left' && towers.playerLeft?.hp > 0) return towers.playerLeft;
            if (this.lane === 'right' && towers.playerRight?.hp > 0) return towers.playerRight;
            return towers.playerKing;
        }
    }
    
    moveToTarget() {
        if (!this.target) return;
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        // Останавливаемся на дистанции атаки
        const stopDistance = Math.max(10, this.range * 0.6);
        
        if (dist > stopDistance) {
            // Нормализованное движение
            const moveX = (dx / dist) * this.speed;
            const moveY = (dy / dist) * this.speed;
            
            this.x += moveX;
            this.y += moveY;
        }
        
        // Дополнительная коррекция для удержания на дорожке
        const dxToBridge = this.bridgeX - this.x;
        if (Math.abs(dxToBridge) > 10) {
            this.x += Math.sign(dxToBridge) * Math.min(Math.abs(dxToBridge) * 0.1, this.speed * 0.5);
        }
    }
    
    moveToTower(towers) {
        const targetTower = this.getTargetTower(towers);
        if (!targetTower) return;
        
        const dx = targetTower.x - this.x;
        const dy = targetTower.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 15) {
            const moveX = (dx / dist) * this.speed;
            const moveY = (dy / dist) * this.speed;
            
            this.x += moveX;
            this.y += moveY;
        }
    }
    
    attack() {
        if (!this.target || this.target.hp <= 0) {
            this.target = null;
            this.targetType = null;
            return;
        }
        
        let actualDamage = this.damage;
        
        if (this.targetType === 'unit') {
            this.target.hp -= actualDamage;
            if (window.Effects) {
                window.Effects.addHitEffect(this.target.x, this.target.y);
            }
        } else if (this.targetType === 'tower') {
            this.target.hp = Math.max(0, this.target.hp - actualDamage);
            if (window.Effects) {
                window.Effects.addTowerHitEffect(this.target.x, this.target.y);
            }
            
            // Если башня разрушена - сбрасываем цель
            if (this.target.hp <= 0) {
                this.target = null;
                this.targetType = null;
            }
        }
        
        this.attackCooldown = this.attackSpeed;
        
        if (window.SoundFX) window.SoundFX.playHit();
        console.log(`⚔️ ${this.type} атакует ${this.targetType} на ${actualDamage} урона`);
    }
}

window.Unit = Unit;
