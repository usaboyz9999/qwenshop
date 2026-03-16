import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS } from '../data';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_W = width * 0.4;

const HOME_CATEGORIES = [
  { id: 1, name: { en: 'Gift Cards', ar: 'بطاقات هدايا' }, icon: 'gift', colors: ['#ff6b6b', '#ffd93d'], image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', filter: 'Gift Cards' },
  { id: 2, name: { en: 'Gaming', ar: 'ألعاب' }, icon: 'game-controller', colors: ['#1b2838', '#4a90d9'], image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', filter: 'Gaming' },
  { id: 3, name: { en: 'Streaming', ar: 'بث مباشر' }, icon: 'play-circle', colors: ['#141414', '#e50914'], image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80', filter: 'Streaming' },
  { id: 4, name: { en: 'Mobile', ar: 'جوال' }, icon: 'phone-portrait', colors: ['#c8a84b', '#4a3728'], image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=400&q=80', filter: 'Mobile' },
  { id: 5, name: { en: 'Subscriptions', ar: 'اشتراكات' }, icon: 'star', colors: ['#003087', '#0070d1'], image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80', filter: 'Subscriptions' },
  { id: 6, name: { en: 'VPN', ar: 'VPN وأمان' }, icon: 'shield-checkmark', colors: ['#1a1a2e', '#4687ff'], image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80', filter: 'VPN' },
  { id: 7, name: { en: 'Education', ar: 'تعليم' }, icon: 'school', colors: ['#a435f0', '#6d28d9'], image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80', filter: 'Education' },
  { id: 8, name: { en: 'Software', ar: 'برمجيات' }, icon: 'code-slash', colors: ['#cc0000', '#330000'], image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80', filter: 'Software' },
];

const PROMO_BANNERS = [
  { id: 1, title: { en: 'Top Gaming Deals', ar: 'أفضل عروض الألعاب' }, sub: { en: 'Up to 90% off', ar: 'خصم حتى 90%' }, colors: ['#1b2838', '#4a90d9'], icon: 'game-controller', filter: 'Gaming' },
  { id: 2, title: { en: 'Stream Everything', ar: 'بث بلا حدود' }, sub: { en: 'Best streaming deals', ar: 'أفضل عروض البث' }, colors: ['#141414', '#e50914'], icon: 'tv', filter: 'Streaming' },
  { id: 3, title: { en: 'Gift Cards for All', ar: 'بطاقات هدايا للجميع' }, sub: { en: 'Perfect for everyone', ar: 'مناسبة للجميع' }, colors: ['#b91c1c', '#f97316'], icon: 'gift', filter: 'Gift Cards' },
];

// ─── Marquee ──────────────────────────────────────────────────────────────────
function MarqueeBanner() {
  const { isRTL, language } = useApp();
  const translateX = useRef(new Animated.Value(0)).current;
  const TEXT = '⚡ Mez-Cards   ✦   Gift Cards   ✦   Gaming   ✦   Streaming   ✦   VPN   ✦   Education   ✦   Software   ✦   Mobile   ✦   ';
  const TW = TEXT.length * 8.5;

  useEffect(() => {
    let a;
    const run = () => {
      translateX.setValue(isRTL ? -TW : 0);
      a = Animated.timing(translateX, {
        toValue: isRTL ? 0 : -TW,
        duration: TW * 20,
        useNativeDriver: true,
      });
      a.start(({ finished }) => { if (finished) run(); });
    };
    run();
    return () => a?.stop();
  }, [isRTL, language]);

  return (
    <View style={s.marqueeBanner}>
      <LinearGradient colors={['#2d0b5e', '#1a0533', '#2d0b5e']} style={StyleSheet.absoluteFill} />
      <View style={s.marqueeWrap}>
        <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={s.marqueeText}>{TEXT}</Text>
          ))}
        </Animated.View>
      </View>
      <LinearGradient colors={['#2d0b5e', 'transparent']} style={s.mFadeL} />
      <LinearGradient colors={['transparent', '#2d0b5e']} style={s.mFadeR} />
    </View>
  );
}

// ─── Promo Banners ────────────────────────────────────────────────────────────
function PromoBanners({ navigation }) {
  const { language, isRTL } = useApp();
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % PROMO_BANNERS.length;
        ref.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <View style={{ marginTop: 14, marginHorizontal: 14 }}>
      <FlatList
        ref={ref}
        data={PROMO_BANNERS}
        keyExtractor={i => String(i.id)}
        horizontal pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          setActive(Math.round(e.nativeEvent.contentOffset.x / (width - 28)));
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: width - 28 }}
            onPress={() => navigation.navigate('Products', { filterCategory: item.filter })}
            activeOpacity={0.92}
          >
            <LinearGradient colors={item.colors} style={s.promoBannerGrad}>
              <View style={[s.promoBannerRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={{ flex: 1 }}>
                  <View style={[s.promoBadge, isRTL && { alignSelf: 'flex-end' }]}>
                    <Text style={s.promoBadgeTxt}>{isRTL ? '🔥 حصري' : '🔥 Exclusive'}</Text>
                  </View>
                  <Text style={[s.promoTitle, isRTL && { textAlign: 'right' }]}>{item.title[language]}</Text>
                  <Text style={[s.promoSub, isRTL && { textAlign: 'right' }]}>{item.sub[language]}</Text>
                  <View style={[s.promoBtn, isRTL && { alignSelf: 'flex-end' }]}>
                    <Text style={s.promoBtnTxt}>{isRTL ? 'تسوق ←' : 'Shop →'}</Text>
                  </View>
                </View>
                <Ionicons name={item.icon} size={70} color="rgba(255,255,255,0.2)" />
              </View>
              <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)', top: -40, right: -30 }} />
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
      <View style={s.dots}>
        {PROMO_BANNERS.map((_, i) => (
          <View key={i} style={[s.dot, i === active && s.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const { colors: C, language } = useApp();
  const items = [
    { icon: 'cube-outline',       val: `${PRODUCTS.length}+`, lbl: { en: 'Products',   ar: 'منتج' } },
    { icon: 'grid-outline',       val: '9',                    lbl: { en: 'Categories', ar: 'تصنيف' } },
    { icon: 'flash-outline',      val: '24/7',                 lbl: { en: 'Delivery',   ar: 'توصيل' } },
    { icon: 'shield-checkmark-outline', val: '100%',           lbl: { en: 'Secure',     ar: 'آمن' } },
  ];
  return (
    <View style={[s.statsBar, { backgroundColor: C.bg2, borderColor: C.border }]}>
      {items.map((item, i) => (
        <View key={i} style={[s.statItem, i < items.length - 1 && { borderRightWidth: 1, borderRightColor: C.border }]}>
          <Ionicons name={item.icon} size={17} color={C.accent} />
          <Text style={[s.statVal, { color: C.text }]}>{item.val}</Text>
          <Text style={[s.statLbl, { color: C.textMuted }]}>{item.lbl[language]}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Category Grid Card ───────────────────────────────────────────────────────
function CategoryGridCard({ category, onPress }) {
  const { language, colors: C } = useApp();
  const [err, setErr] = useState(false);
  const name = typeof category.name === 'object' ? category.name[language] : category.name;
  const count = PRODUCTS.filter(p =>
    category.filter === 'All' ? true : p.cat === category.filter
  ).length;

  return (
    <TouchableOpacity style={[s.catCard, { borderColor: C.border }]} onPress={onPress} activeOpacity={0.88}>
      <View style={s.catImgWrap}>
        <LinearGradient colors={category.colors} style={StyleSheet.absoluteFill} />
        {!err && (
          <Image source={{ uri: category.image }} style={s.catImg} resizeMode="cover" onError={() => setErr(true)} />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.72)']} style={StyleSheet.absoluteFill} />
        <View style={[s.catIconBadge]}>
          <Ionicons name={category.icon} size={13} color="#fff" />
        </View>
        <View style={s.catBottom}>
          <Text style={s.catName} numberOfLines={1}>{name}</Text>
          <View style={s.catCountPill}><Text style={s.catCount}>{count}</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Product Card (Horizontal) ────────────────────────────────────────────────
function HorizCard({ product, onPress }) {
  const { colors: C, t, isRTL } = useApp();
  const [err, setErr] = useState(false);

  if (!product) return null;

  const safeColors = Array.isArray(product.colors) && product.colors.length >= 2
    ? product.colors
    : ['#4c1d95', '#7c3aed'];

  return (
    <TouchableOpacity
      style={[s.hCard, { backgroundColor: C.bg2, borderColor: C.border }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Image area */}
      <View style={s.hImgWrap}>
        <LinearGradient colors={safeColors} style={StyleSheet.absoluteFill} />
        {product.image && !err && (
          <Image
            source={{ uri: product.image }}
            style={s.hImg}
            resizeMode="cover"
            onError={() => setErr(true)}
          />
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFill}
        />
        {product.badge && (
          <View style={[s.hBadge, { backgroundColor: product.badgeColor || '#7c3aed' }]}>
            <Text style={s.hBadgeTxt}>{product.badge}</Text>
          </View>
        )}
        <Text style={s.hShort} numberOfLines={1}>{product.short || '—'}</Text>
      </View>

      {/* Info area */}
      <View style={s.hInfo}>
        <Text style={[s.hName, { color: C.textSub }]} numberOfLines={2}>{product.name}</Text>
        <View style={[s.hPriceRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[s.hFrom, { color: C.textMuted }]}>{t('from')} </Text>
          <Text style={[s.hPrice, { color: C.accent }]}>${product.pkgs[0]?.p ?? 0}</Text>
        </View>
        <LinearGradient colors={[C.primary, C.primary2]} style={s.hBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={s.hBtnTxt}>{t('buyNow')}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

// ─── Category Section (horizontal scroll) ────────────────────────────────────
function CategorySection({ category, navigation }) {
  const { t, isRTL, language, colors: C } = useApp();

  const products = category.filter === 'All'
    ? PRODUCTS.slice(0, 10)
    : PRODUCTS.filter(p => p.cat === category.filter);

  if (products.length === 0) return null;

  const name = typeof category.name === 'object' ? category.name[language] : category.name;

  return (
    <View style={{ marginBottom: 6 }}>
      {/* Header */}
      <View style={[s.secRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[s.secLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name={category.icon || 'grid'} size={16} color={C.primary2} />
          <Text style={[s.secTitle, { color: C.text }]}>{name}</Text>
          <View style={[s.secBadge, { backgroundColor: C.primary + '33' }]}>
            <Text style={[s.secBadgeTxt, { color: C.accent }]}>{products.length}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[s.seeAllBtn, { borderColor: C.accent + '44' }]}
          onPress={() => navigation.navigate('Products', {
            filterCategory: category.filter === 'All' ? undefined : category.filter,
          })}
        >
          <Text style={[s.seeAllTxt, { color: C.accent }]}>{t('seeAll')}</Text>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={12} color={C.accent}
          />
        </TouchableOpacity>
      </View>

      {/* Horizontal scroll */}
      <FlatList
        data={products}
        keyExtractor={p => `${category.id}-${p.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 12, paddingBottom: 8 }}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <HorizCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
      />
    </View>
  );
}

// ─── Featured (Best Sellers) ──────────────────────────────────────────────────
function FeaturedSection({ navigation }) {
  const { t, isRTL, colors: C } = useApp();
  const featured = PRODUCTS.filter(p => p.badge).slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <View style={{ marginBottom: 6 }}>
      <View style={[s.secRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[s.secLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="flame" size={18} color="#f97316" />
          <Text style={[s.secTitle, { color: C.text }]}>
            {isRTL ? 'الأكثر مبيعاً' : 'Best Sellers'}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.seeAllBtn, { borderColor: C.accent + '44' }]}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={[s.seeAllTxt, { color: C.accent }]}>{t('seeAll')}</Text>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={C.accent} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={featured}
        keyExtractor={p => `feat-${p.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 12, paddingBottom: 8 }}
        snapToInterval={CARD_W + 12}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <HorizCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
      />
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const { t, isRTL, colors: C } = useApp();

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
      <MarqueeBanner />
      <PromoBanners navigation={navigation} />
      <StatsBar />
      <FeaturedSection navigation={navigation} />

      {/* Categories Grid Title */}
      <View style={[s.secRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[s.secLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="apps" size={17} color={C.primary2} />
          <Text style={[s.secTitle, { color: C.text }]}>{t('categories')}</Text>
        </View>
        <TouchableOpacity
          style={[s.seeAllBtn, { borderColor: C.accent + '44' }]}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={[s.seeAllTxt, { color: C.accent }]}>{t('seeAll')}</Text>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={12} color={C.accent} />
        </TouchableOpacity>
      </View>

      {/* Categories Grid */}
      <View style={s.catGrid}>
        {HOME_CATEGORIES.map(cat => (
          <CategoryGridCard
            key={cat.id}
            category={cat}
            onPress={() => navigation.navigate('Products', {
              filterCategory: cat.filter === 'All' ? undefined : cat.filter,
            })}
          />
        ))}
      </View>

      {/* Product sections per category */}
      {HOME_CATEGORIES.filter(c => c.filter !== 'All').map(cat => (
        <CategorySection key={cat.id} category={cat} navigation={navigation} />
      ))}

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },

  // Marquee
  marqueeBanner: { height: 36, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.4)' },
  marqueeWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  marqueeText: { fontSize: 11.5, fontWeight: '700', color: '#fbbf24', letterSpacing: 0.4, paddingVertical: 9, paddingHorizontal: 5 },
  mFadeL: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 28, zIndex: 2 },
  mFadeR: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 28, zIndex: 2 },

  // Promo
  promoBannerGrad: { padding: 22, borderRadius: 20, overflow: 'hidden', minHeight: 145 },
  promoBannerRow: { flexDirection: 'row', alignItems: 'center' },
  promoBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 8 },
  promoBadgeTxt: { fontSize: 10, fontWeight: '700', color: '#fff' },
  promoTitle: { fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 4, letterSpacing: -0.3 },
  promoSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 12, fontWeight: '600' },
  promoBtn: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  promoBtnTxt: { fontSize: 12, fontWeight: '800', color: '#fff' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(124,58,237,0.3)' },
  dotActive: { backgroundColor: '#fbbf24', width: 18, borderRadius: 3 },

  // Stats
  statsBar: { flexDirection: 'row', marginHorizontal: 14, marginTop: 14, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12, gap: 3 },
  statVal: { fontSize: 13, fontWeight: '900', letterSpacing: -0.3 },
  statLbl: { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },

  // Section header
  secRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 20, paddingBottom: 10 },
  secLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  secTitle: { fontSize: 16, fontWeight: '900', letterSpacing: -0.3 },
  secBadge: { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 4 },
  secBadgeTxt: { fontSize: 10, fontWeight: '800' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20, borderWidth: 1, backgroundColor: 'rgba(251,191,36,0.08)' },
  seeAllTxt: { fontSize: 11, fontWeight: '700' },

  // Category Grid
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  catCard: { width: '47%', borderRadius: 18, overflow: 'hidden', borderWidth: 1 },
  catImgWrap: { width: '100%', height: 110, position: 'relative', overflow: 'hidden' },
  catImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  catIconBadge: { position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  catBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 9, zIndex: 2 },
  catName: { fontSize: 12, fontWeight: '800', color: '#fff', flex: 1, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  catCountPill: { backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  catCount: { fontSize: 9, fontWeight: '800', color: '#fff' },

  // Horizontal Product Card — explicit dimensions
  hCard: {
    width: CARD_W,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  hImgWrap: {
    width: CARD_W,
    height: CARD_W * 0.72,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hImg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%', height: '100%',
  },
  hBadge: { position: 'absolute', top: 6, right: 6, borderRadius: 7, paddingHorizontal: 6, paddingVertical: 2, zIndex: 3 },
  hBadgeTxt: { fontSize: 8, fontWeight: '900', color: '#fff' },
  hShort: { fontSize: 12, fontWeight: '900', color: '#fff', zIndex: 2, textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 5 },
  hInfo: { padding: 10, width: CARD_W },
  hName: { fontSize: 11, fontWeight: '700', marginBottom: 5, lineHeight: 15, minHeight: 30 },
  hPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8, gap: 2 },
  hFrom: { fontSize: 9 },
  hPrice: { fontSize: 14, fontWeight: '900' },
  hBtn: { borderRadius: 9, paddingVertical: 7, alignItems: 'center' },
  hBtnTxt: { fontSize: 10, fontWeight: '800', color: '#fff' },
});