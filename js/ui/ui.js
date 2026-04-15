// ============================================================
// ui.js - Обработка пользовательского ввода
// ============================================================

class UI {
    constructor(canvas, gameState, deck) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.deck = deck;
        this.selectedCardIndex = 0;
        this.setupEventListeners();
        this.setupResetButton();
    }
    
    setupEventListeners() {
        // Клик по канвасу для призыва юнита
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameState.isActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;
            
            // Проверяем, что клик на нижней половине (игрок может ставить только на своей стороне)
            if (canvasY > window.CONFIG.GAME.height / 2) {
                this.deployAtPosition(canvasX, canvasY);
            }
        });
        
        // Выбор карты цифрами 1-4
        document.addEventListener('keydown', (e) => {
            const key = parseInt(e.key);
            if (key >= 1 && key <= 4) {
                this.selectedCardIndex = key - 1;
                if (this.gameState) {
                    this.gameState.selectedCardIndex = this.selectedCardIndex;
                }
                console.log(`🃏 Выбрана карта ${this.selectedCardIndex + 1}`);
            }
        });
    }
    
    setupResetButton() {
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.onclick = () => {
                this.gameState.startBattle();
                if (this.deck) this.deck.resetCycle();
                this.selectedCardIndex = 0;
                console.log('🔄 Новая битва!');
            };
        }
    }
    
    deployAtPosition(x, y) {
        const card = this.deck.getCard(this.selectedCardIndex);
        if (!card) {
            console.log('❌ Нет карты в этой позиции');
            return;
        }
        
        if (!this.gameState.canDeploy(card.cost)) {
            console.log(`❌ Не хватает эликсира! Нужно ${card.cost}, есть ${Math.floor(this.gameState.elixir)}`);
            return;
        }
        
        // Определяем дорожку по позиции X
        const lane = x < window.CONFIG.GAME.width / 2 ? 'left' : 'right';
        
        // Создаем юнита
        const unit = new Unit(
            x, y, 
            card.unitType, 
            true,  // isPlayer
            lane,
            card  // ссылка на карту
        );
        
        if (this.gameState.deployUnit(unit)) {
            // Используем карту (удаляем из руки, добавляем в конец колоды)
            this.deck.useCard(this.selectedCardIndex);
            
            if (window.SoundFX) window.SoundFX.playDeploy();
            console.log(`✅ Призван ${card.name} (${card.cost}⚡) на ${lane} дорожку`);
        }
    }
    
    updateSelectedCard(index) {
        this.selectedCardIndex = index;
        if (this.gameState) {
            this.gameState.selectedCardIndex = index;
        }
    }
}

window.UI = null;