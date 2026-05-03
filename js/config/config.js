// ============================================================
// config.js - Конфигурация игры
// ============================================================

window.CONFIG = {
    IMAGES: {
        path: 'assets/images/arena/path.png',
        grass: 'assets/images/arena/grass.png',
        river: 'assets/images/arena/river.png',
        knight: 'assets/images/units/knight.png',
        archer: 'assets/images/units/archer.png',
        mage: 'assets/images/units/mage.png',
        playerTower: 'assets/images/towers/player_tower.png',
        enemyTower: 'assets/images/towers/enemy_tower.png',
        kingTower: 'assets/images/towers/king_tower.png',
        kingEnemyTower: 'assets/images/towers/king_enemy_tower.png',
        playerTowerDestroyed: 'assets/images/towers/player_tower_destroyed.png',
        enemyTowerDestroyed: 'assets/images/towers/enemy_tower_destroyed.png'
    },
    
    SOUNDS: {
        deploy: 'assets/sounds/click.mp3',
        hit: 'assets/sounds/click.mp3',
        towerHit: 'assets/sounds/click.mp3',  
        victory: 'assets/sounds/victory.mp3',
        defeat: 'assets/sounds/defeat.mp3',
        cardSelect: 'assets/sounds/card-select.mp3',
        insufficient: 'assets/sounds/error.mp3',
        towerDestroyed: 'assets/sounds/tower-down.mp3'
    },
    GAME: {
        width: 800,
        height: 500,
        maxElixir: 10,
        startElixir: 5,
        elixirRegenRate: 2.8, // секунды на 1 эликсир

            // Мобильные настройки
        mobile: {
            cardScale: 0.8,      // Уменьшение карт на мобилках
            uiScale: 0.9,        // Масштаб UI
            touchDeadzone: 15    // Мертвая зона для касаний
        },
        
        towers: {
            playerLeft: { x: 200, y: 420, maxHp: 1500, damage: 50, range: 100 },
            playerRight: { x: 700, y: 420, maxHp: 1500, damage: 50, range: 100 },
            playerKing: { x: 450, y: 480, maxHp: 3000, damage: 70, range: 120 },
            enemyLeft: { x: 200, y: 180, maxHp: 1500, damage: 50, range: 100 },
            enemyRight: { x: 700, y: 180, maxHp: 1500, damage: 50, range: 100 },
            enemyKing: { x: 450, y: 120, maxHp: 3000, damage: 70, range: 120 }
        }
    },
    
    CARDS: {
        knight: {
            name: 'Рыцарь',
            cost: 1,
            unitType: 'knight',
            hp: 600,
            damage: 75,
            range: 30,
            speed: 2,
            attackSpeed: 0.9,
            description: 'Сбалансированный боец ближнего боя',
            rarity: 'common'
        },
        archer: {
            name: 'Лучница',
            cost: 3,
            unitType: 'archer',
            hp: 400,
            damage: 60,
            range: 150,
            speed: 1,
            attackSpeed: 1.0,
            description: 'Атакует с расстояния',
            rarity: 'common'
        },
        mage: {
            name: 'Маг',
            cost: 4,
            unitType: 'mage',
            hp: 350,
            damage: 120,
            range: 160,
            speed: 3,
            attackSpeed: 1.2,
            description: 'Мощная магическая атака',
            rarity: 'rare'
        }
    }
};

