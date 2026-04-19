// ============================================================
// effects.js - Полный менеджер визуальных эффектов
// ============================================================

/**
 * Менеджер визуальных эффектов для игры
 * Отвечает за частицы, вспышки, анимации и спецэффекты
 */
 class EffectsManager {
    constructor() {
        /** @type {Array} Массив активных эффектов */
        this.particles = [];
        
        /** @type {Array} Массив вспышек экрана */
        this.flashes = [];
        
        /** @type {CanvasRenderingContext2D} Контекст для рисования */
        this.ctx = null;
        
        /** @type {number} Время последнего обновления */
        this.lastTime = 0;
        
        /** @type {boolean} Включены ли эффекты */
        this.enabled = true;
        
        /** @type {Object} Конфигурация цветов для разных типов эффектов */
        this.colors = {
            hit: { primary: '255, 100, 50', secondary: '255, 50, 0' },
            towerHit: { primary: '255, 200, 50', secondary: '255, 150, 0' },
            deploy: { primary: '255, 215, 100', secondary: '255, 255, 200' },
            explosion: { primary: '255, 100, 0', secondary: '255, 50, 0' },
            cardSelect: { primary: '255, 215, 0', secondary: '255, 255, 100' },
            insufficient: { primary: '255, 50, 50', secondary: '200, 0, 0' },
            towerDestroyed: { primary: '100, 100, 255', secondary: '50, 50, 200' },
            heal: { primary: '50, 255, 50', secondary: '100, 255, 100' }
        };
    }
    
    /**
     * Инициализация менеджера эффектов
     * @param {CanvasRenderingContext2D} ctx - Контекст Canvas
     */
    init(ctx) {
        this.ctx = ctx;
        this.lastTime = performance.now() / 1000;
        console.log('✨ EffectsManager инициализирован');
    }
    
    /**
     * Добавляет эффект удара по юниту
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addHitEffect(x, y) {
        if (!this.enabled) return;
        
        const particles = [];
        const particleCount = 8 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 150;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 50,
                life: 0.3 + Math.random() * 0.3,
                maxLife: 0.6,
                size: 2 + Math.random() * 4,
                color: this.colors.hit
            });
        }
        
        this.particles.push({
            type: 'hit',
            particles: particles,
            life: 0.6,
            maxLife: 0.6,
            x: x,
            y: y
        });
    }
    
    /**
     * Добавляет эффект призыва юнита
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addDeployEffect(x, y) {
        if (!this.enabled) return;
        
        // Круговой эффект
        this.particles.push({
            type: 'deploy',
            x: x,
            y: y,
            radius: 30,
            life: 0.4,
            maxLife: 0.4,
            scale: 1
        });
        
        // Частицы призыва
        const particles = [];
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 120;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.4 + Math.random() * 0.3,
                maxLife: 0.7,
                size: 3 + Math.random() * 4,
                color: this.colors.deploy
            });
        }
        
        this.particles.push({
            type: 'deployParticles',
            particles: particles,
            life: 0.7,
            maxLife: 0.7
        });
    }
    
    /**
     * Добавляет эффект попадания по башне
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addTowerHitEffect(x, y) {
        if (!this.enabled) return;
        
        const particles = [];
        const particleCount = 12 + Math.floor(Math.random() * 8);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 150;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 80,
                life: 0.4 + Math.random() * 0.3,
                maxLife: 0.7,
                size: 3 + Math.random() * 5,
                color: this.colors.towerHit
            });
        }
        
        this.particles.push({
            type: 'towerHit',
            particles: particles,
            life: 0.7,
            maxLife: 0.7,
            x: x,
            y: y
        });
        
        // Добавляем небольшую вспышку
        this.screenFlash('255, 200, 50', 0.1);
    }
    
    /**
     * Добавляет эффект взрыва (для разрушения башен)
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addExplosionEffect(x, y) {
        if (!this.enabled) return;
        
        const particles = [];
        const particleCount = 25 + Math.floor(Math.random() * 15);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 150 + Math.random() * 250;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5 + Math.random() * 0.5,
                maxLife: 1.0,
                size: 4 + Math.random() * 8,
                color: this.colors.explosion
            });
        }
        
        this.particles.push({
            type: 'explosion',
            particles: particles,
            life: 1.0,
            maxLife: 1.0,
            x: x,
            y: y,
            radius: 50
        });
        
        // Большая вспышка экрана
        this.screenFlash('255, 100, 0', 0.3);
    }
    
    /**
     * Добавляет эффект выбора карты
     * @param {number} x - X координата карты
     * @param {number} y - Y координата карты
     */
    addCardSelectEffect(x, y) {
        if (!this.enabled) return;
        
        // Круговой эффект вокруг карты
        this.particles.push({
            type: 'cardSelect',
            x: x + 35, // Центр карты
            y: y + 45,
            radius: 40,
            life: 0.35,
            maxLife: 0.35,
            scale: 1
        });
        
        // Сверкающие частицы
        const particles = [];
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 100;
            
            particles.push({
                x: x + 35,
                y: y + 45,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.3,
                maxLife: 0.5,
                size: 2 + Math.random() * 3,
                color: this.colors.cardSelect
            });
        }
        
        this.particles.push({
            type: 'cardSelectParticles',
            particles: particles,
            life: 0.5,
            maxLife: 0.5
        });
    }
    
    /**
     * Добавляет эффект недостатка эликсира
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addInsufficientEffect(x, y) {
        if (!this.enabled) return;
        
        const particles = [];
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150 - 80,
                life: 0.4 + Math.random() * 0.3,
                maxLife: 0.7,
                size: 2 + Math.random() * 4,
                color: this.colors.insufficient
            });
        }
        
        this.particles.push({
            type: 'insufficient',
            particles: particles,
            life: 0.7,
            maxLife: 0.7
        });
        
        // Красная вспышка
        this.screenFlash('255, 0, 0', 0.15);
    }
    
    /**
     * Добавляет эффект разрушения башни
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addTowerDestroyedEffect(x, y) {
        if (!this.enabled) return;
        
        // Множественные взрывы
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.addExplosionEffect(
                    x + (Math.random() - 0.5) * 60,
                    y + (Math.random() - 0.5) * 60
                );
            }, i * 100);
        }
        
        // Специальные частицы разрушения
        const particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 80,
                y: y + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200 - 100,
                life: 0.6 + Math.random() * 0.5,
                maxLife: 1.1,
                size: 3 + Math.random() * 7,
                color: this.colors.towerDestroyed
            });
        }
        
        this.particles.push({
            type: 'towerDestroyed',
            particles: particles,
            life: 1.1,
            maxLife: 1.1
        });
        
        // Яркая вспышка
        this.screenFlash('255, 255, 255', 0.4);
    }
    
    /**
     * Добавляет эффект лечения (для будущих карт)
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    addHealEffect(x, y) {
        if (!this.enabled) return;
        
        const particles = [];
        for (let i = 0; i < 10; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y + (Math.random() - 0.5) * 30,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80 - 60,
                life: 0.5,
                maxLife: 0.8,
                size: 2 + Math.random() * 4,
                color: this.colors.heal
            });
        }
        
        this.particles.push({
            type: 'heal',
            particles: particles,
            life: 0.8,
            maxLife: 0.8
        });
    }
    
    /**
     * Добавляет вспышку экрана
     * @param {string} color - Цвет в формате "R,G,B"
     * @param {number} duration - Длительность в секундах
     */
    screenFlash(color = '255,255,255', duration = 0.15) {
        this.flashes.push({
            color: color,
            life: duration,
            maxLife: duration
        });
    }
    
    /**
     * Обновляет все эффекты
     * @param {number} delta - Время, прошедшее с последнего кадра
     */
    update(delta) {
        if (!this.enabled) return;
        
        // Ограничиваем delta для предотвращения скачков
        const safeDelta = Math.min(delta, 0.033);
        
        // Обновляем частицы
        for (let i = 0; i < this.particles.length; i++) {
            const effect = this.particles[i];
            effect.life -= safeDelta;
            
            if (effect.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            // Обновляем частицы внутри эффекта
            if (effect.particles) {
                for (let p of effect.particles) {
                    p.x += p.vx * safeDelta;
                    p.y += p.vy * safeDelta;
                    p.life -= safeDelta;
                }
            }
            
            // Обновляем масштаб круговых эффектов
            if (effect.type === 'deploy' || effect.type === 'cardSelect') {
                const progress = 1 - (effect.life / effect.maxLife);
                effect.radius = effect.maxLife * 40 * (1 - progress);
                effect.scale = 1 - progress;
            }
        }
        
        // Обновляем вспышки
        for (let i = 0; i < this.flashes.length; i++) {
            this.flashes[i].life -= safeDelta;
            if (this.flashes[i].life <= 0) {
                this.flashes.splice(i, 1);
                i--;
            }
        }
    }
    
    /**
     * Рисует все эффекты
     */
    draw() {
        if (!this.ctx || !this.enabled) return;
        
        // Рисуем частицы
        for (let effect of this.particles) {
            const alpha = Math.min(1, effect.life / (effect.maxLife || effect.life));
            
            // Круговые эффекты
            if (effect.type === 'deploy') {
                this.ctx.save();
                this.ctx.shadowBlur = 0;
                
                // Внешнее свечение
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.colors.deploy.primary}, ${alpha * 0.4})`;
                this.ctx.fill();
                
                // Внутренний круг
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius * 0.6, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.colors.deploy.secondary}, ${alpha * 0.7})`;
                this.ctx.fill();
                
                // Спарклы
                for (let i = 0; i < 8; i++) {
                    const angle = (Date.now() / 200 + i) * Math.PI * 2 / 8;
                    const rad = effect.radius * 0.8;
                    const sparkX = effect.x + Math.cos(angle) * rad;
                    const sparkY = effect.y + Math.sin(angle) * rad;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(sparkX, sparkY, 2 * alpha, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
                    this.ctx.fill();
                }
                
                this.ctx.restore();
                
            } else if (effect.type === 'cardSelect') {
                this.ctx.save();
                this.ctx.shadowBlur = 0;
                
                // Золотое свечение
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.colors.cardSelect.primary}, ${alpha * 0.5})`;
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius * 0.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${this.colors.cardSelect.secondary}, ${alpha * 0.8})`;
                this.ctx.fill();
                
                this.ctx.restore();
                
            } else if (effect.particles) {
                // Эффекты с частицами
                for (let p of effect.particles) {
                    if (p.life <= 0) continue;
                    
                    const pAlpha = (p.life / p.maxLife) * alpha;
                    const color = p.color || this.colors.hit;
                    
                    this.ctx.fillStyle = `rgba(${color.primary}, ${pAlpha * 0.9})`;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // Добавляем свечение для ярких частиц
                    if (p.size > 3) {
                        this.ctx.fillStyle = `rgba(${color.secondary}, ${pAlpha * 0.5})`;
                        this.ctx.beginPath();
                        this.ctx.arc(p.x, p.y, p.size * pAlpha * 1.5, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }
        
        // Рисуем вспышки
        for (let flash of this.flashes) {
            const alpha = flash.life / flash.maxLife;
            this.ctx.fillStyle = `rgba(${flash.color}, ${alpha * 0.6})`;
            this.ctx.fillRect(0, 0, window.CONFIG.GAME.width, window.CONFIG.GAME.height);
        }
    }
    
    /**
     * Очищает все эффекты
     */
    clear() {
        this.particles = [];
        this.flashes = [];
    }
    
    /**
     * Включает/выключает эффекты
     * @param {boolean} value
     */
    setEnabled(value) {
        this.enabled = value;
        if (!value) {
            this.clear();
        }
    }
    
    /**
     * Создает текстовый эффект (урон, исцеление)
     * @param {number} x - X координата
     * @param {number} y - Y координата
     * @param {string} text - Текст
     * @param {string} color - Цвет
     */
    addTextEffect(x, y, text, color = '#ff6666') {
        if (!this.enabled) return;
        
        this.particles.push({
            type: 'text',
            text: text,
            x: x,
            y: y,
            life: 0.8,
            maxLife: 0.8,
            color: color,
            vy: -50
        });
    }
    
    /**
     * Рисует текстовые эффекты (дополнительный метод для draw)
     */
    drawTextEffects() {
        for (let effect of this.particles) {
            if (effect.type === 'text') {
                const alpha = effect.life / effect.maxLife;
                this.ctx.font = `bold ${Math.floor(16 * (1 - alpha) + 12)}px monospace`;
                this.ctx.fillStyle = effect.color;
                this.ctx.shadowBlur = 0;
                this.ctx.fillText(
                    effect.text, 
                    effect.x, 
                    effect.y - (1 - alpha) * 30
                );
            }
        }
    }
}

// Создаем глобальный экземпляр
window.EffectsManager = EffectsManager;
window.Effects = new EffectsManager();

console.log('✅ Effects Manager загружен');