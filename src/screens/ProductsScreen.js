import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  ScrollView, TouchableOpacity, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS, CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_W = (width - 28 - 16) / 3;

const CATEGORY_ICONS = {
  'All':           'apps',
  'Gift Cards':    'gift',
  'Gaming':        'game-controller',
  'Streaming':     'play-circle',
  'Mobile':        'phone-portrait',
  'Subscriptions': 'star',
  'VPN':           'shield-checkmark',
  'Education':     'school',
  'Software':      'code-slash',
};

const CATS_AR = {
  'All': 'الكل', 'Gift Cards': 'هدايا', 'Gaming': 'ألعاب',
  'Streaming': 'بث', 'Mobile': 'جوال', 'Subscriptions': 'اشتراكات',
  'VPN': 'VPN', 'Education': 'تعليم', 'Software': 'برمجيات',
};

const SORT_OPTIONS = [
  { key: 'default', label: { en: 'Default', ar: 'افتراضي' } },
  { key: 'price_asc', label: { en: 'Price ↑', ar: 'السعر ↑' } },
  { key: 'price_desc', label: { en: 'Price ↓', ar: 'السعر ↓' } },
  { key: 'name', label: { en: 'Name', ar: 'الاسم' } },
];

export default function ProductsScreen({ navigation, route }) {
  const { t, isRTL, language, colors: C } = useApp();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortKey, setSortKey] = useState('default');
  const [showSort, setShowSort] = useState(false);
  const scrollRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const cat = route?.params?.filterCategory;
    setActiveCategory(cat || 'All');
  }, [route?.params?.filterCategory]);

  const getCatLabel = (cat) => language === 'ar' ? (CATS_AR[cat] || cat) : cat;

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'All' || p.cat === activeCategory;
      const matchQ = p.name.toLowerCase().includes(query.toLowerCase()) ||
                     p.desc?.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });

    if (sortKey === 'price_asc') list = [...list].sort((a, b) => a.pkgs[0].p - b.pkgs[0].p);
    else if (sortKey === 'price_desc') list = [...list].sort((a, b) => b.pkgs[0].p - a.pkgs[0].p);
    else if (sortKey === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [query, activeCategory, sortKey]);

  const rows = useMemo(() => {
    const r = [];
    for (let i = 0; i < filtered.length; i += 3) r.push(i);
    return r;
  }, [filtered]);

  const renderRow = ({ item: startIdx }) => {
    const row = [];
    for (let i = 0; i < 3; i++) {
      const p = filtered[startIdx + i];
      row.push(
        p ? (
          <ProductCard key={p.id} product={p} onPress={() => navigation.navigate('ProductDetail', { product: p })} />
        ) : (
          <View key={`empty-${i}`} style={{ width: CARD_W }} />
        )
      );
    }
    return <View style={styles.row}>{row}</View>;
  };

  const onSearchFocus = () => Animated.spring(searchAnim, { toValue: 1.01, useNativeDriver: true }).start();
  const onSearchBlur = () => Animated.spring(searchAnim, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={[styles.container, { backgroundColor: C.bg }]}>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Animated.View style={[styles.searchBox, { backgroundColor: C.bg2, borderColor: C.border }, { transform: [{ scale: searchAnim }] }]}>
          <Ionicons name="search" size={18} color={C.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: C.text }]}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={C.textMuted}
            value={query}
            onChangeText={setQuery}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            textAlign={isRTL ? 'right' : 'left'}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={[styles.clearBtnWrap, { backgroundColor: C.bg3 }]}>
              <Ionicons name="close" size={12} color={C.textMuted} />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Sort Button */}
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: C.bg2, borderColor: sortKey !== 'default' ? C.primary : C.border }]}
          onPress={() => setShowSort(!showSort)}
        >
          <Ionicons name="filter" size={16} color={sortKey !== 'default' ? C.primary : C.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: C.bg2, borderColor: C.border }]}>
          {SORT_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.sortOption, { borderBottomColor: C.border }, sortKey === opt.key && { backgroundColor: `${C.primary}22` }]}
              onPress={() => { setSortKey(opt.key); setShowSort(false); }}
            >
              {sortKey === opt.key && <Ionicons name="checkmark" size={14} color={C.primary} />}
              <Text style={[styles.sortOptionText, { color: sortKey === opt.key ? C.primary : C.textSub }]}>
                {opt.label[language]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Categories */}
      <View style={styles.catsWrap}>
        <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsContent}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const count = cat === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === cat).length;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catBtn, { backgroundColor: C.bg2, borderColor: isActive ? C.primary : C.border }, isActive && styles.catBtnActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                {isActive && <LinearGradient colors={[C.primary, C.primary2]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />}
                <Ionicons
                  name={CATEGORY_ICONS[cat] || 'apps-outline'}
                  size={14}
                  color={isActive ? '#fff' : C.textMuted}
                />
                <Text style={[styles.catText, { color: isActive ? '#fff' : C.textMuted }]}>
                  {getCatLabel(cat)}
                </Text>
                <View style={[styles.catBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : C.bg3 }]}>
                  <Text style={[styles.catBadgeText, { color: isActive ? '#fff' : C.textMuted }]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results Row */}
      <View style={[styles.resultsRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.resultsLeft, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="cube-outline" size={13} color={C.accent} />
          <Text style={[styles.resultsText, { color: C.textMuted }]}>
            <Text style={{ color: C.accent, fontWeight: '800' }}>{filtered.length}</Text>
            {' '}{language === 'ar' ? 'منتج' : `product${filtered.length !== 1 ? 's' : ''}`}
            {activeCategory !== 'All' ? ` · ${getCatLabel(activeCategory)}` : ''}
          </Text>
        </View>
        {activeCategory !== 'All' && (
          <TouchableOpacity
            style={[styles.clearFilterBtn, { borderColor: `${C.accent}44`, backgroundColor: `${C.accent}11` }]}
            onPress={() => setActiveCategory('All')}
          >
            <Ionicons name="close-circle" size={13} color={C.accent} />
            <Text style={[styles.clearFilterText, { color: C.accent }]}>{t('clearFilter')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={60} color={C.textMuted} />
          <Text style={[styles.emptyTitle, { color: C.text }]}>{t('noProducts')}</Text>
          <Text style={[styles.emptySub, { color: C.textMuted }]}>{t('noProductsSub')}</Text>
          <TouchableOpacity
            style={[styles.emptyBtn, { backgroundColor: `${C.primary}22`, borderColor: `${C.primary}44` }]}
            onPress={() => { setQuery(''); setActiveCategory('All'); }}
          >
            <Text style={[styles.emptyBtnText, { color: C.primary2 }]}>
              {isRTL ? 'عرض الكل' : 'Show All'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={i => String(i)}
          renderItem={renderRow}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchWrap: { padding: 12, paddingBottom: 8, flexDirection: 'row', gap: 8, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, gap: 9 },
  searchInput: { flex: 1, fontSize: 14 },
  clearBtnWrap: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sortBtn: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  sortDropdown: { marginHorizontal: 12, borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 4, elevation: 4, shadowOpacity: 0.1, shadowRadius: 8 },
  sortOption: { flexDirection: 'row', alignItems: 'center', padding: 13, gap: 8, borderBottomWidth: 1 },
  sortOptionText: { fontSize: 13, fontWeight: '600' },
  catsWrap: { paddingBottom: 4 },
  catsContent: { paddingHorizontal: 12, gap: 8, paddingVertical: 4 },
  catBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  catBtnActive: { borderColor: 'transparent' },
  catText: { fontSize: 12, fontWeight: '700' },
  catBadge: { borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, minWidth: 22, alignItems: 'center' },
  catBadgeText: { fontSize: 9, fontWeight: '800' },
  resultsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 4, paddingBottom: 8 },
  resultsLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  resultsText: { fontSize: 12 },
  clearFilterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  clearFilterText: { fontSize: 11, fontWeight: '700' },
  grid: { paddingHorizontal: 14, paddingTop: 2, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '800' },
  emptySub: { fontSize: 13 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  emptyBtnText: { fontSize: 13, fontWeight: '700' },
});