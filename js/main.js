// ============================================================
// main.js - Точка входа в игру (ИСПРАВЛЕНАЯ ВЕРСИЯ)
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Clash Royale - Stage 1');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    // Установка размеров canvas
    canvas.width = window.CONFIG.GAME.width;
    canvas.height = window.CONFIG.GAME.height;
    const ctx = canvas.getContext('2d');
    
    // Инициализация Effects Manager
    if (window.Effects) {
        window.Effects.init(ctx);
    }
    
    // Создание и запуск ядра игры
    const core = new Core(canvas, ctx);
    await core.init();
    
    // Глобальные объекты для доступа из консоли (для отладки)
    window.gameCore = core;
    window.gameState = core.gameState;
    window.gameGraphics = core.graphics;
    
    console.log('🎮 Игра запущена!');
    
    // НЕ вызываем gameState.startBattle() - уже вызвано в core.init()
    // НЕ вызываем core.startLoop() - уже вызвано в core.init()
    
    // Убираем старую функцию render() - используем рендер из Core
    
    // Обработка кликов по картам
    canvas.addEventListener('click', (e) => {
        if (!core.gameState.isActive) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;
        
        // Проверяем клик по картам
        const cardAreas = core.graphics.getCardAreas();
        for (let area of cardAreas) {
            if (clickX >= area.x && clickX <= area.x + area.width &&
                clickY >= area.y && clickY <= area.y + area.height) {
                // Клик по карте
                core.ui.handleCardClick(area.index, area.card);
                e.stopPropagation();
                return;
            }
        }
        
        // Если клик по карте не был обработан, передаем в UI для размещения
        // Но только если мы в режиме размещения
        if (core.ui.isPlacingMode) {
            // Создаем событие для UI
            const rect = canvas.getBoundingClientRect();
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;
            
            // Проверяем, что клик на нижней половине поля
            if (canvasY > window.CONFIG.GAME.height / 2) {
                core.ui.deployAtPosition(canvasX, canvasY);
            }
        }
    });
    
    // Добавляем кнопку сброса, если её нет
    if (!document.getElementById('btnReset')) {
        const btnReset = document.createElement('button');
        btnReset.id = 'btnReset';
        btnReset.textContent = '🔄 Новая битва';
        btnReset.style.position = 'fixed';
        btnReset.style.bottom = '10px';
        btnReset.style.left = '10px';
        btnReset.style.zIndex = '200';
        document.body.appendChild(btnReset);
        btnReset.onclick = () => {
            core.gameState.startBattle();
            core.deck.resetCycle();
            core.ui.selectedCardIndex = 0;
            core.ui.isPlacingMode = false;
            if (core.ui.placementTimeout) clearTimeout(core.ui.placementTimeout);
            console.log('🔄 Новая битва!');
        };
    }
    
    console.log('Stage 3: Complete Clash Royale with lanes, towers, and sounds!');
});