// ГЛАВНЫЙ ЦИКЛ - запуск и отрисовка
(function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    Graphics.init(ctx);
    UI.init(canvas);
    GameState.startBattle();
    
    function render() {
        Graphics.drawArena();
        Graphics.drawPlayerTower();
        Graphics.drawEnemyTower();
        Graphics.drawKingTower(true);
        Graphics.drawKingTower(false);
        Graphics.drawUI();
        
        // Рисуем юнитов
        const units = GameState.getUnits();
        for (let i = 0; i < units.length; i++) {
            Graphics.drawUnit(units[i]);
        }
        
        requestAnimationFrame(render);
    }
    
    render();
    console.log('Stage 1: Game initialized - static graphics ready');
})();