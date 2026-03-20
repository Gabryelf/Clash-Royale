// ========== ARCHER CLASS ==========
// Archer unit definition

const Archer = (function() {
    function create(x, y, isPlayer) {
        const stats = CONFIG.getUnitStats('archer');
        return {
            x: x,
            y: y,
            type: 'archer',
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

window.Archer = Archer;
console.log('✅ Archer class loaded');