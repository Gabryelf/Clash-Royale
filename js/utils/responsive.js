// ============================================================
// responsive.js - Адаптация под разные устройства
// ============================================================

class ResponsiveManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.originalWidth = window.CONFIG.GAME.width;
        this.originalHeight = window.CONFIG.GAME.height;
        this.currentScale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.setup();
        window.addEventListener('resize', () => this.setup());
        window.addEventListener('orientationchange', () => setTimeout(() => this.setup(), 100));
    }
    
    setup() {
        const container = this.canvas.parentElement || document.body;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Вычисляем масштаб для сохранения пропорций
        const scaleX = containerWidth / this.originalWidth;
        const scaleY = containerHeight / this.originalHeight;
        this.currentScale = Math.min(scaleX, scaleY);
        
        // Устанавливаем размеры canvas
        const displayWidth = this.originalWidth * this.currentScale;
        const displayHeight = this.originalHeight * this.currentScale;
        
        this.canvas.style.width = `${displayWidth}px`;
        this.canvas.style.height = `${displayHeight}px`;
        
        // Центрируем canvas
        this.offsetX = (containerWidth - displayWidth) / 2;
        this.offsetY = (containerHeight - displayHeight) / 2;
        
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.offsetX}px`;
        this.canvas.style.top = `${this.offsetY}px`;
        
        // Логические размеры canvas остаются неизменными
        this.canvas.width = this.originalWidth;
        this.canvas.height = this.originalHeight;
        
        console.log(`📱 Адаптация: масштаб=${this.currentScale.toFixed(2)}, offset=(${this.offsetX}, ${this.offsetY})`);
    }
    
    // Преобразование координат клика в логические координаты canvas
    screenToCanvas(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (screenX - rect.left) * scaleX,
            y: (screenY - rect.top) * scaleY
        };
    }
    
    // Проверка, находится ли клик в пределах canvas
    isInCanvas(screenX, screenY) {
        const rect = this.canvas.getBoundingClientRect();
        return screenX >= rect.left && screenX <= rect.right &&
               screenY >= rect.top && screenY <= rect.bottom;
    }
}

window.ResponsiveManager = ResponsiveManager;