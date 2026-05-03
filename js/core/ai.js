// ============================================================
// ai.js - Искусственный интеллект противника
// ============================================================

class AI {
    constructor(gameState, deck) {
        this.gameState = gameState;
        this.deck = deck;
        this.lastDeployTime = 0;
        this.deployDelay = 2.5;
    }

    update(now) {
        if (!this.gameState.isActive) return;

        if (this.lastDeployTime === 0) {
            this.lastDeployTime = now;
            return;
        }

        if (now - this.lastDeployTime >= this.deployDelay) {
            this.makeDecision(now);
        }
    }

    makeDecision(now) {
        const availableCards = this.deck.hand.filter(card =>
            this.gameState.canDeploy(card.cost, false)
        );

        if (availableCards.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];
        const lane = Math.random() < 0.5 ? 'left' : 'right';
        const x = lane === 'left' ? 150 : window.CONFIG.GAME.width - 150;
        const y = 80;

        const unit = new Unit(x, y, card.unitType, false, lane, card);

        if (this.gameState.deployUnit(unit, false)) {
            this.lastDeployTime = now;
            console.log(`🤖 AI призвал ${card.name} на ${lane} дорожку за ${card.cost}⚡`);
            if (window.SoundFX) window.SoundFX.playDeploy();
        }
    }

    reset() {
        this.lastDeployTime = 0;
    }
}

window.AI = AI;