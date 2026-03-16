import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

function StarRating({ rating, size = 16, interactive = false, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <TouchableOpacity key={s} onPress={() => interactive && onSelect && onSelect(s)} disabled={!interactive} activeOpacity={0.7}>
          <Ionicons
            name={s <= rating ? 'star' : s <= rating + 0.5 ? 'star-half' : 'star-outline'}
            size={size}
            color={s <= rating ? '#fbbf24' : '#4a3f6a'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, t, isRTL, currentUser, colors: C, toggleWishlist, isInWishlist, getProductReviews, getProductRating, addReview, markHelpful } = useApp();

  const [selectedPkg, setSelectedPkg] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const reviews = getProductReviews(product.id);
  const { average, count } = getProductRating(product.id);

  const handleAdd = () => {
    if (!currentUser) {
      Alert.alert(t('signInRequired'), t('signInToPurchase'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signIn'), onPress: () => navigation.navigate('Account') },
      ]);
      return;
    }
    addToCart(product, selectedPkg);
    Alert.alert(t('addedToCart'), `${product.name} — ${product.pkgs[selectedPkg].a}`, [
      { text: t('continueShopping'), style: 'cancel' },
      { text: t('viewCart'), onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleWishlist = () => {
    if (!currentUser) {
      Alert.alert(t('signInRequired'), t('signInToPurchase'));
      return;
    }
    const added = toggleWishlist(product.id);
    Alert.alert(added ? t('addedToWishlist') : t('removedFromWishlist'), '', [{ text: 'OK' }]);
  };

  const handleSubmitReview = () => {
    if (!currentUser) { Alert.alert(t('signInRequired'), t('signInToReview')); return; }
    if (!reviewText.trim()) return;
    setSubmitting(true);
    const result = addReview(product.id, reviewRating, reviewText.trim());
    setSubmitting(false);
    if (result.success) {
      Alert.alert(t('reviewAdded'));
      setShowReviewForm(false);
      setReviewText('');
      setReviewRating(5);
    } else {
      Alert.alert('', result.error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View style={styles.heroWrap}>
        <LinearGradient colors={product.colors || ['#4c1d95', '#7c3aed']} style={styles.heroImg}>
          <Text style={styles.heroText}>{product.short}</Text>
        </LinearGradient>

        {/* Wishlist Button */}
        <TouchableOpacity style={[styles.wishlistBtn, { backgroundColor: C.bg2, borderColor: C.border }]} onPress={handleWishlist}>
          <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={22} color={inWishlist ? '#ef4444' : C.textMuted} />
        </TouchableOpacity>

        {/* Badge */}
        {product.badge && (
          <View style={[styles.heroBadge, { backgroundColor: product.badgeColor || C.primary }]}>
            <Text style={styles.heroBadgeText}>{product.badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Name & Rating */}
        <View style={[styles.nameRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.name, { color: C.text, flex: 1 }, isRTL && { textAlign: 'right' }]}>{product.name}</Text>
        </View>

        {count > 0 && (
          <View style={[styles.ratingRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <StarRating rating={average} size={15} />
            <Text style={[styles.ratingText, { color: C.textMuted }]}>
              {average.toFixed(1)} ({count} {isRTL ? 'مراجعة' : 'reviews'})
            </Text>
          </View>
        )}

        <Text style={[styles.desc, { color: C.textMuted }, isRTL && { textAlign: 'right' }]}>{product.desc}</Text>

        {/* Packages */}
        <Text style={[styles.pkgLabel, { color: C.accent }, isRTL && { textAlign: 'right' }]}>{t('selectPackage')}</Text>
        <View style={styles.pkgGrid}>
          {product.pkgs.map((pkg, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.pkgCard, { backgroundColor: C.bg2, borderColor: selectedPkg === i ? C.primary : C.border }, selectedPkg === i && { backgroundColor: `${C.primary}18` }]}
              onPress={() => setSelectedPkg(i)}
            >
              {selectedPkg === i && <Ionicons name="checkmark-circle" size={14} color={C.primary2} style={{ position: 'absolute', top: 6, right: 6 }} />}
              <Text style={[styles.pkgAmount, { color: selectedPkg === i ? C.text : C.textMuted }]}>{pkg.a}</Text>
              <Text style={[styles.pkgPrice, { color: C.accent }]}>${pkg.p.toFixed(2)}</Text>
              <Text style={styles.pkgRegion}>🇸🇦 🇺🇸 🇦🇪</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Add to Cart */}
      <TouchableOpacity onPress={handleAdd} activeOpacity={0.88}>
        <LinearGradient
          colors={currentUser ? [C.primary, C.primary2] : ['#3a2f5a', '#4a3f6a']}
          style={styles.addBtn}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        >
          <Ionicons name={currentUser ? 'cart' : 'lock-closed'} size={18} color="#fff" />
          <Text style={styles.addBtnText}>
            {currentUser ? `${t('addToCart')} — $${product.pkgs[selectedPkg].p.toFixed(2)}` : `🔒 ${t('signIn')}`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ─ Reviews Section ─ */}
      <View style={[styles.reviewsSection, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <View style={[styles.reviewsHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 7 }]}>
            <Ionicons name="star" size={17} color="#fbbf24" />
            <Text style={[styles.reviewsTitle, { color: C.text }]}>{t('reviews')}</Text>
            {count > 0 && (
              <View style={[styles.reviewCountBadge, { backgroundColor: `${C.primary}33` }]}>
                <Text style={[styles.reviewCountText, { color: C.accent }]}>{count}</Text>
              </View>
            )}
          </View>
          {currentUser && (
            <TouchableOpacity
              style={[styles.writeReviewBtn, { borderColor: C.primary, backgroundColor: `${C.primary}18` }]}
              onPress={() => setShowReviewForm(!showReviewForm)}
            >
              <Ionicons name="create-outline" size={14} color={C.primary2} />
              <Text style={[styles.writeReviewBtnText, { color: C.primary2 }]}>{t('writeReview')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Rating Summary */}
        {count > 0 && (
          <View style={[styles.ratingSummary, { backgroundColor: C.bg3, borderColor: C.border }, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.avgRating, { color: C.accent }]}>{average.toFixed(1)}</Text>
              <StarRating rating={average} size={14} />
              <Text style={[styles.ratingMeta, { color: C.textMuted }]}>{count} {isRTL ? 'مراجعة' : 'reviews'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16, gap: 4 }}>
              {[5, 4, 3, 2, 1].map(star => {
                const cnt = reviews.filter(r => r.rating === star).length;
                const pct = count > 0 ? (cnt / count) * 100 : 0;
                return (
                  <View key={star} style={[styles.ratingBarRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.ratingBarLabel, { color: C.textMuted }]}>{star}</Text>
                    <Ionicons name="star" size={10} color="#fbbf24" />
                    <View style={[styles.ratingBarBg, { backgroundColor: C.border }]}>
                      <View style={[styles.ratingBarFill, { width: `${pct}%`, backgroundColor: '#fbbf24' }]} />
                    </View>
                    <Text style={[styles.ratingBarCount, { color: C.textMuted }]}>{cnt}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Write Review Form */}
        {showReviewForm && currentUser && (
          <View style={[styles.reviewForm, { backgroundColor: C.bg3, borderColor: C.border }]}>
            <Text style={[styles.reviewFormTitle, { color: C.text }, isRTL && { textAlign: 'right' }]}>{t('yourReview')}</Text>
            <View style={styles.reviewFormRating}>
              <StarRating rating={reviewRating} size={28} interactive onSelect={setReviewRating} />
            </View>
            <TextInput
              style={[styles.reviewInput, { backgroundColor: C.bg2, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]}
              placeholder={t('reviewPlaceholder')}
              placeholderTextColor={C.textMuted}
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={[styles.reviewFormActions, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity style={[styles.cancelReviewBtn, { borderColor: C.border }]} onPress={() => { setShowReviewForm(false); setReviewText(''); }}>
                <Text style={[styles.cancelReviewText, { color: C.textMuted }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitReview} style={{ flex: 1 }}>
                <LinearGradient colors={[C.primary, C.primary2]} style={styles.submitReviewBtn}>
                  <Text style={styles.submitReviewText}>{t('submitReview')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <View style={styles.noReviews}>
            <Ionicons name="chatbubble-outline" size={36} color={C.textMuted} />
            <Text style={[styles.noReviewsTitle, { color: C.textMuted }]}>{t('noReviews')}</Text>
            <Text style={[styles.noReviewsSub, { color: C.textMuted }]}>{t('beFirstReview')}</Text>
          </View>
        ) : (
          reviews.map(rv => (
            <View key={rv.id} style={[styles.reviewItem, { borderBottomColor: C.border }]}>
              <View style={[styles.reviewItemHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.reviewAvatar, { backgroundColor: C.primary }]}>
                  <Text style={styles.reviewAvatarText}>{rv.userName.substring(0, 1).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
                  <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={[styles.reviewUserName, { color: C.text }]}>{rv.userName}</Text>
                    <Text style={[styles.reviewDate, { color: C.textMuted }]}>{rv.date}</Text>
                  </View>
                  <StarRating rating={rv.rating} size={13} />
                </View>
              </View>
              <Text style={[styles.reviewText, { color: C.textSub }, isRTL && { textAlign: 'right' }]}>{rv.text}</Text>
              <TouchableOpacity
                style={[styles.helpfulBtn, isRTL && { alignSelf: 'flex-start' }]}
                onPress={() => markHelpful(product.id, rv.id)}
              >
                <Ionicons name="thumbs-up-outline" size={13} color={C.textMuted} />
                <Text style={[styles.helpfulText, { color: C.textMuted }]}>{t('helpful')} ({rv.helpful})</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroWrap: { position: 'relative', margin: 14 },
  heroImg: { height: 200, alignItems: 'center', justifyContent: 'center', borderRadius: 20, overflow: 'hidden' },
  heroText: { fontSize: 32, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 },
  wishlistBtn: { position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, elevation: 3 },
  heroBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  heroBadgeText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  content: { paddingHorizontal: 14 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  name: { fontSize: 22, fontWeight: '900', letterSpacing: -0.3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  ratingText: { fontSize: 12, fontWeight: '600' },
  desc: { fontSize: 13, lineHeight: 20, marginBottom: 18 },
  pkgLabel: { fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 },
  pkgGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  pkgCard: { width: '47%', borderRadius: 12, padding: 14, borderWidth: 1, alignItems: 'center', position: 'relative' },
  pkgAmount: { fontSize: 14, fontWeight: '900', marginBottom: 3 },
  pkgPrice: { fontSize: 14, fontWeight: '700' },
  pkgRegion: { fontSize: 12, marginTop: 3 },
  addBtn: { marginHorizontal: 14, borderRadius: 15, padding: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  reviewsSection: { margin: 14, borderRadius: 18, padding: 16, borderWidth: 1 },
  reviewsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  reviewsTitle: { fontSize: 16, fontWeight: '900' },
  reviewCountBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  reviewCountText: { fontSize: 11, fontWeight: '800' },
  writeReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  writeReviewBtnText: { fontSize: 11, fontWeight: '700' },
  ratingSummary: { flexDirection: 'row', borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 14, gap: 8 },
  avgRating: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
  ratingMeta: { fontSize: 10, marginTop: 4 },
  ratingBarRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingBarLabel: { fontSize: 11, width: 10 },
  ratingBarBg: { flex: 1, height: 5, borderRadius: 3, overflow: 'hidden' },
  ratingBarFill: { height: '100%', borderRadius: 3 },
  ratingBarCount: { fontSize: 10, width: 16, textAlign: 'right' },
  reviewForm: { borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 14 },
  reviewFormTitle: { fontSize: 14, fontWeight: '800', marginBottom: 12 },
  reviewFormRating: { marginBottom: 12 },
  reviewInput: { borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 13, minHeight: 90, marginBottom: 12 },
  reviewFormActions: { flexDirection: 'row', gap: 8 },
  cancelReviewBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  cancelReviewText: { fontSize: 13, fontWeight: '600' },
  submitReviewBtn: { borderRadius: 10, padding: 11, alignItems: 'center' },
  submitReviewText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  noReviews: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  noReviewsTitle: { fontSize: 14, fontWeight: '700' },
  noReviewsSub: { fontSize: 12 },
  reviewItem: { borderBottomWidth: 1, paddingVertical: 14 },
  reviewItemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText: { fontSize: 14, fontWeight: '900', color: '#fff' },
  reviewUserName: { fontSize: 13, fontWeight: '700' },
  reviewDate: { fontSize: 11 },
  reviewText: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  helpfulBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
  helpfulText: { fontSize: 11 },
});