// ИНТЕРФЕЙС - обработка кнопок и кликов
window.UI = {
    canvas: null,
    
    init: function(canvas) {
        this.canvas = canvas;
        
        // Кнопки выбора юнитов
        document.getElementById('btnKnight').onclick = () => {
            GameState.selectedUnit = 'knight';
            console.log('Selected: Knight');
        };
        document.getElementById('btnArcher').onclick = () => {
            GameState.selectedUnit = 'archer';
            console.log('Selected: Archer');
        };
        document.getElementById('btnMage').onclick = () => {
            GameState.selectedUnit = 'mage';
            console.log('Selected: Mage');
        };
        
        // Кнопка сброса
        document.getElementById('btnReset').onclick = () => {
            GameState.startBattle();
        };
        
        // Клик для спавна
        this.canvas.addEventListener('click', (e) => {
            if (!GameState.isActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (CONFIG.GAME.width / rect.width);
            const y = (e.clientY - rect.top) * (CONFIG.GAME.height / rect.height);
            
            if (y > CONFIG.GAME.height / 2) {
                console.log(`Click at (${Math.floor(x)}, ${Math.floor(y)}) - deploy here`);
            }
        });
    }
};