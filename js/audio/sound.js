// ============================================================
// sound.js - Звуковые эффекты (класс)
// ============================================================

/**
 * Класс для управления звуковыми эффектами в игре.
 * 
 * @description
 * SoundFX обеспечивает загрузку и воспроизведение звуковых эффектов.
 * Звуки загружаются из глобальной конфигурации window.CONFIG.SOUNDS.
 * 
 * @example
 * // Создание экземпляра
 * const sound = new SoundFX();
 * 
 * // Воспроизведение звуков
 * sound.playDeploy();    // звук размещения
 * sound.playHit();       // звук попадания
 * sound.playVictory();   // звук победы
 * 
 * // Отключение звука
 * sound.setEnabled(false);
 * 
 * @author Ваше Имя
 * @version 1.0.0
 */
class SoundFX {
    
    /**
     * Создает новый экземпляр SoundFX.
     * Автоматически загружает все звуки из конфигурации.
     */
    constructor() {
        /** @type {Object<string, HTMLAudioElement>} Хранилище звуковых объектов */
        this.sounds = {};
        
        /** @type {boolean} Флаг включения/выключения звука */
        this.enabled = true;
        
        this.loadAllSounds();
    }
    
    /**
     * Загружает все звуковые файлы из глобальной конфигурации.
     * @private
     */
    loadAllSounds() {
        const soundPaths = window.CONFIG?.SOUNDS || {};
        for (let key in soundPaths) {
            const audio = new Audio();
            audio.src = soundPaths[key];
            audio.preload = 'auto';
            this.sounds[key] = audio;
        }
        console.log('✅ Все звуки загружены');
    }
    
    /**
     * Воспроизводит звук по имени.
     * 
     * @param {string} soundName - Имя звука (ключ из window.CONFIG.SOUNDS)
     * @returns {void}
     * 
     * @example
     * sound.play('explosion');
     */
    play(soundName) {
        if (!this.enabled) return;
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log(`🔇 Звук ${soundName} заблокирован`));
        }
    }
    
    /**
     * Воспроизводит звук размещения юнита/башни.
     * 
     * @returns {void}
     * 
     * @example
     * sound.playDeploy();
     */
    playDeploy() {
        this.play('deploy');
    }
    
    /**
     * Воспроизводит звук попадания по цели.
     * 
     * @returns {void}
     * 
     * @example
     * sound.playHit();
     */
    playHit() {
        this.play('hit');
    }
    
    /**
     * Воспроизводит звук попадания по башне.
     * 
     * @returns {void}
     * 
     * @example
     * sound.playTowerHit();
     */
    playTowerHit() {
        this.play('towerHit');
    }
    
    /**
     * Воспроизводит звук победы.
     * 
     * @returns {void}
     * 
     * @example
     * sound.playVictory();
     */
    playVictory() {
        this.play('victory');
    }
    
    /**
     * Воспроизводит звук поражения.
     * 
     * @returns {void}
     * 
     * @example
     * sound.playDefeat();
     */
    playDefeat() {
        this.play('defeat');
    }

    /**
     * Воспроизводит звук выбора карты
     */
    playCardSelect() {
        this.play('cardSelect');
    }

    /**
     * Воспроизводит звук недостатка эликсира
     */
    playInsufficientElixir() {
        this.play('insufficient');
    }

    /**
     * Воспроизводит звук победы над башней
     */
    playTowerDestroyed() {
        this.play('towerDestroyed');
    }
    
    /**
     * Включает или выключает все звуковые эффекты.
     * 
     * @param {boolean} value - true для включения звука, false для выключения
     * @returns {void}
     * 
     * @example
     * // Выключить звук
     * sound.setEnabled(false);
     * 
     * // Включить звук
     * sound.setEnabled(true);
     */
    setEnabled(value) {
        this.enabled = value;
    }
}

// Экспорт глобального экземпляра (будет создан позже)
window.SoundFX = null;
