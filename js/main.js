// ============================================================
// main.js - Точка входа в игру
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Clash Royale - Stage 1');
    
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error('❌ Canvas не найден!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Установка размеров canvas
    canvas.width = window.CONFIG.GAME.width;
    canvas.height = window.CONFIG.GAME.height;
    
    // Создание и запуск ядра игры
    const core = new Core(canvas, ctx);
    await core.init();
    
    // Глобальные объекты для доступа из консоли (для отладки)
    window.gameCore = core;
    window.gameState = core.gameState;
    window.gameGraphics = core.graphics;
    
    console.log('🎮 Игра запущена!');
    
    // QA тесты
    if (window.QA) {
        setTimeout(() => window.QA.runAll(), 1000);
    }
});