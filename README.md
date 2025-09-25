# Fuseon Space Survivor 🚀

Uzay temalı arcade hayatta kalma oyunu.

## Kurulum

```bash
# Projeyi klonla
git clone https://github.com/[kullanici-adi]/fuseon-space-survivor.git

# Proje klasörüne gir
cd fuseon-space-survivor

# Bağımlılıkları yükle
npm install

# Oyunu başlat
npm start
```

Tarayıcınızda `http://localhost:8080` adresine gidin.

## Oynanış

- **W/A/S/D veya Yön Tuşları**: Hareket
- **Space veya Sol Tık**: Ateş etme
- **P**: Oyunu duraklat

## Özellikler

- Sonsuz dalga sistemi
- Power-up'lar (hız, çift ateş, kalkan)
- Skor sistemi
- Özelleştirilebilir karakter skini
- Ses efektleri ve müzik

## Karakter Skinini Değiştirme

1. `assets/sprites/` klasöründeki `player.png` dosyasını kendi spriteınızla değiştirin
2. Sprite boyutu: 64x64 piksel olmalı
3. Transparent arka plan kullanın (PNG formatı)

## Teknolojiler

- Phaser.js 3.70
- HTML5 Canvas
- JavaScript ES6

## Lisans

MIT
