# 🎮 Wupex Store — React Native App

تطبيق متجر بطاقات رقمية احترافي مبني بـ React Native + Expo

---

## ✅ لماذا React Native؟
- **تطبيق حقيقي 100%** — ليس WebView
- **يعمل على جميع أجهزة Android** من v5 حتى أحدث إصدار
- **لا صفحة بيضاء** — لأنه native components حقيقية
- **أداء احترافي** مثل تطبيقات Google Play

---

## 🚀 كيف تبني APK بدون تثبيت أي شيء؟

### الطريقة 1: Expo Snack (الأسرع - مجاني)
1. افتح **[snack.expo.dev](https://snack.expo.dev)**
2. احذف الملفات الموجودة
3. ارفع ملفات المشروع من الـ ZIP
4. اضغط **My Device** → امسح QR Code لمعاينة فورية على هاتفك

### الطريقة 2: EAS Build (APK حقيقي - مجاني)
1. افتح **[expo.dev](https://expo.dev)** وأنشئ حساباً مجانياً
2. في أي terminal online (مثل [gitpod.io](https://gitpod.io)):
   ```bash
   npm install -g eas-cli
   eas login
   eas build -p android --profile preview
   ```
3. حمّل APK من رابط يظهر بعد البناء ✅

### الطريقة 3: GitHub + EAS (الأفضل)
1. ارفع المشروع على GitHub
2. اربطه بـ Expo Dashboard
3. اضغط **Build** → اختر **Android** → حمّل APK

---

## 📱 حسابات التجربة
| المستخدم | Username | Password | الرصيد |
|---------|----------|----------|--------|
| Admin   | admin    | admin123 | $500   |
| User    | user@test.com | user123 | $0 |

---

## 🎯 مميزات التطبيق
- ✅ شاشة Intro احترافية مع animation
- ✅ الواجهة الرئيسية بدون login إجباري
- ✅ 18 منتج + 6 تصنيفات + بحث
- ✅ سلة تسوق كاملة + Checkout
- ✅ محفظة مع إضافة رصيد
- ✅ سجل الطلبات والمعاملات
- ✅ تسجيل دخول/خروج + إنشاء حساب
- ✅ فحص الأكواد + الفاتورة + الإعدادات

---

## 📂 هيكل المشروع
```
wupex-expo/
├── App.js                          ← نقطة الدخول + Navigation
├── app.json                        ← إعدادات Expo
├── package.json                    ← المكتبات
└── src/
    ├── data/index.js               ← المنتجات + البيانات
    ├── context/AppContext.js       ← Global State
    ├── components/ProductCard.js   ← مكون البطاقة
    └── screens/
        ├── SplashScreen.js         ← شاشة الـ Intro
        ├── HomeScreen.js           ← الرئيسية
        ├── ProductsScreen.js       ← المنتجات
        ├── ProductDetailScreen.js  ← تفاصيل المنتج
        ├── CartScreen.js           ← السلة
        └── OtherScreens.js        ← باقي الشاشات
```
