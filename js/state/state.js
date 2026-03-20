// СОСТОЯНИЕ - данные игры
window.GameState = {
    isActive: false,
    elixir: 5,
    playerTowerHP: 1500,
    enemyTowerHP: 1500,
    selectedUnit: 'knight',
    units: [],
    
    startBattle: function() {
        this.isActive = true;
        this.playerTowerHP = 1500;
        this.enemyTowerHP = 1500;
        this.elixir = 5;
        this.units = [];
        console.log('Battle started!');
    },
    
    endBattle: function(winner) {
        this.isActive = false;
        console.log(winner === 'player' ? 'Victory!' : 'Defeat!');
    },
    
    getUnits: function() {
        return this.units;
    }
};