// AI - противник
window.AI = {
    lastDeployTime: 0,
    deployDelay: 2.5, // секунды между спавнами
    
    update: function(now) {
        if (!GameState.isActive) return;
        
        if (this.lastDeployTime === 0) {
            this.lastDeployTime = now;
            return;
        }
        
        // Проверяем время для спавна
        if (now - this.lastDeployTime >= this.deployDelay) {
            // Выбираем случайного юнита
            const types = ['knight', 'archer', 'mage'];
            const type = types[Math.floor(Math.random() * 3)];
            const cost = CONFIG.GAME.units[type].cost;
            
            // Проверяем эликсир
            if (GameState.elixir >= cost) {
                // Создаем юнита на вражеской стороне (вверху)
                const x = CONFIG.GAME.spawn.minX + Math.random() * (CONFIG.GAME.spawn.maxX - CONFIG.GAME.spawn.minX);
                const stats = CONFIG.GAME.units[type];
                
                const unit = {
                    x: x,
                    y: CONFIG.GAME.spawn.enemyY, // 60 - вверху
                    type: type,
                    isPlayer: false,
                    hp: stats.hp,
                    maxHp: stats.hp,
                    damage: stats.damage,
                    range: stats.range,
                    speed: stats.speed,
                    attackTimer: 0
                };
                
                // Тратим эликсир через GameState
                if (GameState.deployUnit(unit)) {
                    this.lastDeployTime = now;
                    if (window.QA) QA.log(`AI deployed ${type} - Elixir: ${Math.floor(GameState.elixir)}`);
                }
            }
        }
    },
    
    reset: function() {
        this.lastDeployTime = 0;
    }
};