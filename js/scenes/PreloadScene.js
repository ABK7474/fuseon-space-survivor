class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Yükleme çubuğu oluştur
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Yükleme metni
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Yükleniyor...',
            style: {
                font: '24px Arial',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Yüzde metni
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '20px Arial',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Progress bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 + 20, 320, 50);
        
        // Yükleme event'leri
        this.load.on('progress', (value) => {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x8a2be2, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 30, 300 * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // SPRITE'LARI YÜKLEYECEĞİMİZ YER
        // Eğer sprite dosyaları yoksa, geçici olarak renkli kareler oluşturuyoruz
        this.createPlaceholderSprites();
        
        // NOT: Gerçek sprite'ları şu şekilde yükleyeceksiniz:
        // this.load.image('player', 'assets/sprites/player.png');
        // this.load.image('enemy', 'assets/sprites/enemy.png');
        // this.load.image('asteroid', 'assets/sprites/asteroid.png');
        // this.load.image('bullet', 'assets/sprites/bullet.png');
        // this.load.image('powerup', 'assets/sprites/powerup.png');
        // this.load.image('background', 'assets/sprites/background.png');
        
        // Ses dosyaları (opsiyonel)
        // this.load.audio('shoot', 'assets/sounds/shoot.wav');
        // this.load.audio('explosion', 'assets/sounds/explosion.wav');
        // this.load.audio('powerup', 'assets/sounds/powerup.wav');
        // this.load.audio('bgMusic', 'assets/sounds/background.mp3');
    }
    
    createPlaceholderSprites() {
        // Geçici sprite'lar oluştur (gerçek sprite'lar yüklenene kadar)
        
        // Oyuncu sprite'ı
        const playerGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        playerGraphics.fillStyle(0x00ffff, 1);
        playerGraphics.fillTriangle(32, 0, 0, 64, 64, 64);
        playerGraphics.generateTexture('player', 64, 64);
        
        // Düşman sprite'ı
        const enemyGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        enemyGraphics.fillStyle(0xff0000, 1);
        enemyGraphics.fillRect(0, 0, 48, 48);
        enemyGraphics.generateTexture('enemy', 48, 48);
        
        // Asteroid sprite'ı
        const asteroidGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        asteroidGraphics.fillStyle(0x8b7355, 1);
        asteroidGraphics.fillCircle(32, 32, 32);
        asteroidGraphics.generateTexture('asteroid', 64, 64);
        
        // Mermi sprite'ı
        const bulletGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        bulletGraphics.fillStyle(0xffff00, 1);
        bulletGraphics.fillRect(0, 0, 8, 16);
        bulletGraphics.generateTexture('bullet', 8, 16);
        
        // Power-up sprite'ı
        const powerupGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        powerupGraphics.fillStyle(0x00ff00, 1);
        powerupGraphics.fillStar(16, 16, 5, 16, 8);
        powerupGraphics.generateTexture('powerup', 32, 32);
        
        // Arka plan
        const bgGraphics = this.make.graphics({ x: 0, y: 0 }, false);
        bgGraphics.fillStyle(0x000033, 1);
        bgGraphics.fillRect(0, 0, 800, 600);
        // Yıldızlar ekle
        for(let i = 0; i < 100; i++) {
            bgGraphics.fillStyle(0xffffff, Math.random());
            bgGraphics.fillCircle(
                Math.random() * 800,
                Math.random() * 600,
                Math.random() * 2
            );
        }
        bgGraphics.generateTexture('background', 800, 600);
    }

    create() {
        this.scene.start('MenuScene');
    }
}
