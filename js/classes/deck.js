// ============================================================
// deck.js - Класс колоды карт
// ============================================================

class Deck {
    constructor(cardIds = null) {
        this.allCards = [];     // все карты в колоде
        this.hand = [];         // карты в руке (4 карты)
        this.discardPile = [];  // сброс
        this.handSize = 4;
        
        this.initDeck(cardIds);
        this.shuffle();
        this.drawInitialHand();
    }
    
    initDeck(cardIds) {
        // Если не указаны карты, используем стандартную колоду
        const defaultCards = ['knight', 'archer', 'mage', 'knight', 'archer', 'mage', 'knight', 'archer'];
        const ids = cardIds || defaultCards;
        
        for (let id of ids) {
            const cardData = window.CONFIG.CARDS[id];
            if (cardData) {
                this.allCards.push(new Card(id, cardData));
            }
        }
    }
    
    shuffle() {
        for (let i = this.allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.allCards[i], this.allCards[j]] = [this.allCards[j], this.allCards[i]];
        }
    }
    
    drawInitialHand() {
        for (let i = 0; i < this.handSize && this.allCards.length > 0; i++) {
            this.hand.push(this.allCards.shift());
        }
    }
    
    getCard(index) {
        if (index >= 0 && index < this.hand.length) {
            return this.hand[index];
        }
        return null;
    }
    
    useCard(index) {
        if (index < 0 || index >= this.hand.length) return false;
        
        const usedCard = this.hand[index];
        
        // Удаляем из руки
        this.hand.splice(index, 1);
        
        // Добавляем в сброс
        this.discardPile.push(usedCard);
        
        // Если колода пуста, перемешиваем сброс
        if (this.allCards.length === 0 && this.discardPile.length > 0) {
            this.allCards = [...this.discardPile];
            this.discardPile = [];
            this.shuffle();
        }
        
        // Добираем новую карту
        if (this.allCards.length > 0 && this.hand.length < this.handSize) {
            this.hand.push(this.allCards.shift());
        }
        
        return true;
    }
    
    resetCycle() {
        // Возвращаем все карты в колоду
        this.allCards = [...this.allCards, ...this.hand, ...this.discardPile];
        this.hand = [];
        this.discardPile = [];
        this.shuffle();
        this.drawInitialHand();
    }
    
    getHand() {
        return this.hand;
    }
}

window.Deck = null;