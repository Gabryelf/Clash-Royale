// ============================================================
// ai.js - Искусственный интеллект противника
// ============================================================

class AI {
    constructor(gameState, deck) {
        this.gameState = gameState;
        this.deck = deck;
        this.lastDeployTime = 0;
        this.deployDelay = 3.0; // секунды
        this.lastDecisionTime = 0;
    }
    
    update(now) {
        if (!this.gameState.isActive) return;
        
        if (this.lastDeployTime === 0) {
            this.lastDeployTime = now;
            return;
        }
        
        // Проверяем время для спавна
        if (now - this.lastDeployTime >= this.deployDelay) {
            this.makeDecision(now);
        }
    }
    
    makeDecision(now) {
        // Получаем доступные карты в руке
        const availableCards = this.deck.hand.filter(card => 
            this.gameState.canDeploy(card.cost)
        );
        
        if (availableCards.length === 0) return;
        
        // Выбираем случайную карту из доступных
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];
        
        // Выбираем дорожку (рандомно или с учетом угроз)
        const lane = Math.random() < 0.5 ? 'left' : 'right';
        
        // Позиция спавна (на вражеской стороне, вверху)
        const x = lane === 'left' ? 150 : window.CONFIG.GAME.width - 150;
        const y = 80; // Верхняя часть арены
        
        // Создаем юнита
        const unit = new Unit(
            x, y,
            card.unitType,
            false, // isPlayer = false (враг)
            lane,
            card
        );
        
        if (this.gameState.deployUnit(unit)) {
            this.lastDeployTime = now;
            console.log(`🤖 AI призвал ${card.name} на ${lane} дорожку`);
            
            if (window.SoundFX) window.SoundFX.playDeploy();
        }
    }
    
    reset() {
        this.lastDeployTime = 0;
        this.lastDecisionTime = 0;
    }
}

window.AI = null;