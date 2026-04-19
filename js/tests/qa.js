/**
 * Глобальный объект QA (Quality Assurance) для тестирования и мониторинга состояния игры.
 * Предоставляет инструменты для логирования, проверки инициализации систем и анализа игрового поля.
 */
window.QA = {
    /**
     * Выводит форматированное сообщение в консоль с указанием текущего времени.
     * @param {string} msg - Сообщение для логирования.
     */
    log: function(msg) {
        console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
    },
    
    /**
     * Основная функция тестирования систем.
     * Проверяет наличие глобальных объектов (модулей) и состояние ключевых игровых объектов.
     */
    test: function() {
        this.log('=== QA Tests ===');
        
        // Проверка наличия (инициализации) основных модулей игры через приведение к boolean
        this.log('Config loaded: ' + !!window.CONFIG);
        this.log('GameState loaded: ' + !!window.GameState);
        this.log('Graphics loaded: ' + !!window.Graphics);
        this.log('Core loaded: ' + !!window.Core);
        this.log('SoundFX loaded: ' + !!window.SoundFX);
        
        /**
         * Проверка целостности башен игрока. 
         * Условие пройдено, если у всех трех башен HP > 0.
         */
        this.log('Player towers: ' + 
            (GameState.playerLeftTowerHP > 0 && 
             GameState.playerRightTowerHP > 0 && 
             GameState.playerKingTowerHP > 0));
        
        /**
         * Проверка аудиосистемы.
         * Сравнивает количество реально загруженных звуков с количеством, описанным в конфиге.
         */
        if (window.SoundFX && window.SoundFX.sounds) {
            const loadedSounds = Object.keys(window.SoundFX.sounds).length;
            this.log(`Sounds loaded: ${loadedSounds}/${Object.keys(CONFIG.SOUNDS).length}`);
        }
        
        this.log('All systems ready!');
    },
    
    /**
     * Анализирует распределение юнитов по линиям (левая/правая).
     * @returns {Object} Объект с количеством юнитов на каждой линии { left, right }.
     */
    testLanes: function() {
        this.log('=== Lane Test ===');
        const units = GameState.getUnits();
        
        // Фильтрация массива юнитов по свойству lane
        const leftUnits = units.filter(u => u.lane === 'left').length;
        const rightUnits = units.filter(u => u.lane === 'right').length;
        
        this.log(`Left lane: ${leftUnits} units, Right lane: ${rightUnits} units`);
        return { left: leftUnits, right: rightUnits };
    }
};

/**
 * Автоматический запуск тестирования после полной загрузки DOM-дерева.
 * Сначала проверяет, существует ли объект QA в глобальной области видимости.
 */
document.addEventListener('DOMContentLoaded', () => window.QA && window.QA.test());
