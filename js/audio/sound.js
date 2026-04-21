class SoundFX {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.loadAllSounds();
    }
    
    loadAllSounds() {
        const soundPaths = window.CONFIG?.SOUNDS || {};
        for (let key in soundPaths) {
            const audio = new Audio();
            audio.src = soundPaths[key];
            audio.preload = 'auto';
            audio.load(); // Принудительная загрузка
            this.sounds[key] = audio;
        }
        console.log('✅ Все звуки загружены', Object.keys(this.sounds));
    }
    
    play(soundName) {
        if (!this.enabled) return;
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => {
                console.log(`🔇 Звук ${soundName} не воспроизвелся:`, e);
                // Пробуем перезагрузить
                sound.load();
                sound.play().catch(e2 => console.log(`❌ Звук ${soundName} всё ещё недоступен`));
            });
        }
    }
    
    playDeploy() {
        this.play('deploy');
    }
    
    playHit() {
        this.play('hit');
    }
    
    playTowerHit() {
        this.play('towerHit');
    }
    
    playVictory() {
        this.play('victory');
    }
    
    playDefeat() {
        this.play('defeat');
    }
    
    playCardSelect() {
        this.play('cardSelect');
    }
    
    playInsufficientElixir() {
        this.play('insufficient');
    }
    
    playSpell() {
        this.play('spell');
    }
}