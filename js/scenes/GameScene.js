class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        
        // Oyun değişkenleri
        this.score = 0;
        this.wave = 1;
        this.isPaused = false;
        this.gameOver = false;
        this.enemySpawnTimer = 0;
        this.asteroidSpawnTimer = 0;
        this.waveEnemyCount = 5;
    }
    
    create() {
        // Arka plan
        this.add.image(400, 300, 'background');
        
        // Gruplar oluştur
        this.bullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 30,
            runChildUpdate: true
        });
        
        this.enemyBullets = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Image,
            maxSize: 50,
            runChildUpdate: true
        });
        
        this.enemies = this.physics.add.group();
        this.asteroids = this.physics.add.group();
        this.powerUps = this.physics.add.group();
        
        // Oyuncu oluştur
        this.player = new Player(this, 400, 500);
        
        // Kontroller
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        
        // Mouse kontrolü
        this.input.on('pointerdown', () => {
            if (!this.gameOver && !this.isPaused) {
                this.player.shoot(this.bullets);
            }
        });
        
        // Pause kontrolü
        this.pauseKey.on('down', () => {
            this.togglePause();
        });
        
        // Collision detection
        this.setupCollisions();
        
        // UI metinleri
        this.createUI();
        
        // Spawn timer'ları başlat
        this.time.addEvent({
            delay: gameConfig.enemy.spawnRate,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
        
        this.time.addEvent({
            delay: gameConfig.asteroid.spawnRate,
            callback: this.spawnAsteroid,
            callbackScope: this,
            loop: true
        });
    }
    
    update(time, delta) {
        if (this.gameOver || this.isPaused) return;
        
        // Oyuncu kontrolü
        this.handlePlayerMovement();
        
        // Ateş etme
        if (this.spaceBar.isDown) {
            this.player.shoot(this.bullets);
        }
        
        // Düşmanları güncelle
        this.enemies.children.entries.forEach(enemy => {
            enemy.update(time, delta);
            
            // Düşman ateş etme
            if (enemy.canShoot && Phaser.Math.Between(0, 100) < 2) {
                enemy.shoot(this.enemyBullets);
            }
        });
        
        // Mermileri sınır dışına çıkınca yok et
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.y < 0) {
                this.bullets.killAndHide(bullet);
            }
        });
        
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.y > 600) {
                this.enemyBullets.killAndHide(bullet);
            }
        });
        
        // UI güncelle
        this.updateUI();
    }
    
    handlePlayerMovement() {
        const speed = this.player.speed;
        
        // Reset velocity
        this.player.sprite.setVelocity(0);
        
        // Yatay hareket
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.sprite.setVelocityX(-speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.sprite.setVelocityX(speed);
        }
        
        // Dikey hareket
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.sprite.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.sprite.setVelocityY(speed);
        }
        
        // Sınırları kontrol et
        this.player.sprite.x = Phaser.Math.Clamp(this.player.sprite.x, 32, 768);
        this.player.sprite.y = Phaser.Math.Clamp(this.player.sprite.y, 32, 568);
    }
    
    setupCollisions() {
        // Oyuncu mermisi - Düşman
        this.physics.add.collider(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.destroy();
            enemy.takeDamage(10);
            
            if (enemy.health <= 0) {
                this.score += enemy.scoreValue || 10;
                this.createExplosion(enemy.x, enemy.y);
                
                // Power-up şansı
                if (Math.random() < gameConfig.powerUp.spawnChance) {
                    this.spawnPowerUp(enemy.x, enemy.y);
                }
                
                enemy.destroy();
                
                // Dalga kontrolü
                if (this.enemies.children.entries.length === 0) {
                    this.nextWave();
                }
            }
        });
        
        // Oyuncu mermisi - Asteroid
        this.physics.add.collider(this.bullets, this.asteroids, (bullet, asteroid) => {
            bullet.destroy();
            asteroid.health -= 10;
            
            if (asteroid.health <= 0) {
                this.score += asteroid.scoreValue || 5;
                this.createExplosion(asteroid.x, asteroid.y);
                
                // Asteroid parçalanması
                if (asteroid.scale > 0.4) {
                    this.spawnAsteroidFragments(asteroid.x, asteroid.y, asteroid.scale * 0.5);
                }
                
                asteroid.destroy();
            }
        });
        
        // Düşman mermisi - Oyuncu
        this.physics.add.collider(this.enemyBullets, this.player.sprite, (player, bullet) => {
            if (!this.player.isInvulnerable) {
                bullet.destroy();
                this.player.takeDamage(10);
                
                if (this.player.health <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Oyuncu - Düşman
        this.physics.add.collider(this.player.sprite, this.enemies, (player, enemy) => {
            if (!this.player.isInvulnerable) {
                this.player.takeDamage(20);
                enemy.destroy();
                this.createExplosion(enemy.x, enemy.y);
                
                if (this.player.health <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Oyuncu - Asteroid
        this.physics.add.collider(this.player.sprite, this.asteroids, (player, asteroid) => {
            if (!this.player.isInvulnerable) {
                this.player.takeDamage(15);
                asteroid.destroy();
                this.createExplosion(asteroid.x, asteroid.y);
                
                if (this.player.health <= 0) {
                    this.endGame();
                }
            }
        });
        
        // Oyuncu - PowerUp
        this.physics.add.overlap(this.player.sprite, this.powerUps, (player, powerUp) => {
            this.applyPowerUp(powerUp.powerType);
            powerUp.destroy();
        });
    }
    
    spawnEnemy() {
        if (this.gameOver || this.isPaused) return;
        if (this.enemies.children.entries.length >= this.waveEnemyCount) return;
        
        const x = Phaser.Math.Between(50, 750);
        const y = -50;
        const enemyTypes = ['basic', 'fast', 'tank'];
        const type = enemyTypes[Phaser.Math.Between(0, 2)];
        
        const enemy = new Enemy(this, x, y, type);
        this.enemies.add(enemy.sprite);
    }
    
    spawnAsteroid() {
        if (this.gameOver || this.isPaused) return;
        
        const x = Phaser.Math.Between(50, 750);
        const y = -50;
        const sizes = ['large', 'medium', 'small'];
        const size = sizes[Phaser.Math.Between(0, 2)];
        
        const asteroid = new Asteroid(this, x, y, size);
        this.asteroids.add(asteroid.sprite);
    }
    
    spawnAsteroidFragments(x, y, scale) {
        for (let i = 0; i < 2; i++) {
            const fragment = new Asteroid(this, x, y, 'small');
            fragment.sprite.setScale(scale);
            fragment.sprite.setVelocity(
                Phaser.Math.Between(-100, 100),
                Phaser.Math.Between(-100, 100)
            );
            this.asteroids.add(fragment.sprite);
        }
    }
    
    spawnPowerUp(x, y) {
        const types = Object.keys(gameConfig.powerUp.types);
        const type = types[Phaser.Math.Between(0, types.length - 1)];
        const powerUp = new PowerUp(this, x, y, type);
        this.powerUps.add(powerUp.sprite);
    }
    
    applyPowerUp(type) {
        switch(type) {
            case 'health':
                this.player.health = Math.min(this.player.health + 25, 100);
                break;
            case 'rapidFire':
                this.player.fireRate = 100;
                this.time.delayedCall(5000, () => {
                    this.player.fireRate = gameConfig.player.fireRate;
                });
                break;
            case 'shield':
                this.player.activateShield(3000);
                break;
            case 'doubleShot':
                this.player.doubleShot = true;
                this.time.delayedCall(5000, () => {
                    this.player.doubleShot = false;
                });
                break;
        }
        
        // Power-up efekti
        this.cameras.main.flash(100, 255, 255, 0);
    }
    
    createExplosion(x, y) {
        // Patlama efekti
        const explosion = this.add.circle(x, y, 5, 0xffff00);
        
        this.tweens.add({
            targets: explosion,
            scale: 3,
            alpha: 0,
            duration: 300,
            onComplete: () => explosion.destroy()
        });
    }
    
    nextWave() {
        this.wave++;
        this.waveEnemyCount += gameConfig.waves.enemyIncrement;
        
        // Dalga geçiş efekti
        const waveText = this.add.text(400, 300, `DALGA ${this.wave}`, {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffff00',
            stroke: '#ff0000',
            strokeThickness: 4
        });
        waveText.setOrigin(0.5);
        
        this.tweens.add({
            targets: waveText,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            onComplete: () => waveText.destroy()
        });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.physics.pause();
            this.pauseText = this.add.text(400, 300, 'OYUN DURAKLATILDI', {
                fontSize: '36px',
                fontFamily: 'Arial',
                color: '#ffffff',
                backgroundColor: '#000000',
                padding: { x: 20, y: 10 }
            });
            this.pauseText.setOrigin(0.5);
        } else {
            this.physics.resume();
            if (this.pauseText) this.pauseText.destroy();
        }
    }
    
    createUI() {
        // UI elemanları oyunun dışında HTML ile gösteriliyor
        // Buraya ekstra UI eklenebilir
    }
    
    updateUI() {
        // HTML UI güncelleme
        document.getElementById('score').textContent = this.score;
        document.getElementById('health').textContent = Math.max(0, this.player.health);
        document.getElementById('wave').textContent = this.wave;
    }
    
    endGame() {
        this.gameOver = true;
        
        // High score kaydet
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score);
        }
        
        // Game over sahnesine geç
        this.scene.start('GameOverScene', { score: this.score, wave: this.wave });
    }
}
