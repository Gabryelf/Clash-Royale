// ============================================================
// ui.js - Обработка пользовательского ввода
// ============================================================

class UI {
    constructor(canvas, gameState, deck) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.deck = deck;
        this.selectedCardIndex = 0;
        this.isPlacingMode = false;
        this.placementTimeout = null;
        this.setupResetButton();
    }
    
    setupResetButton() {
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.onclick = () => {
                this.gameState.startBattle();
                if (this.deck) this.deck.resetCycle();
                this.selectedCardIndex = 0;
                this.isPlacingMode = false;
                if (this.placementTimeout) clearTimeout(this.placementTimeout);
                console.log('🔄 Новая битва!');
            };
        }
    }
    
    handleCardClick(index, card) {
        if (!this.gameState.isActive) {
            console.log('❌ Игра не активна');
            return;
        }
        
        if (!this.gameState.canDeploy(card.cost, true)) {
            console.log(`❌ Не хватает эликсира! Нужно ${card.cost}, есть ${Math.floor(this.gameState.playerElixir)}`);
            if (window.Effects) {
                window.Effects.addInsufficientEffect(0, 0);
            }
            return;
        }
        
        this.selectedCardIndex = index;
        this.isPlacingMode = true;
        
        if (window.Effects) {
            const cardAreas = window.gameGraphics?.getCardAreas();
            if (cardAreas && cardAreas[index]) {
                window.Effects.addCardSelectEffect(cardAreas[index].x, cardAreas[index].y);
            }
        }
        
        console.log(`🃏 Выбрана карта ${card.name} (${card.cost}⚡). Кликните на своей половине поля для призыва.`);
        
        if (this.placementTimeout) clearTimeout(this.placementTimeout);
        this.placementTimeout = setTimeout(() => {
            this.isPlacingMode = false;
            console.log('⏰ Режим размещения отменен (таймаут 5 сек)');
        }, 5000);
    }
    
    deployAtPosition(x, y) {
        const card = this.deck.getCard(this.selectedCardIndex);
        if (!card) {
            console.log('❌ Карта не найдена');
            this.isPlacingMode = false;
            return;
        }
        
        if (!this.gameState.canDeploy(card.cost, true)) {
            console.log(`❌ Не хватает эликсира! Нужно ${card.cost}, есть ${Math.floor(this.gameState.playerElixir)}`);
            this.isPlacingMode = false;
            return;
        }
        
        const lane = x < window.CONFIG.GAME.width / 2 ? 'left' : 'right';
        
        let finalY = y;
        if (lane === 'left') {
            finalY = Math.max(window.CONFIG.GAME.height / 2 + 50, Math.min(window.CONFIG.GAME.height - 80, y));
        } else {
            finalY = Math.max(window.CONFIG.GAME.height / 2 + 50, Math.min(window.CONFIG.GAME.height - 80, y));
        }
        
        const unit = new Unit(x, finalY, card.unitType, true, lane, card);
        
        if (this.gameState.deployUnit(unit, true)) {
            this.deck.useCard(this.selectedCardIndex);
            this.isPlacingMode = false;
            if (this.placementTimeout) clearTimeout(this.placementTimeout);
            
            if (window.SoundFX) window.SoundFX.playDeploy();
            if (window.Effects) window.Effects.addDeployEffect(x, finalY);
            
            console.log(`✅ Призван ${card.name} на ${lane} дорожку за ${card.cost}⚡`);
        } else {
            console.log(`❌ Не удалось призвать ${card.name}`);
            this.isPlacingMode = false;
        }
    }
    
    cancelPlacement() {
        this.isPlacingMode = false;
        if (this.placementTimeout) clearTimeout(this.placementTimeout);
        console.log('❌ Режим размещения отменен');
    }
}

window.UI = UI;