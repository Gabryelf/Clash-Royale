/// ============================================================
// ai.js - Искусственный интеллект противника ошибок не нашёл
// ============================================================

class AI {
    // Конструктор принимает текущее состояние игры и колоду карт
    constructor(gameState, deck) {
        this.gameState = gameState; // Ссылка на состояние игры
        this.deck = deck; // Ссылка на колоду карт
        this.lastDeployTime = 0; // Время последнего призыва юнита
        this.deployDelay = 3.0; // Задержка между призывами (в секундах)
        this.lastDecisionTime = 0; // Время последнего решения
    }

    // Метод обновления состояния ИИ, вызывается каждый кадр
    update(now) {
        // Если игра не активна, выходим
        if (!this.gameState.isActive) return;

        // Если это первый вызов, фиксируем время и выходим
        if (this.lastDeployTime === 0) {
            this.lastDeployTime = now;
            return;
        }

        // Проверяем, прошло ли достаточно времени для нового призыва
        if (now - this.lastDeployTime >= this.deployDelay) {
            this.makeDecision(now); // Принимаем решение о призыве
        }
    }

    // Метод принятия решения: какую карту и где призвать
    makeDecision(now) {
        // Получаем список доступных карт в руке, которые можно призвать
        const availableCards = this.deck.hand.filter(card =>
            this.gameState.canDeploy(card.cost)
        );

        // Если доступных карт нет, выходим
        if (availableCards.length === 0) return;

        // Выбираем случайную карту из доступных
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const card = availableCards[randomIndex];

        // Выбираем дорожку для призыва (случайно: левая или правая)
        const lane = Math.random() < 0.5 ? 'left' : 'right';

        // Определяем координаты призыва на вражеской стороне арены
        const x = lane === 'left' ? 150 : window.CONFIG.GAME.width - 150;
        const y = 80; // Верхняя часть арены

        // Создаём новый юнит на основе выбранной карты
        const unit = new Unit(
            x, y,
            card.unitType,
            false, // isPlayer = false (юнит принадлежит ИИ)
            lane,
            card
        );

        // Пытаемся призвать юнита в игру
        if (this.gameState.deployUnit(unit)) {
            this.lastDeployTime = now; // Обновляем время последнего призыва
            console.log(`🤖 AI призвал ${card.name} на ${lane} дорожку`);

            // Проигрываем звук призыва, если он доступен
            if (window.SoundFX) window.SoundFX.playDeploy();
        }
    }

    // Метод сброса состояния ИИ (например, при начале новой игры)
    reset() {
        this.lastDeployTime = 0; // Сбрасываем время последнего призыва
        this.lastDecisionTime = 0; // Сбрасываем время последнего решения
    }
}

// Глобальная переменная для экземпляра ИИ (инициализируется позже)
window.AI = null;
