// ============================================================
// ui.js - Обработка пользовательского ввода (ОБНОВЛЕНО)
// ============================================================

class UI {
    constructor(canvas, gameState, deck) {
        this.canvas = canvas;
        this.gameState = gameState;
        this.deck = deck;
        this.selectedCardIndex = 0;
        this.setupEventListeners();
        this.setupResetButton();
        this.isPlacingMode = false; // Режим размещения юнита
    }
    
    setupEventListeners() {
        // Клик по канвасу для призыва юнита (ТОЛЬКО если выбран активный режим)
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameState.isActive) return;
            
            // Если не в режиме размещения - ничего не делаем
            if (!this.isPlacingMode) return;
            
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
        
        // Убираем старую обработку цифр, теперь выбор через клик по картам
        // Карты теперь кликабельны на canvas
    }
    
    // Новый метод: обработка клика по карте в руке
    // В методе handleCardClick добавьте в начало:
handleCardClick(index, card) {
    console.log('=== handleCardClick called ===');
    console.log('Card:', card.name, 'Cost:', card.cost);
    console.log('Game active:', this.gameState.isActive);
    console.log('Current elixir:', this.gameState.elixir);
    
    if (!this.gameState.isActive) {
        console.log('Game not active');
        return;
    }
    
    if (!this.gameState.canDeploy(card.cost)) {
        console.log(`❌ Не хватает эликсира! Нужно ${card.cost}, есть ${Math.floor(this.gameState.elixir)}`);
        if (window.Effects) {
            window.Effects.screenFlash('255,0,0', 0.2);
        }
        return;
    }
    
    // Выбираем карту и активируем режим размещения
    this.selectedCardIndex = this.deck.hand.indexOf(card);
    this.isPlacingMode = true;
    this.gameState.selectedCardIndex = this.selectedCardIndex;
    
    console.log(`🃏 Выбрана карта ${card.name} (${card.cost}⚡). Режим размещения: ${this.isPlacingMode}`);
    
    if (this.placementTimeout) clearTimeout(this.placementTimeout);
    this.placementTimeout = setTimeout(() => {
        this.isPlacingMode = false;
        console.log('⏰ Режим размещения отменен');
    }, 5000);
}
    
    setupResetButton() {
        const btnReset = document.getElementById('btnReset');
        if (btnReset) {
            btnReset.onclick = () => {
                this.gameState.startBattle();
                if (this.deck) this.deck.resetCycle();
                this.selectedCardIndex = 0;
                this.isPlacingMode = false;
                console.log('🔄 Новая битва!');
            };
        }
    }
    
    deployAtPosition(x, y) {
        const card = this.deck.getCard(this.selectedCardIndex);
        if (!card) {
            console.log('❌ Нет карты в этой позиции');
            this.isPlacingMode = false;
            return;
        }
        
        if (!this.gameState.canDeploy(card.cost)) {
            console.log(`❌ Не хватает эликсира! Нужно ${card.cost}, есть ${Math.floor(this.gameState.elixir)}`);
            this.isPlacingMode = false;
            return;
        }
        
        // Определяем дорожку по позиции X
        const lane = x < window.CONFIG.GAME.width / 2 ? 'left' : 'right';
        
        // Корректируем Y для правильного положения на дорожке
        let finalY = y;
        if (lane === 'left') {
            finalY = Math.max(window.CONFIG.GAME.height / 2 + 50, Math.min(window.CONFIG.GAME.height - 100, y));
        } else {
            finalY = Math.max(window.CONFIG.GAME.height / 2 + 50, Math.min(window.CONFIG.GAME.height - 100, y));
        }
        
        // Создаем юнита
        const unit = new Unit(
            x, finalY, 
            card.unitType, 
            true,  // isPlayer
            lane,
            card  // ссылка на карту
        );
        
        if (this.gameState.deployUnit(unit)) {
            // Используем карту (удаляем из руки, добавляем в конец колоды)
            this.deck.useCard(this.selectedCardIndex);
            
            // Выходим из режима размещения
            this.isPlacingMode = false;
            if (this.placementTimeout) clearTimeout(this.placementTimeout);
            
            if (window.SoundFX) window.SoundFX.playDeploy();
            console.log(`✅ Призван ${card.name} (${card.cost}⚡) на ${lane} дорожку`);
        } else {
            this.isPlacingMode = false;
        }
    }
    
    updateSelectedCard(index) {
        this.selectedCardIndex = index;
        if (this.gameState) {
            this.gameState.selectedCardIndex = index;
        }
    }
    
    // Новый метод для отмены режима размещения
    cancelPlacement() {
        this.isPlacingMode = false;
        if (this.placementTimeout) clearTimeout(this.placementTimeout);
        console.log('❌ Режим размещения отменен');
    }
}

window.UI = null;
