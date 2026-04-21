// ============================================================
// СОСТОЯНИЕ - данные игры TEAM-Game state 82v(Вадим)
// ============================================================

class GameState {
    constructor() {
        this.isActive = false;
        this.playerElixir = 5;     // Эликсир игрока
        this.aiElixir = 5;         // Эликсир ИИ
        this.units = [];
        this.towers = {
            playerLeft: null,
            playerRight: null,
            playerKing: null,
            enemyLeft: null,
            enemyRight: null,
            enemyKing: null
        };
        this.lastElixirTime = 0;
        this.selectedCardIndex = 0;
        // Добавить в конструктор GameState:
        this.selectedCard = null; // Выбранная карта для размещен
    }

    selectCard(card) {
        this.selectedCard = card;
    }

    clearSelectedCard() {
        this.selectedCard = null;
    }
    
    startBattle() {
        this.isActive = true;
        this.playerElixir = window.CONFIG.GAME.startElixir;
        this.aiElixir = window.CONFIG.GAME.startElixir;
        this.units = [];
        this.lastPlayerElixirTime = performance.now() / 1000;
        this.lastAIElixirTime = performance.now() / 1000;
        
        // Инициализация башен
        const towerConfig = window.CONFIG.GAME.towers;
        this.towers.playerLeft = new Tower(towerConfig.playerLeft.x, towerConfig.playerLeft.y, true, 'left')
        this.towers.playerRight = new Tower(towerConfig.playerRight.x, towerConfig.playerRight.y, true, 'right');
        this.towers.playerKing = new Tower(towerConfig.playerKing.x, towerConfig.playerKing.y, true, 'king');
        this.towers.enemyLeft = new Tower(towerConfig.enemyLeft.x, towerConfig.enemyLeft.y, false, 'left');
        this.towers.enemyRight = new Tower(towerConfig.enemyRight.x, towerConfig.enemyRight.y, false, 'right');
        this.towers.enemyKing = new Tower(towerConfig.enemyKing.x, towerConfig.enemyKing.y, false, 'king');
        
        console.log('⚔️ Битва началась!');
    }
    
    updateElixir(now, isPlayer = true) {
        if (!this.isActive) return;
        
        if (isPlayer) {
            const delta = now - this.lastPlayerElixirTime;
            if (delta >= window.CONFIG.GAME.elixirRegenRate) {
                this.playerElixir = Math.min(this.playerElixir + 1, window.CONFIG.GAME.maxElixir);
                this.lastPlayerElixirTime = now;
            }
        } else {
            const delta = now - this.lastAIElixirTime;
            if (delta >= window.CONFIG.GAME.elixirRegenRate) {
                this.aiElixir = Math.min(this.aiElixir + 1, window.CONFIG.GAME.maxElixir);
                this.lastAIElixirTime = now;
            }
        }
    }
    
    canDeploy(cost, isPlayer = true) {
        const elixir = isPlayer ? this.playerElixir : this.aiElixir;
        return this.isActive && elixir >= cost;
    }

    spendElixir(cost, isPlayer = true) {
        if (isPlayer) {
            this.playerElixir -= cost;
        } else {
            this.aiElixir -= cost;
        }
    }
    
    deployUnit(unit, isPlayer = true) {
        const cost = unit.card ? unit.card.cost : window.CONFIG.CARDS[unit.type].cost;
        
        if (!this.canDeploy(cost, isPlayer)) {
            return false;
        }
        
        this.units.push(unit);
        this.spendElixir(cost, isPlayer);
        return true;
    }
    
    removeDeadUnits() {
        this.units = this.units.filter(unit => unit.hp > 0);
    }
    
    getUnits() {
        return this.units;
    }
    
    getTower(towerId) {
        return this.towers[towerId];
    }
    
    getAllTowers() {
        return Object.values(this.towers);
    }
    
    damageTower(tower, damage) {
        tower.hp = Math.max(0, tower.hp - damage);
        
        if (tower.hp <= 0) {
            console.log(`🏰 Башня ${tower.side} ${tower.position} разрушена!`);
        }
        
        return tower.hp <= 0;
    }
    
    checkVictory() {
        const allEnemyTowersDead = 
            this.towers.enemyLeft.hp <= 0 &&
            this.towers.enemyRight.hp <= 0 &&
            this.towers.enemyKing.hp <= 0;
        
        const allPlayerTowersDead = 
            this.towers.playerLeft.hp <= 0 &&
            this.towers.playerRight.hp <= 0 &&
            this.towers.playerKing.hp <= 0;
        
        if (allEnemyTowersDead) {
            this.endBattle('player');
            return 'player';
        }
        if (allPlayerTowersDead) {
            this.endBattle('enemy');
            return 'enemy';
        }
        return null;
    }
    
    endBattle(winner) {
        this.isActive = false;
        console.log(`🏆 Победитель: ${winner === 'player' ? 'ИГРОК' : 'ВРАГ'}!`);
        
        if (winner === 'player' && window.SoundFX) {
            window.SoundFX.playVictory();
        } else if (window.SoundFX) {
            window.SoundFX.playDefeat();
        }
    }
    
    getActiveTowerForUnit(unit) {
        // Возвращает ближайшую активную башню на дорожке юнита
        const lane = unit.lane;
        const isEnemy = !unit.isPlayer;
        
        if (isEnemy) {
            if (this.towers.playerLeft.hp > 0 && lane === 'left') return this.towers.playerLeft;
            if (this.towers.playerRight.hp > 0 && lane === 'right') return this.towers.playerRight;
            return this.towers.playerKing;
        } else {
            if (this.towers.enemyLeft.hp > 0 && lane === 'left') return this.towers.enemyLeft;
            if (this.towers.enemyRight.hp > 0 && lane === 'right') return this.towers.enemyRight;
            return this.towers.enemyKing;
        }
    }

    /**
     * Проверяет, может ли игрок разместить юнита в указанной позиции
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {string} lane - Дорожка
     * @returns {boolean}
     */
    canPlaceAt(x, y, lane) {
        // Проверка, что позиция на своей половине поля
        if (y < window.CONFIG.GAME.height / 2) {
            return false;
        }
        
        // Проверка, что позиция на правильной дорожке
        const isLeftLane = (lane === 'left' && x < window.CONFIG.GAME.width / 2);
        const isRightLane = (lane === 'right' && x > window.CONFIG.GAME.width / 2);
        
        if (!isLeftLane && !isRightLane && lane !== 'king') {
            return false;
        }
        
        return true;
    }
}

window.GameState = null;