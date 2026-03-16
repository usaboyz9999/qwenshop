import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_W = (width - 28 - 16) / 3;

export default function ProductCard({ product, onPress }) {
  const { colors: C, t } = useApp();
  const [imgError, setImgError] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, tension: 200, friction: 10 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 10 }).start();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      style={{ width: CARD_W }}
    >
      <Animated.View style={[styles.card, { backgroundColor: C.bg2, borderColor: C.border }, { transform: [{ scale }] }]}>
        {/* Image / Gradient Header */}
        <View style={styles.imgWrap}>
          <LinearGradient colors={product.colors} style={StyleSheet.absoluteFill} />
          {product.image && !imgError && (
            <Image
              source={{ uri: product.image }}
              style={styles.img}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          )}
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)']} style={styles.imgGrad} />

          {/* Badge */}
          {product.badge && (
            <View style={[styles.badge, { backgroundColor: product.badgeColor || '#7c3aed' }]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}

          {/* Short Name */}
          <Text style={styles.short} numberOfLines={1}>{product.short}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.name, { color: C.textSub }]} numberOfLines={2}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: C.textMuted }]}>{t('from')}</Text>
            <Text style={[styles.price, { color: C.accent }]}>${product.pkgs[0].p}</Text>
          </View>
          <View style={[styles.buyBtn, { backgroundColor: `${C.primary}25`, borderColor: `${C.primary}55` }]}>
            <Ionicons name="cart-outline" size={10} color={C.primary2} />
            <Text style={[styles.buyBtnText, { color: C.primary2 }]}>{t('buyNow')}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  imgWrap: { width: '100%', height: CARD_W * 0.82, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  img: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  imgGrad: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  badge: { position: 'absolute', top: 5, right: 5, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 2, zIndex: 3 },
  badgeText: { fontSize: 7.5, fontWeight: '900', color: '#fff' },
  short: { fontSize: 10, fontWeight: '900', color: '#fff', zIndex: 2, textShadowColor: 'rgba(0,0,0,0.7)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4, paddingHorizontal: 6, textAlign: 'center' },
  info: { padding: 8 },
  name: { fontSize: 10, fontWeight: '700', lineHeight: 13, marginBottom: 5, minHeight: 26 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 6 },
  priceLabel: { fontSize: 8 },
  price: { fontSize: 12, fontWeight: '900' },
  buyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 7, paddingVertical: 5, borderWidth: 1 },
  buyBtnText: { fontSize: 9, fontWeight: '800' },
});