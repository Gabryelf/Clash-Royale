// ========== MAGE CLASS ==========
// Mage unit definition

const Mage = (function() {
    function create(x, y, isPlayer) {
        const stats = CONFIG.getUnitStats('mage');
        return {
            x: x,
            y: y,
            type: 'mage',
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

window.Mage = Mage;
console.log('✅ Mage class loaded');