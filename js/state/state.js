// ============================================================
// СОСТОЯНИЕ - данные игры
// ============================================================

class GameState {
    constructor() {
        this.isActive = false;
        this.playerElixir = 5;
        this.aiElixir = 5;
        this.units = [];
        this.towers = {
            playerLeft: null,
            playerRight: null,
            playerKing: null,
            enemyLeft: null,
            enemyRight: null,
            enemyKing: null
        };
        this.lastPlayerElixirTime = 0;
        this.lastAIElixirTime = 0;
        this.selectedCardIndex = 0;
        this.selectedCard = null;
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
        const now = performance.now() / 1000;
        this.lastPlayerElixirTime = now;
        this.lastAIElixirTime = now;
        
        const towerConfig = window.CONFIG.GAME.towers;
        this.towers.playerLeft = new Tower(towerConfig.playerLeft.x, towerConfig.playerLeft.y, true, 'left');
        this.towers.playerRight = new Tower(towerConfig.playerRight.x, towerConfig.playerRight.y, true, 'right');
        this.towers.playerKing = new Tower(towerConfig.playerKing.x, towerConfig.playerKing.y, true, 'king');
        this.towers.enemyLeft = new Tower(towerConfig.enemyLeft.x, towerConfig.enemyLeft.y, false, 'left');
        this.towers.enemyRight = new Tower(towerConfig.enemyRight.x, towerConfig.enemyRight.y, false, 'right');
        this.towers.enemyKing = new Tower(towerConfig.enemyKing.x, towerConfig.enemyKing.y, false, 'king');
        
        console.log('⚔️ Битва началась!');
    }
    
    updateElixir(now) {
        if (!this.isActive) return;
        
        const playerDelta = now - this.lastPlayerElixirTime;
        if (playerDelta >= window.CONFIG.GAME.elixirRegenRate) {
            this.playerElixir = Math.min(this.playerElixir + 1, window.CONFIG.GAME.maxElixir);
            this.lastPlayerElixirTime = now;
        }
        
        const aiDelta = now - this.lastAIElixirTime;
        if (aiDelta >= window.CONFIG.GAME.elixirRegenRate) {
            this.aiElixir = Math.min(this.aiElixir + 1, window.CONFIG.GAME.maxElixir);
            this.lastAIElixirTime = now;
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
        console.log(`📯 Призван ${unit.type} (${cost}⚡), игрок:${isPlayer}, всего юнитов: ${this.units.length}`);
        return true;
    }
    
    removeDeadUnits() {
        const before = this.units.length;
        this.units = this.units.filter(unit => unit.hp > 0);
        if (before !== this.units.length) {
            console.log(`💀 Удалено мертвых юнитов: ${before - this.units.length}`);
        }
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
            if (window.Effects) {
                window.Effects.addTowerDestroyedEffect(tower.x, tower.y);
            }
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
        console.log(`🏆 ПОБЕДА! ${winner === 'player' ? 'ИГРОК' : 'ВРАГ'} выиграл битву!`);
        
        if (winner === 'player' && window.SoundFX) {
            window.SoundFX.playVictory();
        } else if (window.SoundFX) {
            window.SoundFX.playDefeat();
        }
    }

    canPlaceAt(x, y, lane) {
        if (y < window.CONFIG.GAME.height / 2) {
            return false;
        }
        
        const isLeftLane = (lane === 'left' && x < window.CONFIG.GAME.width / 2);
        const isRightLane = (lane === 'right' && x > window.CONFIG.GAME.width / 2);
        
        if (!isLeftLane && !isRightLane && lane !== 'king') {
            return false;
        }
        
        return true;
    }
}

window.GameState = GameState;