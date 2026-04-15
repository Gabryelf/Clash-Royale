// КОНФИГУРАЦИЯ - данные для всей игры
window.CONFIG = {
    // Пути к изображениям
    IMAGES: {
        path: 'assets/images/arena/path.png',
        grass: 'assets/images/arena/grass.png',
        river: 'assets/images/arena/river.png',
        knight: 'assets/images/units/knight.png',
        archer: 'assets/images/units/archer.png',
        mage: 'assets/images/units/mage.png',
        playerTower: 'assets/images/towers/player_tower.png',
        enemyTower: 'assets/images/towers/enemy_tower.png',
        kingTower: 'assets/images/towers/king_tower.png'
    },

    SOUNDS: {
        deploy: 'assets/sounds/silent-short-click.mp3',
        hit: 'assets/sounds/silent-short-click.mp3',
        towerHit: 'assets/sounds/silent-short-click.mp3',
        victory: 'assets/sounds/silent-short-click.mp3',
        defeat: 'assets/sounds/silent-short-click.mp3'
    },
    
    GAME: {
        width: 900,
        height: 600,
        maxElixir: 10,
        startElixir: 5,
        elixirRegenRate: 2.8, // секунды на 1 эликсир
        
        towers: {
            playerLeft: { x: 150, y: 450, maxHp: 1500, damage: 50, range: 100 },
            playerRight: { x: 750, y: 450, maxHp: 1500, damage: 50, range: 100 },
            playerKing: { x: 450, y: 500, maxHp: 3000, damage: 70, range: 120 },
            enemyLeft: { x: 150, y: 150, maxHp: 1500, damage: 50, range: 100 },
            enemyRight: { x: 750, y: 150, maxHp: 1500, damage: 50, range: 100 },
            enemyKing: { x: 450, y: 100, maxHp: 3000, damage: 70, range: 120 }
        }
    },

    CARDS: {
        knight: {
            name: 'Рыцарь',
            cost: 3,
            unitType: 'knight',
            hp: 600,
            damage: 75,
            range: 30,
            speed: 120,
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
            speed: 100,
            attackSpeed: 1.2,
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
            speed: 90,
            attackSpeed: 1.5,
            description: 'Мощная магическая атака',
            rarity: 'rare'
        }
    }
};
