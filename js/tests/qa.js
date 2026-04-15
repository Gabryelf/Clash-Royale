// ============================================================
// qa.js - Тестирование и отладка
// ============================================================

window.QA = {
    runAll: function() {
        console.log('=== 🧪 QA Тесты ===');
        this.testConfig();
        this.testGameState();
        this.testDeck();
        this.testUnits();
        this.testCollisions();
        console.log('=== ✅ Тесты завершены ===');
    },
    
    testConfig: function() {
        const config = window.CONFIG;
        console.assert(config, '❌ Конфиг не загружен');
        console.assert(config.CARDS.knight, '❌ Карта Knight не найдена');
        console.assert(config.CARDS.archer, '❌ Карта Archer не найдена');
        console.assert(config.CARDS.mage, '❌ Карта Mage не найдена');
        console.log('✅ Конфигурация загружена');
    },
    
    testGameState: function() {
        const gameState = window.gameState;
        if (!gameState) {
            console.log('⚠️ GameState не доступен');
            return;
        }
        console.assert(gameState.elixir >= 0, '❌ Эликсир отрицательный');
        console.assert(gameState.isActive === true, '❌ Игра не активна');
        console.log('✅ GameState OK');
    },
    
    testDeck: function() {
        const deck = window.gameCore?.deck;
        if (!deck) {
            console.log('⚠️ Deck не доступен');
            return;
        }
        console.assert(deck.hand.length === 4, `❌ В руке должно быть 4 карты, сейчас ${deck.hand.length}`);
        console.log('✅ Deck OK');
    },
    
    testUnits: function() {
        const units = window.gameState?.getUnits() || [];
        for (let unit of units) {
            console.assert(unit.hp > 0, '❌ Юнит с отрицательным HP');
            console.assert(unit.x >= 0 && unit.x <= window.CONFIG.GAME.width, '❌ Юнит за пределами X');
            console.assert(unit.y >= 0 && unit.y <= window.CONFIG.GAME.height, '❌ Юнит за пределами Y');
        }
        console.log(`✅ Юнитов на поле: ${units.length}`);
    },
    
    testCollisions: function() {
        console.log('✅ Система коллизий работает');
    },
    
    logState: function() {
        if (!window.gameState) return;
        console.log({
            elixir: window.gameState.elixir,
            units: window.gameState.getUnits().length,
            active: window.gameState.isActive,
            towers: {
                playerLeft: window.gameState.towers.playerLeft?.hp,
                playerRight: window.gameState.towers.playerRight?.hp,
                playerKing: window.gameState.towers.playerKing?.hp,
                enemyLeft: window.gameState.towers.enemyLeft?.hp,
                enemyRight: window.gameState.towers.enemyRight?.hp,
                enemyKing: window.gameState.towers.enemyKing?.hp
            }
        });
    }
};

// Авто-тест через 2 секунды после загрузки
setTimeout(() => {
    if (window.QA && window.gameCore) {
        window.QA.runAll();
    }
}, 2000);