import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function CartScreen({ navigation }) {
  const {
    cart, removeFromCart, checkout, currentUser, t, isRTL, colors: C,
    currency, validateCoupon, pointsData, COUPONS,
  } = useApp();

  const [ordered, setOrdered] = useState(false);
  const [orderedInfo, setOrderedInfo] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [usePoints, setUsePoints] = useState(false);
  const [showCoupons, setShowCoupons] = useState(false);
  const [paymentMode, setPaymentMode] = useState('wallet'); // 'wallet' | 'card'

  const sym = currency?.symbol || '$';
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;
  const maxPointsDiscount = Math.min((subtotal - couponDiscount) * 0.5, (pointsData?.balance || 0) / 100);
  const pointsDiscount = usePoints ? maxPointsDiscount : 0;
  const afterDiscount = subtotal - couponDiscount - pointsDiscount;
  const vat = afterDiscount * 0.1;
  const total = afterDiscount + vat;

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const result = validateCoupon(couponInput, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      Alert.alert(t('couponApplied'), result.description);
    } else {
      setCouponError(result.error);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      Alert.alert(t('signInRequired'), t('signInToPurchase'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('signIn'), onPress: () => navigation.getParent()?.navigate('Account') },
      ]);
      return;
    }
    if (currentUser.wallet < total) {
      Alert.alert(t('insufficientBalance'), `${t('walletBalance')}: $${currentUser.wallet.toFixed(2)}`, [
        { text: t('cancel'), style: 'cancel' },
        { text: t('addFunds'), onPress: () => navigation.getParent()?.navigate('Wallet') },
      ]);
      return;
    }
    const result = checkout({
      couponCode: appliedCoupon?.code,
      usePointsAmount: usePoints ? (pointsData?.balance || 0) : 0,
    });
    if (result.success) {
      setOrderedInfo(result);
      setOrdered(true);
    }
  };

  if (ordered) {
    return (
      <View style={[styles.centerWrap, { backgroundColor: C.bg }]}>
        <LinearGradient colors={['#4c1d95', '#7c3aed']} style={styles.successCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </LinearGradient>
        <Text style={[styles.successTitle, { color: C.green }]}>{t('orderPlaced')}</Text>
        <Text style={[styles.successSub, { color: C.textMuted }]}>{t('orderConfirmed')}</Text>
        {orderedInfo?.earned > 0 && (
          <View style={[styles.pointsBanner, { backgroundColor: `${C.accent}22`, borderColor: `${C.accent}44` }]}>
            <Ionicons name="star" size={16} color={C.accent} />
            <Text style={[styles.pointsBannerText, { color: C.accent }]}>
              {t('youEarned')} {orderedInfo.earned} {t('pointsFromOrder')}!
            </Text>
          </View>
        )}
        <Text style={[styles.walletAfter, { color: C.textMuted }]}>
          {t('walletBalance')}: <Text style={{ color: C.green }}>${currentUser?.wallet.toFixed(2)}</Text>
        </Text>
        <TouchableOpacity onPress={() => { setOrdered(false); navigation.getParent()?.navigate('Home'); }} activeOpacity={0.85}>
          <LinearGradient colors={[C.primary, C.primary2]} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>{t('backToHome')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={[styles.centerWrap, { backgroundColor: C.bg }]}>
        <Ionicons name="cart-outline" size={70} color={C.textMuted} />
        <Text style={[styles.emptyTitle, { color: C.text }]}>{t('cartEmpty')}</Text>
        <Text style={[styles.emptySub, { color: C.textMuted }]}>{t('cartEmptySub')}</Text>
        <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Products')} activeOpacity={0.85}>
          <LinearGradient colors={[C.primary, C.primary2]} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>{t('browseProducts')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>

      {/* Cart Items */}
      {cart.map((item, i) => (
        <View key={i} style={[styles.cartItem, { backgroundColor: C.bg2, borderColor: C.border }, isRTL && { flexDirection: 'row-reverse' }]}>
          <LinearGradient colors={item.colors || ['#4c1d95', '#7c3aed']} style={styles.itemIcon}>
            <Text style={styles.itemIconText}>{(item.short || '').substring(0, 4)}</Text>
          </LinearGradient>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemName, { color: C.textSub }, isRTL && { textAlign: 'right' }]}>{item.name}</Text>
            <Text style={[styles.itemPkg, { color: C.textMuted }, isRTL && { textAlign: 'right' }]}>{item.pkg} × {item.qty}</Text>
          </View>
          <View style={styles.itemRight}>
            <Text style={[styles.itemPrice, { color: C.accent }]}>${(item.price * item.qty).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.productId, item.pkgIndex)} style={styles.removeBtn}>
              <Ionicons name="trash-outline" size={17} color={C.red} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* ─ Coupon Section ─ */}
      <View style={[styles.section, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="pricetag" size={16} color={C.primary2} />
          <Text style={[styles.sectionTitle, { color: C.text }]}>{t('coupon')}</Text>
          <TouchableOpacity onPress={() => setShowCoupons(!showCoupons)} style={[styles.showCouponsBtn, { borderColor: C.border }]}>
            <Text style={[styles.showCouponsBtnText, { color: C.accent }]}>
              {showCoupons ? (isRTL ? 'إخفاء' : 'Hide') : t('availableCoupons')}
            </Text>
          </TouchableOpacity>
        </View>

        {showCoupons && (
          <View style={styles.couponsGrid}>
            {COUPONS.map(c => (
              <TouchableOpacity
                key={c.code}
                style={[styles.couponChip, { borderColor: appliedCoupon?.code === c.code ? C.primary : C.border, backgroundColor: appliedCoupon?.code === c.code ? `${C.primary}22` : C.bg3 }]}
                onPress={() => { setCouponInput(c.code); setCouponError(''); }}
              >
                <Text style={[styles.couponChipCode, { color: C.primary2 }]}>{c.code}</Text>
                <Text style={[styles.couponChipDesc, { color: C.textMuted }]}>{c.desc[isRTL ? 'ar' : 'en']}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {appliedCoupon ? (
          <View style={[styles.appliedCoupon, { backgroundColor: `${C.green}18`, borderColor: `${C.green}44` }]}>
            <View style={[{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }]}>
              <Ionicons name="checkmark-circle" size={16} color={C.green} />
              <Text style={[styles.appliedCouponText, { color: C.green }]}>{appliedCoupon.code} — {appliedCoupon.type === 'percent' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} {isRTL ? 'خصم' : 'off'}</Text>
            </View>
            <TouchableOpacity onPress={() => { setAppliedCoupon(null); setCouponInput(''); }}>
              <Text style={[{ fontSize: 11, color: C.red, fontWeight: '700' }]}>{t('removeCoupon')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.couponInputRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <TextInput
              style={[styles.couponInput, { backgroundColor: C.bg3, borderColor: couponError ? C.red : C.border, color: C.text }, isRTL && { textAlign: 'right' }]}
              placeholder={t('enterCoupon')}
              placeholderTextColor={C.textMuted}
              value={couponInput}
              onChangeText={v => { setCouponInput(v); setCouponError(''); }}
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={handleApplyCoupon}>
              <LinearGradient colors={[C.primary, C.primary2]} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>{t('applyCoupon')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        {!!couponError && (
          <View style={[styles.couponError, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="alert-circle-outline" size={13} color={C.red} />
            <Text style={[styles.couponErrorText, { color: C.red }]}>{couponError}</Text>
          </View>
        )}
      </View>

      {/* ─ Loyalty Points Section ─ */}
      {currentUser && (pointsData?.balance || 0) > 0 && (
        <View style={[styles.section, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name="star" size={16} color={C.accent} />
            <Text style={[styles.sectionTitle, { color: C.text }]}>{t('loyaltyPoints')}</Text>
            <View style={[styles.pointsBadge, { backgroundColor: `${C.accent}22` }]}>
              <Text style={[styles.pointsBadgeText, { color: C.accent }]}>{pointsData.balance} {isRTL ? 'نقطة' : 'pts'}</Text>
            </View>
          </View>
          <View style={[styles.pointsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pointsDesc, { color: C.textSub }, isRTL && { textAlign: 'right' }]}>
                {t('pointsInfo')}
              </Text>
              <Text style={[styles.pointsDesc, { color: C.accent }, isRTL && { textAlign: 'right' }]}>
                {isRTL ? `خصم ${maxPointsDiscount > 0 ? `$${maxPointsDiscount.toFixed(2)}` : '$0'}` : `Save $${maxPointsDiscount > 0 ? maxPointsDiscount.toFixed(2) : '0'}`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.pointsToggle, { backgroundColor: usePoints ? C.primary : C.bg3, borderColor: usePoints ? C.primary : C.border }]}
              onPress={() => setUsePoints(!usePoints)}
            >
              <Ionicons name={usePoints ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={usePoints ? '#fff' : C.textMuted} />
              <Text style={[styles.pointsToggleText, { color: usePoints ? '#fff' : C.textMuted }]}>
                {t('usePoints')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ─ Payment Method ─ */}
      <View style={[styles.section, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="card" size={16} color={C.primary2} />
          <Text style={[styles.sectionTitle, { color: C.text }]}>{t('selectPaymentMethod')}</Text>
        </View>
        <View style={styles.paymentOptions}>
          <TouchableOpacity
            style={[styles.paymentOpt, { borderColor: paymentMode === 'wallet' ? C.primary : C.border, backgroundColor: paymentMode === 'wallet' ? `${C.primary}18` : C.bg3 }]}
            onPress={() => setPaymentMode('wallet')}
          >
            <Ionicons name="wallet" size={20} color={paymentMode === 'wallet' ? C.primary2 : C.textMuted} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.paymentOptTitle, { color: paymentMode === 'wallet' ? C.text : C.textMuted }]}>{t('payByWallet')}</Text>
              <Text style={[styles.paymentOptSub, { color: paymentMode === 'wallet' ? C.green : C.textMuted }]}>
                ${currentUser?.wallet.toFixed(2) || '0.00'}
              </Text>
            </View>
            {paymentMode === 'wallet' && <Ionicons name="checkmark-circle" size={20} color={C.primary2} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOpt, { borderColor: paymentMode === 'card' ? C.primary : C.border, backgroundColor: paymentMode === 'card' ? `${C.primary}18` : C.bg3 }]}
            onPress={() => setPaymentMode('card')}
          >
            <Ionicons name="card" size={20} color={paymentMode === 'card' ? C.primary2 : C.textMuted} />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.paymentOptTitle, { color: paymentMode === 'card' ? C.text : C.textMuted }]}>{t('payByCard')}</Text>
              <Text style={[styles.paymentOptSub, { color: C.textMuted }]}>Visa / Mastercard / Mada</Text>
            </View>
            {paymentMode === 'card' && <Ionicons name="checkmark-circle" size={20} color={C.primary2} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* ─ Order Summary ─ */}
      <View style={[styles.summary, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <Text style={[styles.summaryTitle, { color: C.text }, isRTL && { textAlign: 'right' }]}>
          {isRTL ? 'ملخص الطلب' : 'Order Summary'}
        </Text>
        {[
          [t('subtotal'), `$${subtotal.toFixed(2)}`, null],
          ...(couponDiscount > 0 ? [[`${t('couponDiscount')} (${appliedCoupon.code})`, `-$${couponDiscount.toFixed(2)}`, C.green]] : []),
          ...(pointsDiscount > 0 ? [[t('pointsDiscount'), `-$${pointsDiscount.toFixed(2)}`, C.accent]] : []),
          [t('vat'), `$${vat.toFixed(2)}`, null],
        ].map(([k, v, vc], i) => (
          <View key={i} style={[styles.sumRow, { borderBottomColor: C.border }, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.sumK, { color: C.textMuted }]}>{k}</Text>
            <Text style={[styles.sumV, { color: vc || C.textSub }]}>{v}</Text>
          </View>
        ))}
        <View style={[styles.sumRow, styles.totalRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Text style={[styles.totalLabel, { color: C.text }]}>{t('total')}</Text>
          <Text style={[styles.totalValue, { color: C.accent }]}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Wallet balance hint */}
      {currentUser && (
        <View style={[styles.walletHint, { backgroundColor: `${C.primary}11`, borderColor: `${C.primary}22` }]}>
          <Ionicons name="wallet-outline" size={14} color={C.textMuted} />
          <Text style={[styles.walletHintText, { color: C.textMuted }]}>
            {t('walletBalance')}: <Text style={{ color: currentUser.wallet >= total ? C.green : C.red }}>${currentUser.wallet.toFixed(2)}</Text>
          </Text>
        </View>
      )}

      {/* Checkout Button */}
      <TouchableOpacity onPress={handleCheckout} activeOpacity={0.88}>
        <LinearGradient colors={['#f97316', '#ef4444']} style={styles.checkoutBtn}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.checkoutBtnText}>{t('checkout')} — ${total.toFixed(2)}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '800' },
  emptySub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  successCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 24, fontWeight: '900' },
  successSub: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  pointsBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  pointsBannerText: { fontSize: 13, fontWeight: '700' },
  walletAfter: { fontSize: 13 },
  actionBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  actionBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  cartItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 13, marginBottom: 10, borderWidth: 1, gap: 11 },
  itemIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemIconText: { fontSize: 9, fontWeight: '900', color: '#fff', textAlign: 'center' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '700' },
  itemPkg: { fontSize: 11, marginTop: 2 },
  itemRight: { alignItems: 'flex-end', gap: 6 },
  itemPrice: { fontSize: 14, fontWeight: '800' },
  removeBtn: { padding: 2 },
  section: { borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', flex: 1 },
  showCouponsBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  showCouponsBtnText: { fontSize: 11, fontWeight: '600' },
  couponsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  couponChip: { borderRadius: 10, borderWidth: 1, padding: 8, minWidth: '47%' },
  couponChipCode: { fontSize: 12, fontWeight: '900', marginBottom: 2 },
  couponChipDesc: { fontSize: 10, fontWeight: '500' },
  couponInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  couponInput: { flex: 1, borderRadius: 10, borderWidth: 1, padding: 11, fontSize: 14 },
  applyBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12 },
  applyBtnText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  appliedCoupon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, borderWidth: 1, padding: 10 },
  appliedCouponText: { fontSize: 13, fontWeight: '700' },
  couponError: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  couponErrorText: { fontSize: 11, fontWeight: '600' },
  pointsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pointsDesc: { fontSize: 11, fontWeight: '500', marginBottom: 2 },
  pointsBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  pointsBadgeText: { fontSize: 11, fontWeight: '800' },
  pointsToggle: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 11, borderWidth: 1 },
  pointsToggleText: { fontSize: 12, fontWeight: '700' },
  paymentOptions: { gap: 8 },
  paymentOpt: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 11, borderWidth: 1, padding: 12 },
  paymentOptTitle: { fontSize: 13, fontWeight: '700' },
  paymentOptSub: { fontSize: 11, marginTop: 1 },
  summary: { borderRadius: 14, padding: 15, marginBottom: 12, borderWidth: 1 },
  summaryTitle: { fontSize: 14, fontWeight: '800', marginBottom: 12 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1 },
  sumK: { fontSize: 12 },
  sumV: { fontSize: 12, fontWeight: '700' },
  totalRow: { borderBottomWidth: 0, paddingTop: 12, marginTop: 2 },
  totalLabel: { fontSize: 15, fontWeight: '800' },
  totalValue: { fontSize: 18, fontWeight: '900' },
  walletHint: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1 },
  walletHintText: { fontSize: 12 },
  checkoutBtn: { borderRadius: 15, padding: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  checkoutBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});