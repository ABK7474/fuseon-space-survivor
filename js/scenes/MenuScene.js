class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Arka plan
        this.add.image(width / 2, height / 2, 'background');
        
        // Başlık
        const title = this.add.text(width / 2, height / 3, 'SPACE SURVIVOR', {
            fontSize: '64px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#00ffff',
            stroke: '#8a2be2',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        
        // Alt başlık
        const subtitle = this.add.text(width / 2, height / 3 + 80, 'Fuseon Project', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#8a2be2'
        });
        subtitle.setOrigin(0.5);
        
        // Başla butonu
        const startButton = this.add.text(width / 2, height / 2 + 50, '[ BAŞLA ]', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#8a2be2',
            padding: { x: 20, y: 10 }
        });
        startButton.setOrigin(0.5);
        startButton.setInteractive({ useHandCursor: true });
        
        // Nasıl oynanır butonu
        const howToButton = this.add.text(width / 2, height / 2 + 120, '[ NASIL OYNANIR ]', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 15, y: 8 }
        });
        howToButton.setOrigin(0.5);
        howToButton.setInteractive({ useHandCursor: true });
        
        // Ayarlar butonu
        const settingsButton = this.add.text(width / 2, height / 2 + 180, '[ AYARLAR ]', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 15, y: 8 }
        });
        settingsButton.setOrigin(0.5);
        settingsButton.setInteractive({ useHandCursor: true });
        
        // Hover efektleri
        this.addButtonHoverEffect(startButton, '#8a2be2', '#b347ff');
        this.addButtonHoverEffect(howToButton, '#444444', '#666666');
        this.addButtonHoverEffect(settingsButton, '#444444', '#666666');
        
        // Tıklama olayları
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        howToButton.on('pointerdown', () => {
            this.showHowToPlay();
        });
        
        settingsButton.on('pointerdown', () => {
            this.showSettings();
        });
        
        // En yüksek skor
        const highScore = localStorage.getItem('highScore') || 0;
        const highScoreText = this.add.text(width / 2, height - 50, 
            `En Yüksek Skor: ${highScore}`, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffff00'
        });
        highScoreText.setOrigin(0.5);
        
        // Animasyonlu yıldızlar
        this.createStarfield();
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
    
    showHowToPlay() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Arka plan paneli
        const panel = this.add.rectangle(width / 2, height / 2, 600, 400, 0x000000, 0.9);
        panel.setStrokeStyle(2, 0x8a2be2);
        
        // Başlık
        const title = this.add.text(width / 2, height / 2 - 150, 'NASIL OYNANIR', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00ffff'
        });
        title.setOrigin(0.5);
        
        // Açıklama
        const instructions = [
            'KONTROLLER:',
            '• W,A,S,D veya Yön Tuşları: Hareket',
            '• Space veya Sol Tık: Ateş etme',
            '• P: Oyunu duraklat',
            '',
            'HEDEF:',
            '• Düşmanları yok et ve asteroidlerden kaç',
            '• Power-up\'ları topla',
            '• Hayatta kal ve yüksek skor yap!'
        ];
        
        const instructText = this.add.text(width / 2, height / 2, instructions.join('\n'), {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'left'
        });
        instructText.setOrigin(0.5);
        
        // Kapat butonu
        const closeButton = this.add.text(width / 2, height / 2 + 150, '[ KAPAT ]', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#8a2be2',
            padding: { x: 20, y: 10 }
        });
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            instructText.destroy();
            closeButton.destroy();
        });
        
        this.addButtonHoverEffect(closeButton, '#8a2be2', '#b347ff');
    }
    
    showSettings() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Arka plan paneli
        const panel = this.add.rectangle(width / 2, height / 2, 500, 350, 0x000000, 0.9);
        panel.setStrokeStyle(2, 0x8a2be2);
        
        // Başlık
        const title = this.add.text(width / 2, height / 2 - 130, 'AYARLAR', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#00ffff'
        });
        title.setOrigin(0.5);
        
        // Ses ayarları
        const soundText = this.add.text(width / 2, height / 2 - 50, 
            'Ses Efektleri: AÇIK', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        soundText.setOrigin(0.5);
        
        const musicText = this.add.text(width / 2, height / 2, 
            'Müzik: AÇIK', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff'
        });
        musicText.setOrigin(0.5);
        
        const skinInfo = this.add.text(width / 2, height / 2 + 50, 
            'Karakter Skini: assets/sprites/player.png', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffff00'
        });
        skinInfo.setOrigin(0.5);
        
        // Kapat butonu
        const closeButton = this.add.text(width / 2, height / 2 + 120, '[ KAPAT ]', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#8a2be2',
            padding: { x: 20, y: 10 }
        });
        closeButton.setOrigin(0.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        closeButton.on('pointerdown', () => {
            panel.destroy();
            title.destroy();
            soundText.destroy();
            musicText.destroy();
            skinInfo.destroy();
            closeButton.destroy();
        });
        
        this.addButtonHoverEffect(closeButton, '#8a2be2', '#b347ff');
    }
    
    createStarfield() {
        // Hareket eden yıldızlar için particle efekti
        for(let i = 0; i < 20; i++) {
            const star = this.add.circle(
                Math.random() * this.cameras.main.width,
                Math.random() * this.cameras.main.height,
                Math.random() * 2 + 1,
                0xffffff,
                Math.random()
            );
            
            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.1 },
                duration: 1000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }
    }
}
