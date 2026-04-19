// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CORE - основная игровая логика   team - core : @lafneroo  ( Остапчук Андрей )
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Core {
    constructor(canvas, ctx) {
        // Конструктор класса Core - инициализирует основные свойства игрового ядра
        // canvas: HTMLCanvasElement - элемент canvas, на котором будет отображаться игра
        // ctx: CanvasRenderingContext2D - контекст для рисования на canvas (позволяет рисовать фигуры, текст и т.д.)
        this.canvas = canvas;
        this.ctx = ctx;
        this.lastTime = 0;           // Время последнего кадра в секундах (используется для расчета дельты времени)
        this.gameState = null;       // Состояние игры (хранит все данные: юниты, башни, эликсир, активна ли игра)
        this.graphics = null;        // Объект для отрисовки графики (башни, юниты, интерфейс, арена)
        this.soundFX = null;         // Объект для управления звуковыми эффектами (атаки, спавн юнитов, победа)
        this.ui = null;              // Объект пользовательского интерфейса (обработка нажатий на карты, кнопки)
        this.ai = null;              // Объект искусственного интеллекта противника (управляет действиями врага)
        this.deck = null;            // Колода карт игрока (содержит доступных для призыва юнитов)
        this.animationId = null;     // ID анимационного фрейма для requestAnimationFrame (нужен для остановки цикла)
    }
    
    async init() {
        // Асинхронная инициализация игры - создает все компоненты и запускает игровой цикл
        // async позволяет использовать await внутри, если понадобится загружать ресурсы (звуки, спрайты)

        console.log('🎮 Инициализация игры...');
        
        // Инициализация компонентов - создаем экземпляры всех классов, необходимых для работы игры
        this.graphics = new Graphics(this.ctx);     // Графический движок для отрисовки
        this.soundFX = new SoundFX();               // Звуковой движок для воспроизведения эффектов
        this.gameState = new GameState();           // Объект, хранящий текущее состояние игры
        this.deck = new Deck();                     // Колода с картами юнитов
        this.ui = new UI(this.canvas, this.gameState, this.deck);   // Интерфейс для взаимодействия с игроком
        this.ai = new AI(this.gameState, this.deck); // ИИ, который управляет действиями противника
        
        // Запуск игры - инициализируем начало битвы (сбрасываем здоровье башен, эликсир и т.д.)
        this.gameState.startBattle();
        this.lastTime = performance.now() / 1000;   // Запоминаем текущее время для расчета дельты
        
        console.log('✅ Игра инициализирована!');
        this.startLoop();                           // Запускаем игровой цикл
    }
    
    startLoop() {
        // Запускает основной игровой цикл с использованием requestAnimationFrame
        // requestAnimationFrame - браузерный метод, который вызывает функцию перед каждой перерисовкой экрана
        // Вычисляет дельту времени между кадрами для плавной анимации и независимости от FPS
        const gameLoop = () => {
            const now = performance.now() / 1000;   // Текущее время в секундах
            let delta = Math.min(0.033, now - this.lastTime);  // Ограничиваем дельту максимум 33мс (для предотвращения больших скачков)
            // Если игра зависла, delta не будет больше 0.033, что предотвращает "телепортацию" юнитов
            this.lastTime = now;
            
            this.update(delta, now);    // Обновляем логику игры (движение, атаки, спавн)
            this.render();              // Отрисовываем текущее состояние игры на canvas
            
            this.animationId = requestAnimationFrame(gameLoop);  // Запрашиваем следующий кадр
        };
        
        gameLoop();  // Стартуем цикл
    }
    
    update(delta, now) {
        // Обновляет игровую логику: эликсир, AI, позиции юнитов, башни и проверку победы
        // delta: число - время, прошедшее с последнего кадра (в секундах). Используется для плавного движения юнитов
        // now: число - текущее время в секундах (используется для генерации эликсира и задержек AI)
        
        if (!this.gameState.isActive) return;   // Если игра окончена (кто-то победил), не обновляем логику
        
        // Обновление эликсира - добавляем эликсир игроку и AI с течением времени
        this.gameState.updateElixir(now);
        
        // Обновление AI - проверяем, может ли AI призвать юнита, и если да - призываем
        this.ai.update(now);
        
        // Обновление юнитов - перемещаем юнитов, проверяем атаки, применяем урон
        const units = this.gameState.getUnits();   // Получаем массив всех юнитов на поле
        const towers = this.gameState.towers;      // Получаем объект со всеми башнями (игрока и врага)
        
        for (let i = 0; i < units.length; i++) {
            // Для каждого юнита вызываем его метод update, который:
            // - перемещает юнита в зависимости от его стороны (влево или вправо)
            // - ищет цель для атаки (вражеского юнита или башню)
            // - наносит урон, если цель в радиусе атаки
            units[i].update(delta, units, towers);
        }
        
        // Обновление башен - каждая башня проверяет, есть ли враги в радиусе, и атакует
        for (let tower of Object.values(towers)) {
            tower.update(delta, units, this.gameState);
        }
        
        // Удаление мертвых юнитов - убираем из массива юнитов тех, у кого здоровье <= 0
        this.gameState.removeDeadUnits();
        
        // Проверка победы - смотрим, у какой стороны разрушена королевская башня
        const winner = this.gameState.checkVictory();  // Возвращает 'player', 'enemy' или null
        if (winner && this.gameState.isActive) {
            this.gameState.isActive = false;  // Останавливаем игру, если есть победитель
            // Здесь можно добавить звук победы/поражения
        }
    }
    
    render() {
        if (!this.graphics || !this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка арены
        this.graphics.drawArena();
        
        // Отрисовка башен
        const towers = this.gameState.towers;
        this.graphics.drawTower(towers.playerLeft, true);
        this.graphics.drawTower(towers.playerRight, true);
        this.graphics.drawKingTower(towers.playerKing, true);
        this.graphics.drawTower(towers.enemyLeft, false);
        this.graphics.drawTower(towers.enemyRight, false);
        this.graphics.drawKingTower(towers.enemyKing, false);
        
        // Отрисовка юнитов
        const units = this.gameState.getUnits();
        for (let unit of units) {
            this.graphics.drawUnit(unit);
        }
        
        // Отрисовка эффектов
        if (window.Effects) {
            window.Effects.draw();
        }
        
        // Отрисовка UI с передачей объекта UI для режима размещения
        this.graphics.drawUI(this.gameState, this.deck, this.ui.selectedCardIndex, this.ui);
        
        // Отрисовка индикатора режима размещения
        if (this.ui.isPlacingMode) {
            this.drawPlacementIndicator();
        }
    }
    
    /**
     * Рисует индикатор режима размещения
     */
    drawPlacementIndicator() {
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        
        // Подсветка нижней половины поля
        this.ctx.fillRect(0, window.CONFIG.GAME.height / 2, window.CONFIG.GAME.width, window.CONFIG.GAME.height / 2);
        this.ctx.strokeRect(0, window.CONFIG.GAME.height / 2, window.CONFIG.GAME.width, window.CONFIG.GAME.height / 2);
        
        // Текст подсказки
        this.ctx.fillStyle = '#ffd700';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.shadowBlur = 0;
        this.ctx.fillText('👉 Кликните на арене для призыва юнита 👈', 
            window.CONFIG.GAME.width / 2 - 200, 
            window.CONFIG.GAME.height - 20);
    }
    
    stop() {
        // Останавливает игровой цикл, отменяя текущую анимацию
        // Используется при завершении игры или перезагрузке, чтобы освободить ресурсы
        // Без этого вызова игра продолжала бы работать в фоне, потребляя процессор
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);  // Отменяем запрошенный анимационный кадр
            this.animationId = null;                 // Обнуляем ID для возможности перезапуска
        }
    }
}

window.Core = null;  // Экспортируем класс в глобальную область видимости (для доступа из других файлов)
