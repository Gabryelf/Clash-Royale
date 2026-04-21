document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Clash Royale - Stage 1');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    canvas.width = window.CONFIG.GAME.width;
    canvas.height = window.CONFIG.GAME.height;
    const ctx = canvas.getContext('2d');
    
    if (window.Effects) {
        window.Effects.init(ctx);
    }
    
    const core = new Core(canvas, ctx);
    await core.init();
    
    window.gameCore = core;
    window.gameState = core.gameState;
    window.gameGraphics = core.graphics;
    
    console.log('🎮 Игра запущена!');
    
    // ЕДИНЫЙ ОБРАБОТЧИК КЛИКОВ
    canvas.addEventListener('click', (e) => {
        if (!core.gameState.isActive) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        
        console.log(`Click at (${clickX}, ${clickY})`);
        console.log(`isPlacingMode: ${core.ui.isPlacingMode}`);
        
        // Проверяем клик по картам
        const cardAreas = core.graphics.getCardAreas();
        console.log(`Card areas found: ${cardAreas.length}`);
        
        for (let area of cardAreas) {
            if (clickX >= area.x && clickX <= area.x + area.width &&
                clickY >= area.y && clickY <= area.y + area.height) {
                console.log(`Clicked on card: ${area.card.name}`);
                core.ui.handleCardClick(area.index, area.card);
                e.stopPropagation();
                return;
            }
        }
        
        // Если в режиме размещения - пробуем призвать
        if (core.ui.isPlacingMode && clickY > window.CONFIG.GAME.height / 2) {
            console.log(`Deploying at (${clickX}, ${clickY})`);
            core.ui.deployAtPosition(clickX, clickY);
        } else if (core.ui.isPlacingMode) {
            console.log('Click on enemy side - ignoring');
        }
    });
    
    // Кнопка сброса
    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.onclick = () => {
            core.gameState.startBattle();
            core.deck.resetCycle();
            core.ui.selectedCardIndex = 0;
            core.ui.isPlacingMode = false;
            if (core.ui.placementTimeout) clearTimeout(core.ui.placementTimeout);
            console.log('🔄 Новая битва!');
        };
    }
});