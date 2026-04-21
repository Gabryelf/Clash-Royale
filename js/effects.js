// Effects Module - визуальные эффекты
window.Effects = {
    ctx: null,
    particles: [],
    flashes: [],
    
    init: function(ctx) {
        this.ctx = ctx;
        console.log('✨ Effects system initialized');
    },
    
    addHitEffect: function(x, y) {
        // Создаем эффект удара с частицами
        const particles = [];
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200 - 80,
                life: 0.4,
                maxLife: 0.4,
                size: 3 + Math.random() * 3
            });
        }
        
        this.particles.push({
            type: 'hit',
            particles: particles,
            life: 0.4
        });
    },
    
    addDeployEffect: function(x, y) {
        // Эффект призыва юнита - круговой
        this.particles.push({
            type: 'deploy',
            x: x,
            y: y,
            radius: 25,
            life: 0.3,
            maxLife: 0.3
        });
    },
    
    addTowerHitEffect: function(x, y) {
        // Эффект попадания по башне
        const particles = [];
        for (let i = 0; i < 12; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150 - 100,
                life: 0.5,
                maxLife: 0.5,
                size: 4 + Math.random() * 4
            });
        }
        
        this.particles.push({
            type: 'towerHit',
            particles: particles,
            life: 0.5
        });
    },
    
    addExplosionEffect: function(x, y) {
        // Большой эффект взрыва (для победы/поражения)
        const particles = [];
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 300,
                vy: (Math.random() - 0.5) * 300,
                life: 0.8,
                maxLife: 0.8,
                size: 4 + Math.random() * 6
            });
        }
        
        this.particles.push({
            type: 'explosion',
            particles: particles,
            life: 0.8
        });
    },
    
    update: function(delta) {
        for (let i = 0; i < this.particles.length; i++) {
            const effect = this.particles[i];
            effect.life -= delta;
            
            if (effect.life <= 0) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }
            
            // Обновляем частицы
            if (effect.particles) {
                for (let p of effect.particles) {
                    p.x += p.vx * delta;
                    p.y += p.vy * delta;
                    p.life -= delta;
                }
            }
        }
    },
    
    draw: function() {
        if (!this.ctx) return;
        
        for (let effect of this.particles) {
            const alpha = effect.life / (effect.maxLife || effect.life);
            
            if (effect.type === 'deploy') {
                // Круговой эффект призыва
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius * (1 - alpha), 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 215, 100, ${alpha * 0.6})`;
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(effect.x, effect.y, effect.radius * (1 - alpha) * 0.7, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 200, ${alpha * 0.8})`;
                this.ctx.fill();
                
            } else if (effect.particles) {
                // Эффект с частицами
                for (let p of effect.particles) {
                    if (p.life <= 0) continue;
                    
                    const pAlpha = p.life / p.maxLife;
                    let color;
                    
                    if (effect.type === 'hit') {
                        color = `rgba(255, 100, 50, ${pAlpha * 0.9})`;
                    } else if (effect.type === 'towerHit') {
                        color = `rgba(255, 200, 50, ${pAlpha * 0.9})`;
                    } else {
                        color = `rgba(255, 150, 50, ${pAlpha * 0.8})`;
                    }
                    
                    this.ctx.fillStyle = color;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, p.size * pAlpha, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    },
    
    clear: function() {
        this.particles = [];
        this.flashes = [];
    },
    
    screenFlash: function(color = 'white', duration = 0.1) {
        this.flashes.push({
            color: color,
            life: duration,
            maxLife: duration
        });
    },
    
    drawFlashes: function() {
        for (let i = 0; i < this.flashes.length; i++) {
            const flash = this.flashes[i];
            const alpha = flash.life / flash.maxLife;
            this.ctx.fillStyle = `rgba(${flash.color}, ${alpha * 0.5})`;
            this.ctx.fillRect(0, 0, Config.canvas.width, Config.canvas.height);
            flash.life -= 0.016;
            
            if (flash.life <= 0) {
                this.flashes.splice(i, 1);
                i--;
            }
        }
    }
};
