# Hasret İçin Romantik Site

Aşk mektubu + iltifat karuseli + mini oyunlar (Kalp Avı & Hafıza) + Evet/Hayır (kaçan buton) + otomatik ekran görüntüsü.

## Hızlı Çalıştırma
`index.html` dosyasını tarayıcıda açmanız yeterli.

## Dosya Yapısı
- `index.html` – Ana sayfa
- `assets/css/style.css` – Stil
- `assets/js/app.js` – Etkileşimler
- `assets/img/` – (İsteğe bağlı görseller)

## GitHub Pages Yayınlama Adımları
1. GitHub'da yeni **public** repo oluştur (ör: `hasret-site`). Boş bırak (README vs ekleme).
2. Yerel klasörde (bu proje kökü):

```powershell
# 1) Git başlat
git init

# 2) Ana branch'i main yap
git checkout -b main

# 3) Dosyaları ekle ve ilk commit
git add .
git commit -m "Initial romantic site"

# 4) Uzak repo ekle (kendi kullanıcı adını gir)
git remote add origin https://github.com/KULLANICI_ADIN/hasret-site.git

# 5) Gönder
git push -u origin main
```

3. GitHub repo sayfasında: Settings → Pages → Source = `Deploy from a branch` → Branch: `main` + `/ (root)` → Save.
4. Sayfa birkaç dakika içinde şu formda açılır: `https://KULLANICI_ADIN.github.io/hasret-site/`

## URL Kısaltma / Özel İsim
`hasret` gibi daha kısa bir repo adı seçerseniz URL daha kısa olur.

## Opsiyonel İyileştirmeler
- Favicon ekle: `assets/img/favicon.png` ve `<link rel="icon" href="assets/img/favicon.png">`
- Açıklama / sosyal kart: Open Graph meta etiketleri
- Custom domain: `Settings → Pages` altından domain bağlama, repo köküne `CNAME` dosyası ekleme.

## Open Graph (Opsiyonel)
```html
<meta property="og:title" content="Hasret İçin" />
<meta property="og:description" content="Minnoş sürpriz: aşk mektubu + oyunlar" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://KULLANICI_ADIN.github.io/hasret-site/" />
<meta property="og:image" content="https://KULLANICI_ADIN.github.io/hasret-site/assets/img/preview.png" />
```

## Güncelleme Gönderme
```powershell
git add .
git commit -m "Mesaj listesi güncellendi"
git push
```

## Gizlilik
Her şey statik; sunucuya veri gitmez. Ekran görüntüsü tarayıcıda üretilir.

---
Keyifli kullanım ❤️
