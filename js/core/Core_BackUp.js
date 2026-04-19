// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CORE - основная игровая логика   team - core : @lafneroo  ( Остапчук Андрей )
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Core {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.lastTime = 0;
        this.gameState = null;
        this.graphics = null;
        this.soundFX = null;
        this.ui = null;
        this.ai = null;
        this.deck = null;
        this.animationId = null;
    }
    
    async init() {
        console.log('🎮 Инициализация игры...');
        
        // Инициализация компонентов
        this.graphics = new Graphics(this.ctx);
        this.soundFX = new SoundFX();
        this.gameState = new GameState();
        this.deck = new Deck();
        this.ui = new UI(this.canvas, this.gameState, this.deck);
        this.ai = new AI(this.gameState, this.deck);
        
        // Запуск игры
        this.gameState.startBattle();
        this.lastTime = performance.now() / 1000;
        
        console.log('✅ Игра инициализирована!');
        this.startLoop();
    }
    
    startLoop() {
        const gameLoop = () => {
            const now = performance.now() / 1000;
            let delta = Math.min(0.033, now - this.lastTime);
            this.lastTime = now;
            
            this.update(delta, now);
            this.render();
            
            this.animationId = requestAnimationFrame(gameLoop);
        };
        
        gameLoop();
    }
    
    update(delta, now) {
        if (!this.gameState.isActive) return;
        
        // Обновление эликсира
        this.gameState.updateElixir(now);
        
        // Обновление AI
        this.ai.update(now);
        
        // Обновление юнитов
        const units = this.gameState.getUnits();
        const towers = this.gameState.towers;
        
        for (let i = 0; i < units.length; i++) {
            units[i].update(delta, units, towers);
        }
        
        // Обновление башен
        for (let tower of Object.values(towers)) {
            tower.update(delta, units, this.gameState);
        }
        
        // Удаление мертвых юнитов
        this.gameState.removeDeadUnits();
        
        // Проверка победы
        const winner = this.gameState.checkVictory();
        if (winner && this.gameState.isActive) {
            this.gameState.isActive = false;
        }
    }
    
    render() {
        if (!this.graphics || !this.ctx) return;
        
        // Очистка
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка арены
        this.graphics.drawArena();
        
        // Отрисовка башен
        const towers = this.gameState.towers;
        this.graphics.drawTower(towers.playerLeft, true);
        this.graphics.drawTower(towers.playerRight, true);
        this.graphics.drawKingTower(towers.playerKing);
        this.graphics.drawTower(towers.enemyLeft, false);
        this.graphics.drawTower(towers.enemyRight, false);
        this.graphics.drawKingTower(towers.enemyKing);
        
        // Отрисовка юнитов
        const units = this.gameState.getUnits();
        for (let unit of units) {
            this.graphics.drawUnit(unit);
        }
        
        // Отрисовка UI
        this.graphics.drawUI(this.gameState, this.deck, this.ui.selectedCardIndex);
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

window.Core = null;
