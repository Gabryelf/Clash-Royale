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
        deploy: 'assets/sounds/deploy.mp3',
        hit: 'assets/sounds/hit.mp3',
        towerHit: 'assets/sounds/tower_hit.mp3',
        victory: 'assets/sounds/victory.mp3',
        defeat: 'assets/sounds/defeat.mp3',
        cardSelect: 'assets/sounds/card_select.mp3',
        insufficient: 'assets/sounds/error.mp3',
        spell: 'assets/sounds/spell.mp3'
    
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
            cost: 1,
            unitType: 'knight',
            hp: 600,
            damage: 75,
            range: 30,
            speed: 2,
            attackSpeed: 0.9,
            description: 'Сбалансированный боец ближнего боя',
            rarity: 'common',
            attackType: 'melee',
            range: 30
        },
        archer: {
            name: 'Лучница',
            cost: 3,
            unitType: 'archer',
            hp: 400,
            damage: 60,
            range: 150,
            speed: 1,
            attackSpeed: 1.2,
            description: 'Атакует с расстояния',
            rarity: 'common',
            attackType: 'ranged',
            range: 150
        },
        mage: {
            name: 'Маг',
            cost: 4,
            unitType: 'mage',
            hp: 350,
            damage: 120,
            range: 160,
            speed: 3,
            attackSpeed: 1.5,
            description: 'Мощная магическая атака',
            rarity: 'rare',
            attackType: 'ranged',
            range: 160
        },
        arrows: {
            name: 'Стрелы',
            cost: 3,
            spellType: 'arrows',
            damage: 120,
            radius: 120,
            description: 'Наносит урон всем врагам в области',
            rarity: 'common'
        },
        fireball: {
            name: 'Огненный шар',
            cost: 4,
            spellType: 'fireball',
            damage: 200,
            radius: 100,
            description: 'Мощный взрыв в области',
            rarity: 'rare'
        }
    }
};
//deploy.mp3'
//hit.mp3'
// tower_hit.mp3'
