// КОНФИГУРАЦИЯ - данные для всей игры
window.CONFIG = {
    // Пути к изображениям
    IMAGES: {
        knight: 'assets/images/knight.png',
        archer: 'assets/images/archer.png',
        mage: 'assets/images/mage.png',
        playerTower: 'assets/images/player_tower.png',
        enemyTower: 'assets/images/enemy_tower.png',
        kingTower: 'assets/images/king_tower.png'
    },
    
    // Игровые параметры
    GAME: {
        width: 900,
        height: 600,
        maxElixir: 10,
        startElixir: 5,
        
        // Статы юнитов
        units: {
            knight: { cost: 3, name: 'Knight' },
            archer: { cost: 3, name: 'Archer' },
            mage: { cost: 4, name: 'Mage' }
        },
        
        // Позиции башен
        towers: {
            player: { x: 450, y: 540 },
            enemy: { x: 450, y: 60 }
        }
    }
};