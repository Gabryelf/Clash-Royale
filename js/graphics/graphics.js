// ============================================================
// graphics.js - Класс для отрисовки всей графики
// ============================================================

class Graphics {
    constructor(ctx) {
        this.ctx = ctx;
        this.images = {};
        this.loadAllImages();
    }
    
    loadAllImages() {
        const imagePaths = window.CONFIG?.IMAGES || {};
        for (let key in imagePaths) {
            const img = new Image();
            img.src = imagePaths[key];
            this.images[key] = img;
        }
    }
    
    drawImage(key, x, y, w, h) {
        const img = this.images[key];
        if (img && img.complete && img.naturalWidth > 0) {
            this.ctx.drawImage(img, x, y, w, h);
        } else {
            // Заглушка при отсутствии изображения
            this.ctx.fillStyle = '#888';
            this.ctx.fillRect(x, y, w, h);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px monospace';
            this.ctx.fillText(key, x + 5, y + 15);
        }
    }
    
    drawTiledImage(key, x, y, width, height, tileW, tileH) {
        const img = this.images[key];
        if (!img || !img.complete) {
            this.ctx.fillStyle = '#555';
            this.ctx.fillRect(x, y, width, height);
            return;
        }
        
        for (let row = 0; row < height; row += tileH) {
            for (let col = 0; col < width; col += tileW) {
                const dw = Math.min(tileW, width - col);
                const dh = Math.min(tileH, height - row);
                this.ctx.drawImage(img, x + col, y + row, dw, dh);
            }
        }
    }
    
    drawArena() {
        // Фон - трава
        this.drawTiledImage('grass', 0, 0, window.CONFIG.GAME.width, window.CONFIG.GAME.height, 50, 50);
        // Дорожка
        this.drawTiledImage('path', 0, 270, window.CONFIG.GAME.width, 60, 50, 50);
        // Река
        this.drawTiledImage('river', 0, 330, window.CONFIG.GAME.width, 20, 50, 20);
    }
    
    drawTower(tower, isPlayer) {
        const imgKey = isPlayer ? 'playerTower' : 'enemyTower';
        this.drawImage(imgKey, tower.x - 35, tower.y - 50, 70, 80);
        
        // Полоса здоровья
        const percent = tower.hp / tower.maxHp;
        this.ctx.fillStyle = '#aa2e2e';
        this.ctx.fillRect(tower.x - 30, tower.y - 60, 60, 6);
        this.ctx.fillStyle = '#4eff6e';
        this.ctx.fillRect(tower.x - 30, tower.y - 60, 60 * percent, 6);
        
        // Текст HP
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.fillText(`❤️ ${Math.floor(tower.hp)}`, tower.x - 20, tower.y - 63);
    }
    
    drawKingTower(tower) {
        this.drawImage('kingTower', tower.x - 40, tower.y - 50, 80, 90);
        
        const percent = tower.hp / tower.maxHp;
        this.ctx.fillStyle = '#aa2e2e';
        this.ctx.fillRect(tower.x - 35, tower.y - 60, 70, 6);
        this.ctx.fillStyle = '#4eff6e';
        this.ctx.fillRect(tower.x - 35, tower.y - 60, 70 * percent, 6);
        
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(`❤️ ${Math.floor(tower.hp)}`, tower.x - 20, tower.y - 63);
    }
    
    drawUnit(unit) {
        this.drawImage(unit.type, unit.x - 18, unit.y - 18, 36, 36);
        
        // Полоса здоровья
        const percent = unit.hp / unit.maxHp;
        this.ctx.fillStyle = '#aa2e2e';
        this.ctx.fillRect(unit.x - 16, unit.y - 24, 32, 4);
        this.ctx.fillStyle = '#4eff6e';
        this.ctx.fillRect(unit.x - 16, unit.y - 24, 32 * percent, 4);
        
        // Индикатор команды (красный/синий кружок)
        this.ctx.fillStyle = unit.isPlayer ? '#4488ff' : '#ff4444';
        this.ctx.beginPath();
        this.ctx.arc(unit.x - 15, unit.y - 15, 4, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawUI(gameState, deck, selectedCardIndex) {
        // Эликсир бар
        const elixirPercent = gameState.elixir / window.CONFIG.GAME.maxElixir;
        this.ctx.fillStyle = '#2c1a0e';
        this.ctx.fillRect(15, 10, 220, 22);
        this.ctx.fillStyle = '#d13aff';
        this.ctx.fillRect(15, 10, 220 * elixirPercent, 22);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 18px monospace';
        this.ctx.fillText(`⚡ ${Math.floor(gameState.elixir)}/${window.CONFIG.GAME.maxElixir}`, 25, 28);
        
        // Отрисовка карт в руке
        if (deck && deck.hand) {
            const cardWidth = 70;
            const cardHeight = 90;
            const startX = window.CONFIG.GAME.width / 2 - (cardWidth * deck.hand.length) / 2;
            const startY = window.CONFIG.GAME.height - 100;
            
            for (let i = 0; i < deck.hand.length; i++) {
                const card = deck.hand[i];
                const x = startX + i * (cardWidth + 10);
                const isSelected = (selectedCardIndex === i);
                
                // Рамка карты
                this.ctx.fillStyle = isSelected ? '#ffd700' : '#333';
                this.ctx.fillRect(x - 3, startY - 3, cardWidth + 6, cardHeight + 6);
                this.ctx.fillStyle = '#1a1a2e';
                this.ctx.fillRect(x, startY, cardWidth, cardHeight);
                
                // Иконка юнита на карте
                this.drawImage(card.unitType, x + cardWidth/2 - 15, startY + 15, 30, 30);
                
                // Стоимость
                this.ctx.fillStyle = card.cost <= gameState.elixir ? '#4eff6e' : '#ff6666';
                this.ctx.font = 'bold 16px monospace';
                this.ctx.fillText(`⚡${card.cost}`, x + 5, startY + 25);
                
                // Название
                this.ctx.fillStyle = '#ffd700';
                this.ctx.font = '10px monospace';
                this.ctx.fillText(card.name, x + cardWidth/2 - 20, startY + 65);
            }
        }
    }
}

// Глобальный экземпляр
window.Graphics = null;