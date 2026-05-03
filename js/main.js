// ============================================================
// main.js - Точка входа в игру (с мобильной адаптацией)
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Clash Royale - Stage 1 (Mobile Ready)');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    // Устанавливаем логические размеры canvas (не меняются)
    canvas.width = window.CONFIG.GAME.width;
    canvas.height = window.CONFIG.GAME.height;
    const ctx = canvas.getContext('2d');
    
    // Инициализация адаптации под экран
    const responsive = new ResponsiveManager(canvas);
    window.responsive = responsive;
    
    // Инициализация эффектов
    if (window.Effects) {
        window.Effects.init(ctx);
    }
    
    // Создание и запуск ядра игры
    const core = new Core(canvas, ctx);
    await core.init();
    
    window.gameCore = core;
    window.gameState = core.gameState;
    window.gameGraphics = core.graphics;
    
    console.log('🎮 Игра запущена!');
    
    // ===== УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК КЛИКОВ (мышь и тач) =====
    const handleInteraction = (clientX, clientY) => {
        if (!core.gameState.isActive) return;
        
        // Преобразуем координаты экрана в координаты canvas
        const canvasCoords = responsive.screenToCanvas(clientX, clientY);
        const clickX = canvasCoords.x;
        const clickY = canvasCoords.y;
        
        // Проверяем, что клик в пределах canvas
        if (clickX < 0 || clickX > canvas.width || clickY < 0 || clickY > canvas.height) return;
        
        // Проверяем клик по картам
        const cardAreas = core.graphics.getCardAreas();
        for (let area of cardAreas) {
            if (clickX >= area.x && clickX <= area.x + area.width &&
                clickY >= area.y && clickY <= area.y + area.height) {
                core.ui.handleCardClick(area.index, area.card);
                return;
            }
        }
        
        // Если в режиме размещения - призываем юнита
        if (core.ui.isPlacingMode && clickY > window.CONFIG.GAME.height / 2) {
            core.ui.deployAtPosition(clickX, clickY);
        }
    };
    
    // Обработка мыши (ПК)
    canvas.addEventListener('mousedown', (e) => {
        e.preventDefault();
        handleInteraction(e.clientX, e.clientY);
    });
    
    // Обработка касаний (мобильные)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            handleInteraction(touch.clientX, touch.clientY);
        }
    });
    
    // Запрещаем контекстное меню на canvas
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Кнопка сброса
    const btnReset = document.getElementById('btnReset');
    if (btnReset) {
        btnReset.onclick = () => {
            core.gameState.startBattle();
            core.deck.resetCycle();
            core.ui.selectedCardIndex = 0;
            core.ui.isPlacingMode = false;
            if (core.ui.placementTimeout) clearTimeout(core.ui.placementTimeout);
            if (window.Effects) window.Effects.clear();
            console.log('🔄 Новая битва!');
        };
    }
    
    // Обработка изменения ориентации экрана
    window.addEventListener('resize', () => {
        responsive.setup();
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => responsive.setup(), 100);
    });
});