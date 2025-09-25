class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.finalWave = data.wave || 1;
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Arka plan
        this.add.rectangle(0, 0, width * 2, height * 2, 0x000000, 0.8);
        
        // Game Over başlığı
        const gameOverText = this.add.text(width / 2, height / 3, 'OYUN BİTTİ', {
            fontSize: '64px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 4
        });
        gameOverText.setOrigin(0.5);
        
        // Animasyon
        this.tweens.add({
            targets: gameOverText,
            scale: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back'
        });
        
        // Skor gösterimi
        const scoreText = this.add.text(width / 2, height / 2, 
            `Final Skor: ${this.finalScore}`, {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffff00'
        });
        scoreText.setOrigin(0.5);
        
        // Dalga gösterimi
        const waveText = this.add.text(width / 2, height / 2 + 50, 
            `Ulaşılan Dalga: ${this.finalWave}`, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#00ffff'
        });
        waveText.setOrigin(0.5);
        
        // En yüksek skor kontrolü
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.finalScore >= highScore) {
            const newRecordText = this.add.text(width / 2, height / 2 + 100, 
                '🏆 YENİ REKOR! 🏆', {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#00ff00'
            });
            newRecordText.setOrigin(0.5);
            
            // Parıltı efekti
            this.tweens.add({
                targets: newRecordText,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }
        
        // Tekrar oyna butonu
        const retryButton = this.add.text(width / 2, height / 2 + 160, '[ TEKRAR OYNA ]', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#00aa00',
            padding: { x: 20, y: 10 }
        });
        retryButton.setOrigin(0.5);
        retryButton.setInteractive({ useHandCursor: true });
        
        // Ana menü butonu
        const menuButton = this.add.text(width / 2, height / 2 + 220, '[ ANA MENÜ ]', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 15, y: 8 }
        });
        menuButton.setOrigin(0.5);
        menuButton.setInteractive({ useHandCursor: true });
        
        // Hover efektleri
        this.addButtonHoverEffect(retryButton, '#00aa00', '#00dd00');
        this.addButtonHoverEffect(menuButton, '#444444', '#666666');
        
        // Tıklama olayları
        retryButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
        
        // İstatistikler
        this.time.delayedCall(1000, () => {
            this.showStats();
        });
    }
    
    addButtonHoverEffect(button, normalColor, hoverColor) {
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: hoverColor });
            button.setScale(1.1);
        });
        
        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: normalColor });
            button.setScale(1);
        });
    }
    
    showStats() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // İstatistik paneli
        const statsPanel = this.add.rectangle(width - 150, height / 2, 200, 150, 0x000033, 0.9);
        statsPanel.setStrokeStyle(2, 0x00ffff);
        
        // Başlık
        const statsTitle = this.add.text(width - 150, height / 2 - 60, 'İSTATİSTİKLER', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#00ffff',
            fontStyle: 'bold'
        });
        statsTitle.setOrigin(0.5);
        
        // Rastgele istatistikler (örnek)
        const stats = [
            `Öldürülen Düşman: ${Math.floor(this.finalScore / 15)}`,
            `Toplanan Güç: ${Math.floor(Math.random() * 10 + 5)}`,
            `Hayatta Kalma: ${Math.floor(this.finalWave * 30)}sn`
        ];
        
        stats.forEach((stat, index) => {
            const statText = this.add.text(width - 150, height / 2 - 20 + (index * 25), stat, {
                fontSize: '12px',
                fontFamily: 'Arial',
                color: '#ffffff'
            });
            statText.setOrigin(0.5);
        });
        
        // Animasyon
        this.tweens.add({
            targets: [statsPanel, statsTitle],
            x: { from: width + 200, to: width - 150 },
            duration: 500,
            ease: 'Power2'
        });
    }
}
