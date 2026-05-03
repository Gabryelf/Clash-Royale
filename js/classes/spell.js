class Spell {
    constructor(cardId, cardData) {
        this.id = cardId;
        this.name = cardData.name;
        this.cost = cardData.cost;
        this.type = 'spell';
        this.spellType = cardData.spellType; // 'arrows', 'fireball'
        this.damage = cardData.damage;
        this.radius = cardData.radius || 100;
        this.description = cardData.description || '';
    }
    
    cast(x, y, gameState) {
        const units = gameState.getUnits();
        let hitCount = 0;
        
        for (let unit of units) {
            const dist = Math.hypot(x - unit.x, y - unit.y);
            if (dist < this.radius && unit.isPlayer !== gameState.isPlayerTurn) {
                unit.hp = Math.max(0, unit.hp - this.damage);
                hitCount++;
                if (window.Effects) window.Effects.addHitEffect(unit.x, unit.y);
            }
        }
        
        if (window.Effects) window.Effects.addExplosionEffect(x, y);
        if (window.SoundFX) window.SoundFX.playSpell();
        
        return hitCount;
    }
}
