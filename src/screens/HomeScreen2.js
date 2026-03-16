import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, FlatList, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PRODUCTS } from '../data';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.38;

const HOME_CATEGORIES = [
  { id: 1, name: { en: 'Gift Cards', ar: 'بطاقات هدايا' }, colors: ['#ff6b6b', '#ffd93d'], image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&q=80', filter: 'Gift Cards', productIds: [1, 2, 3, 4, 5, 6] },
  { id: 2, name: { en: 'Gaming', ar: 'ألعاب' }, colors: ['#1b2838', '#4a90d9'], image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80', filter: 'Gaming', productIds: [10, 11, 12, 13, 14, 15, 16, 17] },
  { id: 3, name: { en: 'Streaming', ar: 'بث مباشر' }, colors: ['#141414', '#e50914'], image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80', filter: 'Streaming', productIds: [20, 21, 22, 23, 24, 25, 26] },
  { id: 4, name: { en: 'Mobile', ar: 'جوال' }, colors: ['#c8a84b', '#4a3728'], image: 'https://images.unsplash.com/photo-1601944179066-29786cb9d32a?w=400&q=80', filter: 'Mobile', productIds: [30, 31, 32, 33] },
  { id: 5, name: { en: 'Subscriptions', ar: 'اشتراكات' }, colors: ['#003087', '#0070d1'], image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&q=80', filter: 'Subscriptions', productIds: [40, 41, 42, 43] },
  { id: 6, name: { en: 'All Products', ar: 'جميع المنتجات' }, colors: ['#4c1d95', '#7c3aed'], image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80', filter: 'All', productIds: [] },
  { id: 7, name: { en: 'PlayStation', ar: 'بلايستيشن' }, colors: ['#003087', '#0070d1'], image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80', filter: 'Subscriptions', productIds: [11, 40] },
  { id: 8, name: { en: 'Music', ar: 'موسيقى' }, colors: ['#191414', '#1db954'], image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', filter: 'Streaming', productIds: [21, 26] },
  { id: 9, name: { en: 'VPN & Security', ar: 'VPN وأمان' }, colors: ['#1a1a2e', '#4687ff'], image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=80', filter: 'VPN', productIds: [50, 51, 52] },
  { id: 10, name: { en: 'Education', ar: 'تعليم' }, colors: ['#a435f0', '#6d28d9'], image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80', filter: 'Education', productIds: [60, 61] },
  { id: 11, name: { en: 'Action Games', ar: 'ألعاب أكشن' }, colors: ['#1a1a1a', '#ff6600'], image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&q=80', filter: 'Gaming', productIds: [13, 14, 15, 17] },
  { id: 12, name: { en: 'Social Media', ar: 'سوشيال ميديا' }, colors: ['#010101', '#fe2c55'], image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&q=80', filter: 'Mobile', productIds: [33] },
];

function MarqueeBanner() {
  const { t, isRTL, language } = useApp();
  const translateX = useRef(new Animated.Value(0)).current;
  const marqueeText = '🎮 Mez-Cards  ✦  ' + t('categories') + '  ✦  Gift Cards  ✦  Gaming  ✦  Streaming  ✦  Mobile  ✦  ';
  const textWidth = marqueeText.length * 9;

  useEffect(() => {
    const animate = () => {
      if (isRTL) {
        // AR: left to right
        translateX.setValue(-textWidth);
        Animated.timing(translateX, { toValue: 0, duration: textWidth * 18, useNativeDriver: true }).start(() => animate());
      } else {
        // EN: right to left
        translateX.setValue(0);
        Animated.timing(translateX, { toValue: -textWidth, duration: textWidth * 18, useNativeDriver: true }).start(() => animate());
      }
    };
    animate();
    return () => translateX.stopAnimation();
  }, [isRTL, language]);

  return (
    <View style={styles.marqueeBanner}>
      <LinearGradient colors={['#1a0533', '#2d0b5e', '#1a0533']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
      <View style={styles.marqueeWrap}>
        <Animated.View style={[styles.marqueeInner, { transform: [{ translateX }] }]}>
          {[...Array(6)].map((_, i) => (
            <Text key={i} style={styles.marqueeText}>{marqueeText}</Text>
          ))}
        </Animated.View>
      </View>
      <LinearGradient colors={['#1a0533', 'transparent']} style={styles.marqueeFadeLeft} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} pointerEvents="none" />
      <LinearGradient colors={['transparent', '#1a0533']} style={styles.marqueeFadeRight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} pointerEvents="none" />
    </View>
  );
}

function CategoryCard({ category, onPress }) {
  const { language, colors: C } = useApp();
  const [imgError, setImgError] = useState(false);
  const hasImage = category.image && !imgError;
  const count = category.productIds?.length > 0
    ? category.productIds.length
    : category.filter === 'All'
      ? PRODUCTS.length
      : PRODUCTS.filter(p => p.cat === category.filter).length;
  const catName = typeof category.name === 'object' ? category.name[language] : category.name;

  return (
    <TouchableOpacity style={[styles.catCard, { borderColor: C.border }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.catImgWrap}>
        <LinearGradient colors={category.colors} style={StyleSheet.absoluteFill} />
        {hasImage && <Image source={{ uri: category.image }} style={styles.catImage} resizeMode="cover" onError={() => setImgError(true)} />}
        <View style={styles.catOverlay} />
        <View style={styles.catBottomRow}>
          <Text style={styles.catNameOverlay} numberOfLines={1}>{catName}</Text>
          <View style={styles.catCountBadge}><Text style={styles.catCountText}>{count}</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function HorizProductCard({ product, onPress }) {
  const { t, isRTL, colors: C } = useApp();
  const [imgError, setImgError] = useState(false);
  const hasImage = product.image && !imgError;

  return (
    <TouchableOpacity style={[styles.horizCard, { backgroundColor: C.bg2, borderColor: C.border }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.horizImgWrap}>
        <LinearGradient colors={product.colors} style={StyleSheet.absoluteFill} />
        {hasImage && <Image source={{ uri: product.image }} style={styles.horizImg} resizeMode="cover" onError={() => setImgError(true)} />}
        <View style={styles.horizImgOverlay} />
        <Text style={styles.horizShort}>{product.short}</Text>
        <View style={styles.horizBadge}><Text style={styles.horizBadgeText}>M</Text></View>
      </View>
      <View style={styles.horizInfo}>
        <Text style={[styles.horizName, { color: C.textSub }]} numberOfLines={1}>{product.name}</Text>
        <View style={[styles.horizPriceRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.horizFrom, { color: C.textMuted }]}>{t('from')} </Text>
          <Text style={[styles.horizPrice, { color: C.accent }]}>${product.pkgs[0].p}</Text>
        </View>
        <View style={[styles.horizBtn, { borderColor: 'rgba(124,58,237,0.35)' }]}>
          <Text style={[styles.horizBtnText, { color: C.accent }]}>{t('buyNow')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CategorySection({ category, navigation }) {
  const { t, isRTL, language, colors: C } = useApp();
  const products = category.filter === 'All'
    ? PRODUCTS.slice(0, 10)
    : category.productIds?.length > 0
      ? PRODUCTS.filter(p => category.productIds.includes(p.id))
      : PRODUCTS.filter(p => p.cat === category.filter);

  if (products.length === 0) return null;
  const catName = typeof category.name === 'object' ? category.name[language] : category.name;

  return (
    <View style={styles.catSection}>
      <View style={[styles.sectionRow, isRTL && styles.rowRev]}>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>{catName}</Text>
          <View style={styles.sectionBadge}><Text style={[styles.sectionBadgeText, { color: C.accent }]}>{products.length}</Text></View>
        </View>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Products', { filterCategory: category.filter })}>
          <Text style={[styles.seeAll, { color: C.accent }]}>{t('seeAll')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={p => String(p.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizList}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <HorizProductCard product={item} onPress={() => navigation.navigate('ProductDetail', { product: item })} />
        )}
      />
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { t, isRTL, colors: C } = useApp();

  const handleCategoryPress = (category) => {
    navigation.navigate('Products', { filterCategory: category.filter === 'All' ? undefined : category.filter });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
      <MarqueeBanner />

      <LinearGradient colors={['#4c1d95', '#7c3aed', '#a855f7', '#c026d3']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={[styles.heroContent, isRTL && styles.rowRev]}>
          <View>
            <Text style={styles.heroTitle}>Mez-Cards</Text>
            <Text style={styles.heroSub}>{isRTL ? '🛍️ تسوق ذكي · أسعار منافسة' : '🛍️ Smart Shopping · Best Prices'}</Text>
          </View>
          <View style={styles.heroIcons}>
            {['🎮', '🎬', '📱'].map(ic => (
              <View key={ic} style={styles.heroIcon}><Text style={{ fontSize: 14 }}>{ic}</Text></View>
            ))}
          </View>
        </View>
        <View style={[styles.bubble, { width: 120, height: 120, top: -40, right: -30 }]} />
        <View style={[styles.bubble, { width: 70, height: 70, bottom: -20, left: 50 }]} />
      </LinearGradient>

      <View style={[styles.sectionRow, isRTL && styles.rowRev]}>
        <View style={styles.sectionTitleWrap}>
          <Text style={[styles.sectionTitle, { color: C.text }]}>{t('categories')}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Products')}>
          <Text style={[styles.seeAll, { color: C.accent }]}>{t('seeAll')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.catGrid}>
        {HOME_CATEGORIES.map(cat => (
          <CategoryCard key={cat.id} category={cat} onPress={() => handleCategoryPress(cat)} />
        ))}
      </View>

      <LinearGradient colors={['#f97316', '#ef4444']} style={styles.createBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.createBtnInner}>
          <Text style={styles.createBtnText}>{t('createOrder')}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {HOME_CATEGORIES.filter(c => c.filter !== 'All').map(cat => (
        <CategorySection key={cat.id} category={cat} navigation={navigation} />
      ))}

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  rowRev: { flexDirection: 'row-reverse' },
  marqueeBanner: { height: 38, overflow: 'hidden', borderBottomWidth: 1, borderBottomColor: 'rgba(124,58,237,0.3)' },
  marqueeWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  marqueeInner: { flexDirection: 'row', alignItems: 'center' },
  marqueeText: { fontSize: 12, fontWeight: '700', color: '#fbbf24', letterSpacing: 0.5, paddingVertical: 8, paddingHorizontal: 6 },
  marqueeFadeLeft: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 30, zIndex: 2 },
  marqueeFadeRight: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 30, zIndex: 2 },
  hero: { margin: 14, marginTop: 12, borderRadius: 20, padding: 22, overflow: 'hidden' },
  heroContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroTitle: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', color: '#fff', letterSpacing: -0.5 },
  heroSub: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontWeight: '600' },
  heroIcons: { flexDirection: 'row', gap: 8 },
  heroIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  bubble: { position: 'absolute', borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.07)' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 18, paddingBottom: 10 },
  sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '800' },
  sectionBadge: { backgroundColor: 'rgba(124,58,237,0.25)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  sectionBadgeText: { fontSize: 10, fontWeight: '800' },
  seeAllBtn: { backgroundColor: 'rgba(251,191,36,0.12)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(251,191,36,0.25)' },
  seeAll: { fontSize: 11, fontWeight: '700' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  catCard: { width: '47%', borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  catImgWrap: { width: '100%', height: 115, position: 'relative', overflow: 'hidden' },
  catImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  catOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.38)', zIndex: 1 },
  catBottomRow: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8, zIndex: 2 },
  catNameOverlay: { fontSize: 12, fontWeight: '800', color: '#fff', flex: 1 },
  catCountBadge: { backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  catCountText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  catSection: { marginBottom: 6 },
  horizList: { paddingHorizontal: 14, paddingBottom: 6, gap: 12 },
  horizCard: { width: CARD_WIDTH, borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  horizImgWrap: { width: '100%', height: CARD_WIDTH * 0.75, alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  horizImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  horizImgOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1 },
  horizShort: { fontSize: 13, fontWeight: '900', color: '#fff', zIndex: 2, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  horizBadge: { position: 'absolute', top: 7, right: 7, backgroundColor: '#7c3aed', borderRadius: 5, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', zIndex: 3 },
  horizBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },
  horizInfo: { padding: 10 },
  horizName: { fontSize: 11, fontWeight: '700', marginBottom: 4 },
  horizPriceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  horizFrom: { fontSize: 9 },
  horizPrice: { fontSize: 13, fontWeight: '900' },
  horizBtn: { backgroundColor: 'rgba(124,58,237,0.18)', borderRadius: 8, paddingVertical: 5, alignItems: 'center', borderWidth: 1 },
  horizBtnText: { fontSize: 10, fontWeight: '800' },
  createBtn: { margin: 14, borderRadius: 14, overflow: 'hidden' },
  createBtnInner: { padding: 16, alignItems: 'center' },
  createBtnText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});