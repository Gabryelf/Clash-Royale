// ============================================================
// card.js - Класс карты        team - core : @lafneroo  ( Остапчук Андрей )
// ============================================================

class Card {
    constructor(cardId, cardData) {
        this.id = cardId;
        this.name = cardData.name;
        this.cost = cardData.cost;
        this.unitType = cardData.unitType;
        this.icon = cardData.icon || cardData.unitType;
        this.description = cardData.description || '';
        this.rarity = cardData.rarity || 'common';
        
        // Характеристики юнита
        this.hp = cardData.hp;
        this.damage = cardData.damage;
        this.range = cardData.range;
        this.speed = cardData.speed;
        this.attackSpeed = cardData.attackSpeed;
    }
    
    getTooltip() {
        return `${this.name} (${this.cost}⚡)\n❤️ ${this.hp} | ⚔️ ${this.damage}`;
    }
    
    clone() {
        return new Card(this.id, {
            name: this.name,
            cost: this.cost,
            unitType: this.unitType,
            hp: this.hp,
            damage: this.damage,
            range: this.range,
            speed: this.speed,
            attackSpeed: this.attackSpeed
        });
    }
}

window.Card = null;
