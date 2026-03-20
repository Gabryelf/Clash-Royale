// ========== SOUND MODULE ==========
// SOUND - звуковые эффекты
window.SoundFX = {
    deployAudio: null,
    hitAudio: null,
    
    init: function() {
        this.deployAudio = document.getElementById('deploySound');
        this.hitAudio = document.getElementById('hitSound');
        
        if (this.deployAudio) this.deployAudio.src = CONFIG.SOUNDS.deploy;
        if (this.hitAudio) this.hitAudio.src = CONFIG.SOUNDS.hit;
    },
    
    playDeploy: function() {
        if (this.deployAudio) {
            this.deployAudio.currentTime = 0;
            this.deployAudio.play().catch(e => console.log('audio blocked'));
        }
    },
    
    playHit: function() {
        if (this.hitAudio) {
            this.hitAudio.currentTime = 0;
            this.hitAudio.play().catch(e => console.log('audio blocked'));
        }
    }
};