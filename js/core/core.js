// CORE - основная игровая логика
window.Core = {
    lastTime: 0,
    
    init: function(canvas, ctx) {
        Graphics.init(ctx);
        UI.init(canvas);
        SoundFX.init();
        GameState.startBattle();
        this.lastTime = performance.now() / 1000;
        this.gameLoop();
    },
    
    deployUnit: function(x, y) {
        const type = GameState.selectedUnit;
        const cost = CONFIG.GAME.units[type].cost;
        
        if (!GameState.canDeploy(cost)) {
            QA.log(`Not enough elixir! Need ${cost}, have ${Math.floor(GameState.elixir)}`);
            return false;
        }
        
        const stats = CONFIG.GAME.units[type];
        const unit = {
            x: x,
            y: y,
            type: type,
            isPlayer: true,
            hp: stats.hp,
            maxHp: stats.hp,
            damage: stats.damage,
            range: stats.range,
            speed: stats.speed,
            attackTimer: 0
        };
        
        // Тратим эликсир через GameState
        if (GameState.deployUnit(unit)) {
            SoundFX.playDeploy();
            QA.log(`Deployed ${type} at (${Math.floor(x)},${Math.floor(y)}) - Elixir: ${Math.floor(GameState.elixir)}`);
            return true;
        }
        
        return false;
    },
    
    updateUnits: function(delta) {
        const units = GameState.getUnits();
        
        for (let i = 0; i < units.length; i++) {
            const u = units[i];
            
            // Обновление таймера атаки
            if (u.attackTimer > 0) u.attackTimer -= delta;
            
            // Поиск цели
            let target = null;
            let targetDist = Infinity;
            
            if (u.isPlayer) {
                // Игрок атакует вражескую башню (вверху)
                const tower = CONFIG.GAME.towers.enemy;
                const distToTower = Math.hypot(u.x - tower.x, u.y - tower.y);
                if (distToTower < u.range && GameState.enemyTowerHP > 0) {
                    target = { type: 'tower', dist: distToTower };
                    targetDist = distToTower;
                }
                
                // Поиск вражеских юнитов
                for (let j = 0; j < units.length; j++) {
                    const other = units[j];
                    if (!other.isPlayer) {
                        const dist = Math.hypot(u.x - other.x, u.y - other.y);
                        if (dist < u.range && dist < targetDist) {
                            target = { type: 'unit', unit: other, index: j, dist: dist };
                            targetDist = dist;
                        }
                    }
                }
            } else {
                // Враг атакует башню игрока (внизу)
                const tower = CONFIG.GAME.towers.player;
                const distToTower = Math.hypot(u.x - tower.x, u.y - tower.y);
                if (distToTower < u.range && GameState.playerTowerHP > 0) {
                    target = { type: 'tower', dist: distToTower };
                    targetDist = distToTower;
                }
                
                // Поиск игроков
                for (let j = 0; j < units.length; j++) {
                    const other = units[j];
                    if (other.isPlayer) {
                        const dist = Math.hypot(u.x - other.x, u.y - other.y);
                        if (dist < u.range && dist < targetDist) {
                            target = { type: 'unit', unit: other, index: j, dist: dist };
                            targetDist = dist;
                        }
                    }
                }
            }
            
            // Атака
            if (target && u.attackTimer <= 0) {
                u.attackTimer = 1.0; // 1 атака в секунду
                
                if (target.type === 'tower') {
                    if (u.isPlayer) {
                        GameState.enemyTowerHP = Math.max(0, GameState.enemyTowerHP - u.damage);
                        QA.log(`${u.type} hits enemy tower for ${u.damage}`);
                    } else {
                        GameState.playerTowerHP = Math.max(0, GameState.playerTowerHP - u.damage);
                        QA.log(`${u.type} hits player tower for ${u.damage}`);
                    }
                    SoundFX.playHit();
                } else if (target.unit) {
                    target.unit.hp -= u.damage;
                    QA.log(`${u.type} hits ${target.unit.type} for ${u.damage}`);
                    SoundFX.playHit();
                }
            }
            
            // ДВИЖЕНИЕ: игроки идут вверх (уменьшаем Y), враги идут вниз (увеличиваем Y)
            if (!target || (target.type === 'unit' && target.unit.hp <= 0)) {
                if (u.isPlayer) {
                    // Игрок идет ВВЕРХ (к вражеской башне)
                    u.y -= u.speed * delta;
                    // Ограничиваем, чтобы не улетел за башню
                    if (u.y < 40) u.y = 40;
                } else {
                    // Враг идет ВНИЗ (к башне игрока)
                    u.y += u.speed * delta;
                    // Ограничиваем, чтобы не улетел за башню
                    if (u.y > CONFIG.GAME.height - 40) u.y = CONFIG.GAME.height - 40;
                }
            }
        }
        
        // Удаление мертвых юнитов
        GameState.removeDeadUnits();
        
        // Проверка победы
        if (GameState.enemyTowerHP <= 0) {
            GameState.endBattle('player');
            QA.log('VICTORY!');
        } else if (GameState.playerTowerHP <= 0) {
            GameState.endBattle('enemy');
            QA.log('DEFEAT!');
        }
    },
    
    gameLoop: function() {
        const now = performance.now() / 1000;
        let delta = Math.min(0.033, now - this.lastTime);
        this.lastTime = now;
        
        if (GameState.isActive) {
            GameState.updateElixir(now);
            this.updateUnits(delta);
            AI.update(now);
        }
        
        // Отрисовка
        const ctx = Graphics.ctx;
        Graphics.drawArena();
        Graphics.drawPlayerTower();
        Graphics.drawEnemyTower();
        Graphics.drawKingTower(true);
        Graphics.drawKingTower(false);
        
        const units = GameState.getUnits();
        for (let i = 0; i < units.length; i++) {
            Graphics.drawUnit(units[i]);
        }
        
        Graphics.drawUI();
        
        requestAnimationFrame(() => this.gameLoop());
    }
};