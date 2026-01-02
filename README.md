# 🤖 AI HR - Human Resources Management System

AI texnologiyalari yordamida HR jarayonlarini avtomatlashtiradigan zamonaviy web ilova.

---

## 📋 Loyiha Haqida

**AI HR** - bu xodimlarni boshqarish, ro'yxatga olish va monitoring qilish uchun mo'ljallangan to'liq funksional HR tizimi.

### Asosiy Funksiyalar:
- ✅ Xodimlarni ro'yxatga olish
- ✅ Xodimlar ma'lumotlarini boshqarish
- ✅ Dashboard va statistika
- ✅ Telegram bot integratsiyasi
- ✅ AI yordamida avtomatlashtirish

---

## 🛠️ Texnologiyalar

### Frontend:
- ⚛️ **React 18** - UI kutubxonasi
- 🔷 **TypeScript** - Type safety
- ⚡ **Vite** - Build tool
- 🎨 **Tailwind CSS** - Styling
- 🔄 **React Router** - Navigatsiya
- 📡 **Axios** - API so'rovlar

### Backend (Rejada):
- 🟢 **Node.js** + Express
- 🗄️ **MongoDB** / PostgreSQL
- 🤖 **Telegram Bot API**

---

## 🚀 O'rnatish va Ishga Tushirish

### 1. Repository'ni klonlash:
```bash
git clone https://github.com/temurbek1306/ai_hr.git
cd ai_hr
```

### 2. Environment variables sozlash:
```bash
# .env.example faylidan nusxa oling
cp .env.example .env

# .env faylini o'z ma'lumotlaringiz bilan to'ldiring
```

### 3. Dependencies o'rnatish:
```bash
npm install
```

### 4. Development serverini ishga tushirish:
```bash
npm run dev
```

Brauzerda `http://localhost:5173` ochiladi.

### 5. Production build:
```bash
npm run build
npm run preview
```

---

## 📁 Loyiha Strukturasi

```
AI HR/
├── src/
│   ├── components/     # React komponentlar
│   ├── pages/          # Sahifalar
│   ├── services/       # API xizmatlari
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   └── utils/          # Yordamchi funksiyalar
├── public/             # Static fayllar
├── .env.example        # Environment variables namunasi
├── .gitignore         # Git ignore qoidalari
└── README.md          # Bu fayl
```

Batafsil ma'lumot uchun qarang: **[Frontend Guide](./docs/frontend_guide.md)**

---

## 👥 Jamoa Uchun Git Workflow

### Branch Strategiyasi:
```
main                          # Production kod
└── feature/[ism-funksiya]   # Har bir funksiya uchun alohida branch
```

### Ish Jarayoni:

#### 1. Yangi branch yaratish:
```bash
git checkout -b feature/yangi-funksiya
# Masalan: git checkout -b feature/ali-dashboard
```

#### 2. Kod yozish va saqlash:
```bash
git add .
git commit -m "feat: yangi funksiya qo'shildi"
```

#### 3. GitHub'ga yuklash:
```bash
git push origin feature/yangi-funksiya
```

#### 4. Pull Request ochish:
- GitHub'da repository'ga kiring
- "Pull requests" → "New pull request"
- O'z branch'ingizni `main` bilan solishtiring
- Tavsif yozing va "Create pull request" bosing

#### 5. Code Review:
- Jamoa a'zolari kodingizni ko'rib chiqadi
- Fikr-mulohazalar beriladi
- Tasdiqlangandan keyin `main`ga merge qilinadi

### Commit Message Qoidalari:
```
feat: yangi funksiya qo'shildi
fix: xatolik tuzatildi
docs: hujjat yangilandi
style: CSS o'zgartirildi
refactor: kod refaktoring qilindi
test: test qo'shildi
```

---

## 🎯 Vazifalar Taqsimoti

| Developer | Vazifa | Branch |
|-----------|--------|--------|
| Developer 1 | Authentication (Login/Register) | `feature/auth` |
| Developer 2 | Dashboard + Statistics | `feature/dashboard` |
| Developer 3 | Employee Management | `feature/employees` |
| Developer 4 | Common Components | `feature/components` |

---

## 🤖 Telegram Bot

Bot manzili: [@itpark_hr_assistant_bot](https://t.me/itpark_hr_assistant_bot)

> ⚠️ **Muhim:** Bot token'ini `.env` faylida saqlang va GitHub'ga YUKLMANG!

---

## 📚 Hujjatlar

- [Frontend To'liq Yo'riqnoma](./docs/frontend_guide.md)
- [API Documentation](./docs/api.md) _(tez orada)_
- [Component Library](./docs/components.md) _(tez orada)_

---

## 🤝 Hissa Qo'shish

1. Repository'ni fork qiling
2. O'z branch'ingizni yarating (`git checkout -b feature/yangi-funksiya`)
3. O'zgarishlarni commit qiling (`git commit -m 'feat: yangi funksiya'`)
4. Branch'ni push qiling (`git push origin feature/yangi-funksiya`)
5. Pull Request oching

---

## 📞 Aloqa

Savollar bo'lsa, jamoa chatida yoki GitHub Issues'da so'rang!

---

## 📄 Litsenziya

MIT License - batafsil ma'lumot uchun [LICENSE](LICENSE) faylini ko'ring.

---

**Muvaffaqiyatli kodlash! 🚀**
