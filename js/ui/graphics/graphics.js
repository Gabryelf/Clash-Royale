/**
 * @class Graphics - Отвечает за визуализацию всех игровых элементов
 * @param {CanvasRenderingContext2D} ctx - 2D контекст Canvas для рисования
 */
 class Graphics {
    constructor(ctx) {
        /** @type {CanvasRenderingContext2D} Контекст Canvas для рисования */
        this.ctx = ctx;
        /** @type {Object.<string, HTMLImageElement>} Хранилище загруженных изображений */
        this.images = {};
        this.loadAllImages();
        this.waterOffset = 0;
    }
    
    /**
     * Загружает все изображения из глобальной конфигурации window.CONFIG.IMAGES
     * Не ожидает завершения загрузки - проверка состояния при рисовании
     */
    loadAllImages() {
        const imagePaths = window.CONFIG?.IMAGES || {};
        for (let key in imagePaths) {
            const img = new Image();
            img.src = imagePaths[key];
            this.images[key] = img;
        }
    }
    
    /**
     * Рисует одно изображение в указанной области
     * @param {string} key - Ключ изображения в this.images
     * @param {number} x - X-координата верхнего левого угла
     * @param {number} y - Y-координата верхнего левого угла
     * @param {number} w - Ширина области рисования
     * @param {number} h - Высота области рисования
     */
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
    
    /**
     * Рисует изображение в виде плитки (тайла) для заполнения области
     * @param {string} key - Ключ изображения
     * @param {number} x - X-координата верхнего левого угла области
     * @param {number} y - Y-координата верхнего левого угла области
     * @param {number} width - Общая ширина заполняемой области
     * @param {number} height - Общая высота заполняемой области
     * @param {number} tileW - Ширина одной плитки
     * @param {number} tileH - Высота одной плитки
     */
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
    
    /**
     * Рисует игровое поле с правильными дорожками к башням
     * Структура:
     * - Левая дорожка: от левой башни игрока к левой башне врага
     * - Правая дорожка: от правой башни игрока к правой башне врага
     * - Река: горизонтальная полоса в центре, пересекающая обе дорожки
     */
    drawArena() {
        const width = window.CONFIG.GAME.width;
        const height = window.CONFIG.GAME.height;
        const centerY = height / 2;
        
        // 1. Фон - трава
        this.drawTiledImage('grass', 0, 0, width, height, 50, 50);
        
        // 2. Левая дорожка (от левой башни игрока к левой башне врага)
        const leftPath = {
            startX: 150, startY: 450,  // левая башня игрока
            endX: 150, endY: 150       // левая башня врага
        };
        this.drawPath(leftPath.startX, leftPath.startY, leftPath.endX, leftPath.endY, 60);
        
        // 3. Правая дорожка (от правой башни игрока к правой башне врага)
        const rightPath = {
            startX: 750, startY: 450,  // правая башня игрока
            endX: 750, endY: 150       // правая башня врага
        };
        this.drawPath(rightPath.startX, rightPath.startY, rightPath.endX, rightPath.endY, 60);
        
        // 4. Центральная дорожка к королевской башне (опционально)
        const kingPath = {
            startX: 450, startY: 500,  // королевская башня игрока
            endX: 450, endY: 100       // королевская башня врага
        };
        this.drawPath(kingPath.startX, kingPath.startY, kingPath.endX, kingPath.endY, 50);
        
        // 5. Река (пересекает дорожки в центре)
        this.drawRiver();
    }

    /**
     * Рисует дорожку между двумя точками
     * @param {number} startX - Начальная X
     * @param {number} startY - Начальная Y
     * @param {number} endX - Конечная X
     * @param {number} endY - Конечная Y
     * @param {number} width - Ширина дорожки
     */
    drawPath(startX, startY, endX, endY, width) {
        // Сохраняем контекст
        this.ctx.save();
        
        // Вычисляем угол поворота
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx);
        const length = Math.hypot(dx, dy);
        
        // Поворачиваем и рисуем
        this.ctx.translate(startX, startY);
        this.ctx.rotate(angle);
        
        // Рисуем путь с текстурой
        this.drawTiledImage('path', 0, -width/2, length, width, 50, 50);
        
        // Восстанавливаем контекст
        this.ctx.restore();
    }

    /**
     * Рисует реку, пересекающую дорожки
     */
    drawRiver() {
        const width = window.CONFIG.GAME.width;
        const centerY = window.CONFIG.GAME.height / 2;
        const riverWidth = 25;
        
        // Река - горизонтальная полоса через всю арену
        this.drawTiledImage('river', 0, centerY - riverWidth/2, width, riverWidth, 50, riverWidth);
        
        // Добавляем эффект воды (блики)
        this.ctx.fillStyle = 'rgba(100, 200, 255, 0.3)';
        for (let i = 0; i < 10; i++) {
            this.ctx.fillRect(
                50 + i * 80, 
                centerY - 5 + Math.sin(Date.now() / 1000 + i) * 3, 
                40, 
                4
            );
        }
    }
    
    /**
     * Рисует обычную башню (игрока или врага)
     * @param {Object} tower - Объект башни со свойствами x, y, hp, maxHp
     * @param {boolean} isPlayer - true - башня игрока, false - башня врага
     */
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
    
    /**
     * Рисует башню короля (центральную башню)
     * @param {Object} tower - Объект башни со свойствами x, y, hp, maxHp
     * @param {boolean} isPlayer - true для башни игрока, false для врага
     */
    drawKingTower(tower, isPlayer = true) {
        const imgKey = isPlayer ? 'kingTower' : 'kingEnemyTower';
        this.drawImage(imgKey, tower.x - 40, tower.y - 50, 80, 90);
        
        const percent = tower.hp / tower.maxHp;
        this.ctx.fillStyle = '#aa2e2e';
        this.ctx.fillRect(tower.x - 35, tower.y - 60, 70, 6);
        this.ctx.fillStyle = '#4eff6e';
        this.ctx.fillRect(tower.x - 35, tower.y - 60, 70 * percent, 6);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.fillText(`❤️ ${Math.floor(tower.hp)}`, tower.x - 20, tower.y - 63);
    }
    
    /**
     * Рисует игрового юнита с полосой здоровья и индикатором команды
     * @param {Object} unit - Объект юнита со свойствами: type, x, y, hp, maxHp, isPlayer
     */
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
    
    /**
     * Рисует пользовательский интерфейс: эликсир-бар и карты в руке
     * @param {Object} gameState - Состояние игры с полями elixir, maxElixir
     * @param {Object} deck - Колода с массивом hand
     * @param {number} selectedCardIndex - Индекс выбранной карты или null
     */
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