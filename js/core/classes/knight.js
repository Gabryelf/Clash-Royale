// ========== KNIGHT CLASS ==========
// Knight unit definition

const Knight = (function() {
    function create(x, y, isPlayer) {
        const stats = CONFIG.getUnitStats('knight');
        return {
            x: x,
            y: y,
            type: 'knight',
            isPlayer: isPlayer,
            hp: stats.hp,
            maxHp: stats.hp,
            damage: stats.damage,
            range: stats.range,
            speed: stats.speed,
            attackSpeed: stats.attackSpeed,
            attackCooldown: 0
        };
    }
    
    return { create: create };
})();

window.Knight = Knight;
console.log('✅ Knight class loaded');