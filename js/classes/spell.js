class Spell {
    constructor(cardId, cardData) {
        this.id = cardId;
        this.name = cardData.name;
        this.cost = cardData.cost;
        this.type = 'spell';
        this.spellType = cardData.spellType; // 'arrows', 'fireball', 'rocket'
        this.damage = cardData.damage;
        this.radius = cardData.radius || 100;
        this.description = cardData.description || '';
        this.icon = cardData.icon || cardData.spellType;
    }
    
    cast(x, y, gameState) {
        switch(this.spellType) {
            case 'arrows':
                this.castArrows(x, y, gameState);
                break;
            case 'fireball':
                this.castFireball(x, y, gameState);
                break;
            default:
                console.log(`Заклинание ${this.name} применено в (${x}, ${y})`);
        }
    }
    
    castArrows(x, y, gameState) {
        const units = gameState.getUnits();
        let hitCount = 0;
        
        for (let unit of units) {
            const dist = Math.hypot(x - unit.x, y - unit.y);
            if (dist < this.radius) {
                unit.hp = Math.max(0, unit.hp - this.damage);
                hitCount++;
                if (window.Effects) {
                    window.Effects.addHitEffect(unit.x, unit.y);
                }
            }
        }
        
        console.log(`🏹 Стрелы нанесли ${this.damage} урона ${hitCount} юнитам`);
        if (window.Effects) {
            window.Effects.addExplosionEffect(x, y);
        }
        if (window.SoundFX) window.SoundFX.playSpell();
    }
}