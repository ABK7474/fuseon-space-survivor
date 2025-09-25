// Oyun konfigürasyonu
const gameConfig = {
    // Canvas boyutları
    width: 800,
    height: 600,
    
    // Oyuncu ayarları
    player: {
        speed: 300,
        health: 100,
        fireRate: 250, // milisaniye
        bulletSpeed: 500,
        sprite: 'player', // Sprite key
        scale: 0.8
    },
    
    // Düşman ayarları
    enemy: {
        baseSpeed: 100,
        baseHealth: 20,
        fireRate: 2000,
        bulletSpeed: 200,
        spawnRate: 2000, // milisaniye
        types: {
            basic: {
                health: 20,
                speed: 100,
                score: 10,
                color: 0xff0000
            },
            fast: {
                health: 15,
                speed: 200,
                score: 15,
                color: 0xffff00
            },
            tank: {
                health: 50,
                speed: 50,
                score: 25,
                color: 0x00ff00
            }
        }
    },
    
    // Asteroid ayarları
    asteroid: {
        minSpeed: 50,
        maxSpeed: 150,
        minRotation: 0.01,
        maxRotation: 0.05,
        spawnRate: 3000,
        sizes: {
            large: { scale: 1.0, health: 30, score: 5 },
            medium: { scale: 0.6, health: 20, score: 3 },
            small: { scale: 0.3, health: 10, score: 1 }
        }
    },
    
    // Power-up ayarları
    powerUp: {
        spawnChance: 0.1, // %10 şans
        duration: 5000, // milisaniye
        types: {
            health: { color: 0x00ff00, value: 25 },
            rapidFire: { color: 0xffff00, fireRate: 100 },
            shield: { color: 0x00ffff, duration: 3000 },
            doubleShot: { color: 0xff00ff }
        }
    },
    
    // Dalga sistemi
    waves: {
        enemyIncrement: 2,
        speedIncrement: 10,
        healthIncrement: 5
    },
    
    // Ses ayarları
    audio: {
        masterVolume: 0.5,
        sfxVolume: 0.6,
        musicVolume: 0.3
    }
};
