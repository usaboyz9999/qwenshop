// ─── COLORS ──────────────────────────────────────────────────────────────────
export const DARK_COLORS = {
  bg: '#0d0b1e', bg2: '#1a1535', bg3: '#110e2a',
  border: '#2a1f4a', text: '#ffffff', textSub: '#e2d9f3',
  textMuted: '#9575b8', accent: '#fbbf24',
  primary: '#7c3aed', primary2: '#a855f7',
  green: '#34d399', red: '#f87171',
};

export const LIGHT_COLORS = {
  bg: '#f8f5ff', bg2: '#ffffff', bg3: '#ede9fe',
  border: '#ddd6fe', text: '#1e1b4b', textSub: '#312e81',
  textMuted: '#6d28d9', accent: '#d97706',
  primary: '#7c3aed', primary2: '#a855f7',
  green: '#059669', red: '#dc2626',
};

export const COLORS = DARK_COLORS;

// ─── CURRENCIES ──────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$',    name: 'US Dollar',      nameAr: 'دولار أمريكي',   flag: '🇺🇸' },
  { code: 'SAR', symbol: 'SR',   name: 'Saudi Riyal',    nameAr: 'ريال سعودي',     flag: '🇸🇦' },
  { code: 'AED', symbol: 'AED',  name: 'UAE Dirham',     nameAr: 'درهم إماراتي',   flag: '🇦🇪' },
  { code: 'KWD', symbol: 'KD',   name: 'Kuwaiti Dinar',  nameAr: 'دينار كويتي',    flag: '🇰🇼' },
  { code: 'QAR', symbol: 'QR',   name: 'Qatari Riyal',   nameAr: 'ريال قطري',      flag: '🇶🇦' },
  { code: 'BHD', symbol: 'BD',   name: 'Bahraini Dinar', nameAr: 'دينار بحريني',   flag: '🇧🇭' },
  { code: 'OMR', symbol: 'RO',   name: 'Omani Rial',     nameAr: 'ريال عُماني',    flag: '🇴🇲' },
  { code: 'EUR', symbol: '€',    name: 'Euro',            nameAr: 'يورو',           flag: '🇪🇺' },
  { code: 'GBP', symbol: '£',    name: 'British Pound',  nameAr: 'جنيه إسترليني',  flag: '🇬🇧' },
  { code: 'EGP', symbol: 'EGP',  name: 'Egyptian Pound', nameAr: 'جنيه مصري',      flag: '🇪🇬' },
  { code: 'TRY', symbol: '₺',    name: 'Turkish Lira',   nameAr: 'ليرة تركية',     flag: '🇹🇷' },
  { code: 'JPY', symbol: '¥',    name: 'Japanese Yen',   nameAr: 'ين ياباني',      flag: '🇯🇵' },
];

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const CATEGORIES = [
  'All', 'Gift Cards', 'Gaming', 'Streaming',
  'Mobile', 'Subscriptions', 'VPN', 'Education', 'Software',
];

// ─── DEMO USERS ───────────────────────────────────────────────────────────────
export const DEMO_USERS = [
  { id: 1, name: 'Admin', username: 'admin', email: 'admin@mezcards.com', password: 'admin123', wallet: 500, avatar: 'AD', spent: 125.48 },
  { id: 2, name: 'Test User', username: 'user', email: 'user@test.com', password: 'user123', wallet: 0, avatar: 'TU', spent: 0 },
];

export const INITIAL_ORDERS = [
  { id: '#ORD-4821', name: 'PlayStation Plus 1 Year', customer: 'Admin', date: '15 Mar', amount: '$59.99', status: 'completed' },
  { id: '#ORD-3917', name: 'Steam Wallet $50', customer: 'Admin', date: '12 Mar', amount: '$50.00', status: 'completed' },
  { id: '#ORD-2743', name: 'Netflix Premium 1M', customer: 'Admin', date: '10 Mar', amount: '$15.49', status: 'completed' },
];

export const INITIAL_TRANSACTIONS = [
  { icon: '🎮', name: 'PlayStation Plus 1 Year', date: '15 Mar', amount: '-$59.99', type: 'debit', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  { icon: '🎮', name: 'Steam Wallet $50', date: '12 Mar', amount: '-$50.00', type: 'debit', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  { icon: '🎬', name: 'Netflix Premium', date: '10 Mar', amount: '-$15.49', type: 'debit', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  { icon: '💳', name: 'Wallet Top-up', date: '8 Mar', amount: '+$200.00', type: 'credit', color: '#34d399', bg: 'rgba(52,211,153,0.15)' },
];

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const PRODUCTS = [
  // ── Gift Cards ─────────────────────────────────────────────────────────────
  {
    id: 1, name: 'Amazon Gift Card', short: 'AMZ', cat: 'Gift Cards',
    desc: 'Shop millions of items. The perfect gift for every occasion and every budget.',
    colors: ['#232f3e', '#ff9900'],
    image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&q=80',
    badge: 'Popular', badgeColor: '#f97316',
    pkgs: [{ a: '$10', p: 10 }, { a: '$25', p: 25 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }],
  },
  {
    id: 2, name: 'Apple iTunes & App Store', short: 'APPLE', cat: 'Gift Cards',
    desc: 'Redeem on App Store, Apple Music, Apple TV+, iCloud and more.',
    colors: ['#1d1d1f', '#6e6e73'],
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
    pkgs: [{ a: '$15', p: 15 }, { a: '$25', p: 25 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }],
  },
  {
    id: 3, name: 'Google Play Gift Card', short: 'PLAY', cat: 'Gift Cards',
    desc: 'Buy apps, games, movies, books and subscriptions on Google Play.',
    colors: ['#4285f4', '#34a853'],
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80',
    pkgs: [{ a: '$10', p: 10 }, { a: '$25', p: 25 }, { a: '$50', p: 50 }],
  },
  {
    id: 4, name: 'Noon Gift Card', short: 'NOON', cat: 'Gift Cards',
    desc: 'Shop fashion, electronics, home & beauty on Noon.com.',
    colors: ['#f5c518', '#1a1a1a'],
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80',
    pkgs: [{ a: '50 SAR', p: 13.5 }, { a: '100 SAR', p: 27 }, { a: '200 SAR', p: 53 }, { a: '500 SAR', p: 133 }],
  },
  {
    id: 5, name: 'Starbucks Gift Card', short: 'STBKS', cat: 'Gift Cards',
    desc: 'Treat yourself or a friend to your favorite Starbucks beverage or food.',
    colors: ['#00704a', '#1e3932'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
    pkgs: [{ a: '$10', p: 10 }, { a: '$25', p: 25 }, { a: '$50', p: 50 }],
  },
  {
    id: 6, name: 'IKEA Gift Card', short: 'IKEA', cat: 'Gift Cards',
    desc: 'Use on furniture, accessories and home decor at any IKEA store.',
    colors: ['#0058a3', '#ffda1a'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    pkgs: [{ a: '$25', p: 25 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }],
  },
  {
    id: 7, name: 'Visa Gift Card', short: 'VISA', cat: 'Gift Cards',
    desc: 'Accepted everywhere Visa debit cards are accepted worldwide.',
    colors: ['#1a1f71', '#f7a600'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&q=80',
    badge: 'New', badgeColor: '#10b981',
    pkgs: [{ a: '$25', p: 25 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }, { a: '$200', p: 200 }],
  },
  {
    id: 8, name: 'PayPal Gift Card', short: 'PAYPL', cat: 'Gift Cards',
    desc: 'Add funds to any PayPal account. Shop anywhere PayPal is accepted.',
    colors: ['#003087', '#009cde'],
    image: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&q=80',
    pkgs: [{ a: '$10', p: 10 }, { a: '$25', p: 25 }, { a: '$50', p: 50 }],
  },

  // ── Gaming ──────────────────────────────────────────────────────────────────
  {
    id: 10, name: 'Steam Wallet', short: 'STEAM', cat: 'Gaming',
    desc: 'Add funds to your Steam wallet. Buy games, DLC, and in-game items.',
    colors: ['#1b2838', '#66c0f4'],
    image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400&q=80',
    badge: 'Hot', badgeColor: '#ef4444',
    pkgs: [{ a: '$5', p: 5 }, { a: '$10', p: 10 }, { a: '$20', p: 20 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }],
  },
  {
    id: 11, name: 'PlayStation Store (PSN)', short: 'PSN', cat: 'Gaming',
    desc: 'Add funds to your PlayStation wallet for games, add-ons and more.',
    colors: ['#003087', '#0070d1'],
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80',
    pkgs: [{ a: '$10', p: 10 }, { a: '$20', p: 20 }, { a: '$50', p: 50 }, { a: '$100', p: 100 }],
  },
  {
    id: 12, name: 'Xbox Game Pass Ultimate', short: 'XBOX', cat: 'Gaming',
    desc: '100+ high-quality games on console, PC and cloud. Includes EA Play.',
    colors: ['#107c10', '#0a5009'],
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 14.99 }, { a: '3 Months', p: 38.99 }, { a: '6 Months', p: 74.99 }],
  },
  {
    id: 13, name: 'PUBG Mobile UC', short: 'PUBG', cat: 'Gaming',
    desc: 'Unknown Cash for PUBG Mobile. Buy outfits, crates and upgrades.',
    colors: ['#c8a84b', '#6b4c1e'],
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80',
    badge: 'Popular', badgeColor: '#f97316',
    pkgs: [{ a: '60 UC', p: 0.99 }, { a: '325 UC', p: 4.99 }, { a: '660 UC', p: 9.99 }, { a: '1800 UC', p: 24.99 }, { a: '3850 UC', p: 49.99 }],
  },
  {
    id: 14, name: 'Free Fire Diamonds', short: 'FF', cat: 'Gaming',
    desc: 'Diamonds for Garena Free Fire. Unlock characters, skins and exclusive pets.',
    colors: ['#f04000', '#ff8c00'],
    image: 'https://images.unsplash.com/photo-1535223289429-462ea9301402?w=400&q=80',
    pkgs: [{ a: '100 Dia', p: 1.49 }, { a: '310 Dia', p: 3.99 }, { a: '520 Dia', p: 6.49 }, { a: '1060 Dia', p: 12.99 }, { a: '2180 Dia', p: 25.99 }],
  },
  {
    id: 15, name: 'Valorant Points (VP)', short: 'VAL', cat: 'Gaming',
    desc: 'Riot Points for Valorant. Buy weapon skins, agents and battle pass.',
    colors: ['#ff4655', '#0f1923'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    pkgs: [{ a: '475 VP', p: 4.99 }, { a: '1000 VP', p: 9.99 }, { a: '2050 VP', p: 19.99 }, { a: '3650 VP', p: 34.99 }],
  },
  {
    id: 16, name: 'Roblox Robux', short: 'ROB', cat: 'Gaming',
    desc: 'In-game currency for Roblox. Customize your avatar and unlock game passes.',
    colors: ['#e8192c', '#8b0000'],
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=400&q=80',
    pkgs: [{ a: '400 Robux', p: 4.99 }, { a: '800 Robux', p: 9.99 }, { a: '1700 Robux', p: 19.99 }, { a: '4500 Robux', p: 49.99 }],
  },
  {
    id: 17, name: 'Mobile Legends Diamonds', short: 'MLBB', cat: 'Gaming',
    desc: 'Diamonds for MLBB. Buy skins, heroes and exclusive battle effects.',
    colors: ['#00a8ff', '#0652dd'],
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80',
    pkgs: [{ a: '56 Dia', p: 0.99 }, { a: '170 Dia', p: 2.99 }, { a: '565 Dia', p: 9.99 }, { a: '1135 Dia', p: 19.99 }],
  },
  {
    id: 18, name: 'Genshin Impact Crystals', short: 'GI', cat: 'Gaming',
    desc: 'Genesis Crystals for Genshin Impact. Pull your favorite characters and weapons.',
    colors: ['#3b5bdb', '#845ef7'],
    image: 'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=400&q=80',
    pkgs: [{ a: '60 Crystals', p: 0.99 }, { a: '300 Crystals', p: 4.99 }, { a: '980 Crystals', p: 14.99 }, { a: '1980 Crystals', p: 29.99 }],
  },
  {
    id: 19, name: 'Minecraft Java + Bedrock', short: 'MC', cat: 'Gaming',
    desc: 'Full access to Minecraft Java & Bedrock editions. Build, explore and survive.',
    colors: ['#5b8a2d', '#3c5a1a'],
    image: 'https://images.unsplash.com/photo-1587095951604-287a0b3d7b99?w=400&q=80',
    pkgs: [{ a: 'Full Game', p: 29.99 }],
  },
  {
    id: 20, name: 'League of Legends RP', short: 'LOL', cat: 'Gaming',
    desc: 'Riot Points for LoL. Buy champions, skins, ward skins and more.',
    colors: ['#c89b3c', '#1e2328'],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80',
    badge: 'New', badgeColor: '#10b981',
    pkgs: [{ a: '650 RP', p: 4.99 }, { a: '1380 RP', p: 9.99 }, { a: '2800 RP', p: 19.99 }],
  },
  {
    id: 21, name: 'Call of Duty Points (CP)', short: 'COD', cat: 'Gaming',
    desc: 'CoD Points for Call of Duty. Buy operator bundles, weapon blueprints.',
    colors: ['#1a1a1a', '#ff6600'],
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80',
    pkgs: [{ a: '500 CP', p: 4.99 }, { a: '1100 CP', p: 9.99 }, { a: '2400 CP', p: 19.99 }, { a: '5000 CP', p: 39.99 }],
  },

  // ── Streaming ───────────────────────────────────────────────────────────────
  {
    id: 30, name: 'Netflix Premium', short: 'NFLX', cat: 'Streaming',
    desc: 'Unlimited movies & TV shows in 4K Ultra HD. Up to 4 screens simultaneously.',
    colors: ['#141414', '#e50914'],
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80',
    badge: 'Hot', badgeColor: '#ef4444',
    pkgs: [{ a: '1 Month', p: 15.49 }, { a: '3 Months', p: 43.99 }, { a: '6 Months', p: 83.99 }],
  },
  {
    id: 31, name: 'Spotify Premium', short: 'SPTFY', cat: 'Streaming',
    desc: 'Ad-free music streaming with unlimited skips. Download and listen offline.',
    colors: ['#191414', '#1db954'],
    image: 'https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 9.99 }, { a: '3 Months', p: 26.99 }, { a: '6 Months', p: 49.99 }, { a: '1 Year', p: 89.99 }],
  },
  {
    id: 32, name: 'Disney+ Premium', short: 'DIS+', cat: 'Streaming',
    desc: 'Marvel, Star Wars, Pixar, Disney & Nat Geo — all in one subscription.',
    colors: ['#0b1426', '#113ccf'],
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 7.99 }, { a: '3 Months', p: 21.99 }, { a: '1 Year', p: 79.99 }],
  },
  {
    id: 33, name: 'YouTube Premium', short: 'YTPREM', cat: 'Streaming',
    desc: 'Ad-free YouTube, background play, offline downloads & YouTube Music included.',
    colors: ['#ff0000', '#800000'],
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 13.99 }, { a: '3 Months', p: 38.99 }, { a: '1 Year', p: 139.99 }],
  },
  {
    id: 34, name: 'Shahid VIP', short: 'SHAHID', cat: 'Streaming',
    desc: 'Best Arabic content, Ramadan exclusives, movies and live sports in 4K.',
    colors: ['#1a0a3b', '#7b2d8b'],
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 5.99 }, { a: '3 Months', p: 14.99 }, { a: '6 Months', p: 26.99 }, { a: '1 Year', p: 49.99 }],
  },
  {
    id: 35, name: 'Apple TV+', short: 'ATV+', cat: 'Streaming',
    desc: 'Award-winning Apple Originals — series, films, and documentaries.',
    colors: ['#1d1d1f', '#515154'],
    image: 'https://images.unsplash.com/photo-1611532736573-418856b1b9a0?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 9.99 }, { a: '3 Months', p: 26.99 }, { a: '1 Year', p: 99.99 }],
  },
  {
    id: 36, name: 'Anghami Plus', short: 'ANGH', cat: 'Streaming',
    desc: 'Largest Arabic music streaming. 70M+ songs, ad-free, offline listening.',
    colors: ['#1a1a1a', '#ff5c5c'],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 3.99 }, { a: '3 Months', p: 9.99 }, { a: '1 Year', p: 34.99 }],
  },
  {
    id: 37, name: 'Amazon Prime Video', short: 'PRIME', cat: 'Streaming',
    desc: 'Thousands of movies, TV shows and Amazon Originals in Full HD.',
    colors: ['#00a8e0', '#232f3e'],
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 8.99 }, { a: '3 Months', p: 24.99 }, { a: '1 Year', p: 89.99 }],
  },

  // ── Mobile ──────────────────────────────────────────────────────────────────
  {
    id: 40, name: 'STC Recharge (Saudi)', short: 'STC', cat: 'Mobile',
    desc: 'Instant STC prepaid recharge. Calls, SMS and high-speed mobile internet.',
    colors: ['#6a0dad', '#9b59b6'],
    image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=400&q=80',
    pkgs: [{ a: '10 SAR', p: 2.7 }, { a: '25 SAR', p: 6.7 }, { a: '50 SAR', p: 13.4 }, { a: '100 SAR', p: 26.7 }],
  },
  {
    id: 41, name: 'Mobily Recharge (Saudi)', short: 'MBL', cat: 'Mobile',
    desc: 'Instant Mobily prepaid top-up. Best 5G network in Saudi Arabia.',
    colors: ['#00843d', '#005428'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
    pkgs: [{ a: '10 SAR', p: 2.7 }, { a: '25 SAR', p: 6.7 }, { a: '50 SAR', p: 13.4 }, { a: '100 SAR', p: 26.7 }],
  },
  {
    id: 42, name: 'Zain Recharge (Saudi)', short: 'ZAIN', cat: 'Mobile',
    desc: 'Instant Zain KSA prepaid recharge. Fast connectivity across Saudi Arabia.',
    colors: ['#e4002b', '#8b0000'],
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=400&q=80',
    pkgs: [{ a: '10 SAR', p: 2.7 }, { a: '25 SAR', p: 6.7 }, { a: '50 SAR', p: 13.4 }],
  },
  {
    id: 43, name: 'TikTok Coins', short: 'TKTK', cat: 'Mobile',
    desc: 'Send virtual gifts to your favorite TikTok creators during live streams.',
    colors: ['#010101', '#fe2c55'],
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80',
    pkgs: [{ a: '65 Coins', p: 0.99 }, { a: '330 Coins', p: 4.99 }, { a: '660 Coins', p: 9.99 }, { a: '1321 Coins', p: 19.99 }, { a: '3303 Coins', p: 49.99 }],
  },
  {
    id: 44, name: 'Snapchat+ Subscription', short: 'SNAP+', cat: 'Mobile',
    desc: 'Exclusive Snapchat features: custom app icons, story rewatch and more.',
    colors: ['#fffc00', '#ff6600'],
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 3.99 }, { a: '6 Months', p: 21.99 }, { a: '1 Year', p: 39.99 }],
  },

  // ── Subscriptions ───────────────────────────────────────────────────────────
  {
    id: 50, name: 'PlayStation Plus (PS+)', short: 'PS+', cat: 'Subscriptions',
    desc: 'Free monthly games, online multiplayer access and exclusive member discounts.',
    colors: ['#003087', '#0070d1'],
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80',
    badge: 'Popular', badgeColor: '#f97316',
    pkgs: [{ a: 'Essential 1M', p: 9.99 }, { a: 'Extra 1M', p: 14.99 }, { a: 'Premium 1M', p: 17.99 }, { a: 'Essential 1Y', p: 59.99 }, { a: 'Extra 1Y', p: 99.99 }],
  },
  {
    id: 51, name: 'Microsoft 365 Personal', short: 'M365', cat: 'Subscriptions',
    desc: 'Word, Excel, PowerPoint, Outlook + 1TB OneDrive. Always up to date.',
    colors: ['#d83b01', '#ea6f24'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 6.99 }, { a: '1 Year', p: 69.99 }],
  },
  {
    id: 52, name: 'iCloud+ Storage', short: 'iCLD', cat: 'Subscriptions',
    desc: 'Secure cloud storage for your photos, videos and documents across all Apple devices.',
    colors: ['#1d1d1f', '#0a84ff'],
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80',
    pkgs: [{ a: '50GB / Mo', p: 0.99 }, { a: '200GB / Mo', p: 2.99 }, { a: '2TB / Mo', p: 9.99 }],
  },
  {
    id: 53, name: 'Google One', short: 'G1', cat: 'Subscriptions',
    desc: 'Extra Google storage shared across Gmail, Drive & Photos. Share with family.',
    colors: ['#4285f4', '#34a853'],
    image: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&q=80',
    pkgs: [{ a: '100GB / Mo', p: 1.99 }, { a: '200GB / Mo', p: 2.99 }, { a: '2TB / Mo', p: 9.99 }],
  },
  {
    id: 54, name: 'Xbox Live Gold', short: 'XBXG', cat: 'Subscriptions',
    desc: 'Play online multiplayer on Xbox. Free games every month with Games with Gold.',
    colors: ['#107c10', '#005a00'],
    image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 9.99 }, { a: '3 Months', p: 24.99 }, { a: '6 Months', p: 39.99 }, { a: '1 Year', p: 59.99 }],
  },

  // ── VPN ─────────────────────────────────────────────────────────────────────
  {
    id: 60, name: 'NordVPN', short: 'NORD', cat: 'VPN',
    desc: 'Ultra-fast VPN with 5500+ servers in 60 countries. Military-grade encryption.',
    colors: ['#4687ff', '#1d3670'],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80',
    badge: 'Best VPN', badgeColor: '#7c3aed',
    pkgs: [{ a: '1 Month', p: 11.95 }, { a: '6 Months', p: 53.94 }, { a: '1 Year', p: 59.88 }],
  },
  {
    id: 61, name: 'ExpressVPN', short: 'EXVPN', cat: 'VPN',
    desc: 'Blazing-fast VPN with servers in 160 locations. Best for streaming.',
    colors: ['#da3940', '#6e0004'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 12.95 }, { a: '6 Months', p: 59.95 }, { a: '1 Year', p: 99.95 }],
  },
  {
    id: 62, name: 'Surfshark VPN', short: 'SURF', cat: 'VPN',
    desc: 'Unlimited device connections. CleanWeb blocks ads and malware automatically.',
    colors: ['#1c9cde', '#0a4d70'],
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 12.95 }, { a: '6 Months', p: 38.94 }, { a: '1 Year', p: 47.88 }],
  },
  {
    id: 63, name: 'Private Internet Access', short: 'PIA', cat: 'VPN',
    desc: '35,000+ servers worldwide. Open-source VPN with strict no-logs policy.',
    colors: ['#4db6ac', '#00695c'],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 9.95 }, { a: '6 Months', p: 39.95 }, { a: '1 Year', p: 39.95 }],
  },

  // ── Education ───────────────────────────────────────────────────────────────
  {
    id: 70, name: 'Udemy Personal Plan', short: 'UDEMY', cat: 'Education',
    desc: 'Access 12,000+ top courses in tech, business, design, marketing and more.',
    colors: ['#a435f0', '#6d28d9'],
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 19.99 }, { a: '1 Year', p: 119.99 }],
  },
  {
    id: 71, name: 'Duolingo Plus', short: 'DUO', cat: 'Education',
    desc: 'Learn any language ad-free. Unlimited hearts, streak repair and offline mode.',
    colors: ['#58cc02', '#46a302'],
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 6.99 }, { a: '1 Year', p: 59.99 }],
  },
  {
    id: 72, name: 'Coursera Plus', short: 'CRS+', cat: 'Education',
    desc: 'Unlimited access to 7,000+ courses from top universities and companies.',
    colors: ['#0056d2', '#003080'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=80',
    badge: 'New', badgeColor: '#10b981',
    pkgs: [{ a: '1 Month', p: 59.99 }, { a: '1 Year', p: 399.99 }],
  },

  // ── Software ────────────────────────────────────────────────────────────────
  {
    id: 80, name: 'Adobe Creative Cloud', short: 'ADOBE', cat: 'Software',
    desc: 'Photoshop, Illustrator, Premiere Pro and 20+ creative apps. All in one plan.',
    colors: ['#ff0000', '#8b0000'],
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80',
    badge: 'Pro', badgeColor: '#7c3aed',
    pkgs: [{ a: '1 Month', p: 54.99 }, { a: '1 Year', p: 599.88 }],
  },
  {
    id: 81, name: 'Canva Pro', short: 'CANVA', cat: 'Software',
    desc: 'Professional design tools with 100M+ templates, images and graphics.',
    colors: ['#7d2ae8', '#00c4cc'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80',
    pkgs: [{ a: '1 Month', p: 12.99 }, { a: '1 Year', p: 109.99 }],
  },
  {
    id: 82, name: 'Malwarebytes Premium', short: 'MLWB', cat: 'Software',
    desc: 'Real-time protection against malware, ransomware and cyber threats.',
    colors: ['#0085ff', '#0052cc'],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80',
    pkgs: [{ a: '1 Device 1Y', p: 39.99 }, { a: '3 Devices 1Y', p: 59.99 }, { a: '5 Devices 1Y', p: 79.99 }],
  },
];