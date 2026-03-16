import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

// ─── GUEST GATE ───────────────────────────────────────────────────────────────
function GuestGate({ navigation }) {
  const { t, isRTL, colors: C } = useApp();
  return (
    <View style={[s.centerWrap, { backgroundColor: C.bg }]}>
      <Text style={s.gateIcon}>🔒</Text>
      <Text style={[s.gateTitle, { color: C.text }, isRTL && s.rtlText]}>{t('signInToView')}</Text>
      <Text style={[s.gateSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('signInToViewSub')}</Text>
      <TouchableOpacity style={s.fullWidth} onPress={() => navigation.navigate('Account')}>
        <LinearGradient colors={['#7c3aed', '#a855f7']} style={s.actionBtn}>
          <Text style={s.actionBtnText}>{t('loginNow')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export function OrdersScreen({ navigation }) {
  const { orders, t, isRTL, currentUser, colors: C } = useApp();
  if (!currentUser) return <GuestGate navigation={navigation} />;

  const completed = orders.filter(o => o.status === 'completed').length;
  const getStatus = (st) => ({
    bg: st === 'completed' ? 'rgba(52,211,153,0.15)' : st === 'pending' ? 'rgba(251,191,36,0.15)' : 'rgba(248,113,113,0.15)',
    color: st === 'completed' ? '#34d399' : st === 'pending' ? '#fbbf24' : '#f87171',
    label: st === 'completed' ? t('completed') : st === 'pending' ? t('pending') : t('failed'),
  });

  if (orders.length === 0) {
    return (
      <View style={[s.centerWrap, { backgroundColor: C.bg }]}>
        <Text style={s.gateIcon}>📋</Text>
        <Text style={[s.gateTitle, { color: C.text }, isRTL && s.rtlText]}>{t('noOrdersYet')}</Text>
        <Text style={[s.gateSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('noOrdersSub')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
      <View style={s.statsGrid}>
        {[{ label: t('totalOrders'), value: orders.length }, { label: t('completed'), value: completed }].map((st, i) => (
          <View key={i} style={[s.statCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
            <Text style={[s.statLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{st.label}</Text>
            <Text style={[s.statValue, { color: C.text }]}>{st.value}</Text>
          </View>
        ))}
      </View>
      <View style={[s.sectionRow, isRTL && s.rowRev]}>
        <Text style={[s.sectionTitle, { color: C.text }]}>{t('recentOrders')}</Text>
      </View>
      {orders.map((o, i) => {
        const st = getStatus(o.status);
        return (
          <View key={i} style={[s.orderItem, { backgroundColor: C.bg2, borderColor: C.border }]}>
            <View style={[s.orderTop, isRTL && s.rowRev]}>
              <Text style={[s.orderId, { color: C.accent }]}>{o.id}</Text>
              <View style={[s.badge, { backgroundColor: st.bg }]}>
                <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
              </View>
            </View>
            <Text style={[s.orderName, { color: C.textSub }, isRTL && s.rtlText]}>{o.name}</Text>
            <View style={[s.orderBottom, isRTL && s.rowRev]}>
              <Text style={[s.orderCustomer, { color: C.textMuted }]}>{o.customer} · {o.date}</Text>
              <Text style={[s.orderAmount, { color: C.text }]}>{o.amount}</Text>
            </View>
          </View>
        );
      })}
      <View style={{ height: 16 }} />
    </ScrollView>
  );
}

// ─── WALLET ───────────────────────────────────────────────────────────────────
export function WalletScreen({ navigation }) {
  const { currentUser, addFunds, transactions, t, isRTL, colors: C, currency, transferFunds } = useApp();
  const [activeTab, setActiveTab] = useState('wallet'); // 'wallet' | 'topup' | 'transfer'
  const [amount, setAmount] = useState('');
  const [transferTarget, setTransferTarget] = useState('');
  const [transferAmt, setTransferAmt] = useState('');
  const sym = currency?.symbol || '$';

  if (!currentUser) return <GuestGate navigation={navigation} />;

  const handleTopup = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { Alert.alert(t('invalidAmount'), t('enterValidAmount')); return; }
    addFunds(amount);
    setAmount('');
    setActiveTab('wallet');
    Alert.alert(t('successTopup'), `$${amt.toFixed(2)}`);
  };

  const handleTransfer = () => {
    if (!transferTarget.trim() || !transferAmt) {
      Alert.alert(isRTL ? 'خطأ' : 'Error', isRTL ? 'املأ جميع الحقول' : 'Fill all fields');
      return;
    }
    const result = transferFunds(transferTarget.trim(), transferAmt);
    if (result.success) {
      Alert.alert(
        t('transferSuccess'),
        isRTL ? `تم تحويل $${result.amount.toFixed(2)} إلى ${result.targetName}` : `$${result.amount.toFixed(2)} transferred to ${result.targetName}`
      );
      setTransferTarget('');
      setTransferAmt('');
      setActiveTab('wallet');
    } else {
      Alert.alert(isRTL ? 'خطأ' : 'Error', result.error);
    }
  };

  const tabs = [
    { key: 'wallet', label: isRTL ? '💳 المحفظة' : '💳 Wallet' },
    { key: 'topup',  label: isRTL ? '➕ إضافة' : '➕ Add Funds' },
    { key: 'transfer', label: isRTL ? '↗️ تحويل' : '↗️ Transfer' },
  ];

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
      {/* Wallet Card */}
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#9333ea']} style={s.walletCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Text style={[s.walLabel, isRTL && s.rtlText]}>{t('availableBalance')}</Text>
        <Text style={s.walBalance}>${currentUser.wallet.toFixed(2)}</Text>
        <Text style={[s.walUser, isRTL && s.rtlText]}>{t('accountLabel')}: {currentUser.name}</Text>
        <View style={[s.walBubble, { width: 130, height: 130, top: -40, right: -35 }]} />
        <View style={[s.walBubble, { width: 80, height: 80, bottom: -25, right: 100 }]} />
      </LinearGradient>

      {/* Tabs */}
      <View style={[s.tabsRow, { backgroundColor: C.bg2, borderColor: C.border }, isRTL && s.rowRev]}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[s.tabBtn, activeTab === tab.key && { backgroundColor: C.primary }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[s.tabBtnText, { color: activeTab === tab.key ? '#fff' : C.textMuted }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Funds */}
      {activeTab === 'topup' && (
        <View style={[s.actionBox, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={[s.actionBoxTitle, { color: C.text }, isRTL && s.rtlText]}>{t('addFundsTitle')}</Text>
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('amountUSD')}</Text>
          <TextInput
            style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]}
            placeholder="50" placeholderTextColor={C.textMuted}
            value={amount} onChangeText={setAmount} keyboardType="numeric"
          />
          <View style={[s.quickAmounts, isRTL && s.rowRev]}>
            {['10', '25', '50', '100'].map(v => (
              <TouchableOpacity key={v} style={[s.quickAmt, { borderColor: C.border, backgroundColor: amount === v ? C.primary : C.bg3 }]} onPress={() => setAmount(v)}>
                <Text style={[s.quickAmtText, { color: amount === v ? '#fff' : C.textMuted }]}>${v}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleTopup}>
            <LinearGradient colors={[C.primary, C.primary2]} style={s.confirmBtn}>
              <Text style={s.confirmBtnText}>{t('confirmTopup')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Transfer */}
      {activeTab === 'transfer' && (
        <View style={[s.actionBox, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={[s.actionBoxTitle, { color: C.text }, isRTL && s.rtlText]}>{t('transferFunds')}</Text>
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('transferTo')}</Text>
          <TextInput
            style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]}
            placeholder={t('transferPlaceholder')} placeholderTextColor={C.textMuted}
            value={transferTarget} onChangeText={setTransferTarget} autoCapitalize="none"
          />
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('transferAmount')}</Text>
          <TextInput
            style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]}
            placeholder="0.00" placeholderTextColor={C.textMuted}
            value={transferAmt} onChangeText={setTransferAmt} keyboardType="numeric"
          />
          <View style={[s.balanceHint, isRTL && s.rowRev]}>
            <Text style={[s.balanceHintText, { color: C.textMuted }]}>
              {isRTL ? `رصيدك: $${currentUser.wallet.toFixed(2)}` : `Balance: $${currentUser.wallet.toFixed(2)}`}
            </Text>
          </View>
          <TouchableOpacity onPress={handleTransfer}>
            <LinearGradient colors={['#10b981', '#059669']} style={s.confirmBtn}>
              <Text style={s.confirmBtnText}>{t('transferConfirm')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats */}
      {activeTab === 'wallet' && (
        <>
          <View style={s.statsGrid}>
            {[{ label: t('totalSpent'), value: `$${currentUser.spent.toFixed(0)}` }, { label: t('cashback'), value: '$0.00' }].map((st, i) => (
              <View key={i} style={[s.statCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
                <Text style={[s.statLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{st.label}</Text>
                <Text style={[s.statValue, { color: C.text }]}>{st.value}</Text>
              </View>
            ))}
          </View>
          <View style={[s.sectionRow, isRTL && s.rowRev]}>
            <Text style={[s.sectionTitle, { color: C.text }]}>{t('recentTransactions')}</Text>
          </View>
          {transactions.length === 0 ? (
            <View style={[s.centerWrap, { paddingTop: 30 }]}>
              <Text style={s.gateIcon}>💳</Text>
              <Text style={[s.gateTitle, { color: C.text }]}>{t('noTransactionsYet')}</Text>
              <Text style={[s.gateSub, { color: C.textMuted }]}>{t('noTransactionsSub')}</Text>
            </View>
          ) : transactions.slice(0, 8).map((tr, i) => (
            <View key={i} style={[s.transItem, { backgroundColor: C.bg2, borderColor: C.border }, isRTL && s.rowRev]}>
              <View style={[s.transIcon, { backgroundColor: tr.bg }]}><Text style={{ fontSize: 17 }}>{tr.icon}</Text></View>
              <View style={s.transInfo}>
                <Text style={[s.transName, { color: C.textSub }, isRTL && s.rtlText]}>{tr.name}</Text>
                <Text style={[s.transDate, { color: C.textMuted }, isRTL && s.rtlText]}>{tr.date}</Text>
              </View>
              <Text style={[s.transAmount, { color: tr.color }]}>{tr.amount}</Text>
            </View>
          ))}
        </>
      )}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────
export function AccountScreen({ navigation }) {
  const { currentUser, logout, t, isRTL, login, register, toggleLanguage, language, colors: C, requestPasswordReset, verifyOTPAndReset } = useApp();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassValue, setNewPassValue] = useState('');
  const [confirmNewPassValue, setConfirmNewPassValue] = useState('');
  const [demoCode, setDemoCode] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [error, setError] = useState('');

  const reset = () => { setError(''); setEmail(''); setPassword(''); setName(''); setUsername(''); setConfirmPass(''); setResetEmail(''); setEnteredOtp(''); setNewPassValue(''); setConfirmNewPassValue(''); setDemoCode(''); };

  const handleLogin = () => {
    setError('');
    const result = login(email.trim(), password.trim());
    if (result.success) reset();
    else setError(result.error);
  };

  const handleRegister = () => {
    setError('');
    if (!name || !username || !email || password.length < 6) { setError(t('fillAllFields')); return; }
    if (password !== confirmPass) { setError(t('passwordsNotMatch')); return; }
    const result = register(name.trim(), username.trim(), email.trim(), password.trim());
    if (result.success) { Alert.alert(t('accountCreated'), t('canSignIn')); reset(); setMode('login'); }
    else setError(result.error);
  };

  const menuItems = [
    { icon: '⚡', title: t('transactions'), sub: t('viewPayments'),  route: 'Transactions', bg: 'rgba(124,58,237,0.2)' },
    { icon: '📄', title: t('invoice'),      sub: t('viewInvoices'),  route: 'Invoice',      bg: 'rgba(251,191,36,0.15)' },
    { icon: '⚙️', title: t('settings'),     sub: t('appPreferences'),route: 'Settings',     bg: 'rgba(248,113,113,0.15)' },
  ];

  const LangToggle = () => (
    <TouchableOpacity style={[s.langToggleBtn, isRTL && s.rowRev]} onPress={toggleLanguage}>
      <Text style={{ fontSize: 16 }}>🌐</Text>
      <Text style={[{ flex: 1, fontSize: 12, fontWeight: '600', color: C.textMuted, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }, isRTL && s.rtlText]}>{t('switchLanguage')}</Text>
      <View style={[s.langBadge, { borderColor: 'rgba(124,58,237,0.3)', backgroundColor: 'rgba(124,58,237,0.1)' }]}>
        <Text style={[s.langBadgeText, { color: C.accent }]}>{language === 'ar' ? '🇸🇦 AR' : '🇺🇸 EN'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (currentUser) {
    return (
      <ScrollView style={[s.container, { backgroundColor: C.bg }]} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4c1d95', '#7c3aed', '#a855f7']} style={s.profileCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={[s.profileCardRow, isRTL && s.rowRev]}>
            <View style={s.profileAvatarLg}><Text style={s.profileAvatarLgText}>{currentUser.avatar}</Text></View>
            <View style={[s.profileCardInfo, isRTL && { marginRight: 14, marginLeft: 0 }]}>
              <Text style={[s.profileCardName, isRTL && s.rtlText]}>{currentUser.name}</Text>
              <Text style={[s.profileCardEmail, isRTL && s.rtlText]}>{currentUser.email}</Text>
              <View style={[s.profileCardBal, isRTL && s.rowRev]}>
                <Text style={s.profileCardBalLabel}>{t('balance')}: </Text>
                <Text style={s.profileCardBalValue}>${currentUser.wallet.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          <View style={[s.walBubble, { width: 110, height: 110, top: -28, right: -28 }]} />
        </LinearGradient>

        {menuItems.map((m, i) => (
          <TouchableOpacity key={i} style={[s.menuItem, { backgroundColor: C.bg2, borderColor: C.border }, isRTL && s.rowRev]} onPress={() => navigation.navigate(m.route)}>
            <View style={[s.menuIcon, { backgroundColor: m.bg }]}><Text style={{ fontSize: 18 }}>{m.icon}</Text></View>
            <View style={[s.menuText, isRTL && { marginRight: 12, marginLeft: 0 }]}>
              <Text style={[s.menuTitle, { color: C.textSub }, isRTL && s.rtlText]}>{m.title}</Text>
              <Text style={[s.menuSub, { color: C.textMuted }, isRTL && s.rtlText]}>{m.sub}</Text>
            </View>
            <Text style={[s.menuArrow, { color: C.border }]}>{isRTL ? '‹' : '›'}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[s.logoutBtn, isRTL && s.rowRev]} onPress={() => { logout(); Alert.alert(t('loggedOut')); }}>
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={[s.logoutText, isRTL && s.rtlText]}>{t('logout')}</Text>
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  }

  if (mode === 'forgot') {
    return (
      <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={s.authContainer}>
        <View style={[s.authCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={s.authIcon}>🔐</Text>
          <Text style={[s.authTitle, { color: C.text }, isRTL && s.rtlText]}>{t('resetPassword')}</Text>
          <Text style={[s.authSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('forgotPasswordSub')}</Text>
          {!!error && <View style={s.errorBox}><Text style={[s.errorText, isRTL && s.rtlText]}>{error}</Text></View>}
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('emailOrUsername')}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('emailOrUsername')} placeholderTextColor={C.textMuted} value={resetEmail} onChangeText={setResetEmail} autoCapitalize="none" />
          <TouchableOpacity onPress={() => {
            setError('');
            if (!resetEmail.trim()) { setError(isRTL ? 'أدخل بريدك أو اسم المستخدم' : 'Enter email or username'); return; }
            const result = requestPasswordReset(resetEmail.trim());
            if (!result.success) { setError(result.error); return; }
            setDemoCode(result.code); setOtpEmail(result.email);
            Alert.alert(isRTL ? '📧 كود التحقق (تجريبي)' : '📧 Verification Code (Demo)', isRTL ? `كودك: ${result.code}` : `Your code: ${result.code}`, [{ text: 'OK' }]);
            setMode('otp');
          }}>
            <LinearGradient colors={[C.primary, C.primary2]} style={s.authBtn}><Text style={s.authBtnText}>{t('sendResetLink')}</Text></LinearGradient>
          </TouchableOpacity>
          <LangToggle />
          <TouchableOpacity style={s.backLink} onPress={() => { setMode('login'); reset(); }}>
            <Text style={[s.backLinkText, { color: C.accent }]}>← {t('backToLogin')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'otp') {
    return (
      <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={s.authContainer}>
        <View style={[s.authCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={s.authIcon}>📩</Text>
          <Text style={[s.authTitle, { color: C.text }, isRTL && s.rtlText]}>{isRTL ? 'أدخل كود التحقق' : 'Enter Verification Code'}</Text>
          <Text style={[s.authSub, { color: C.textMuted }, isRTL && s.rtlText]}>{isRTL ? `أُرسل كود إلى: ${otpEmail}` : `Code sent to: ${otpEmail}`}</Text>
          {!!demoCode && (
            <TouchableOpacity style={[s.demoBox, { borderColor: 'rgba(251,191,36,0.3)' }]} onPress={() => setEnteredOtp(demoCode)}>
              <Text style={[s.demoText, { color: C.accent }, isRTL && s.rtlText]}>{isRTL ? `🔢 كودك: ${demoCode} (اضغط للنسخ)` : `🔢 Code: ${demoCode} (Tap to fill)`}</Text>
            </TouchableOpacity>
          )}
          {!!error && <View style={s.errorBox}><Text style={[s.errorText, isRTL && s.rtlText]}>{error}</Text></View>}
          <View style={[s.otpRow, isRTL && s.rowRev]}>
            {[0,1,2,3,4,5].map(i => (
              <TextInput
                key={i}
                style={[s.otpBox, { backgroundColor: C.bg3, borderColor: enteredOtp.length > i ? C.primary : C.border, color: C.text }]}
                value={enteredOtp[i] || ''} maxLength={1} keyboardType="numeric" textAlign="center"
                onChangeText={val => {
                  const arr = enteredOtp.split('');
                  arr[i] = val.replace(/[^0-9]/g, '');
                  setEnteredOtp(arr.join('').slice(0, 6));
                }}
              />
            ))}
          </View>
          <TouchableOpacity style={{ opacity: enteredOtp.length < 6 ? 0.5 : 1 }} disabled={enteredOtp.length < 6} onPress={() => { setError(''); setMode('newpass'); }}>
            <LinearGradient colors={enteredOtp.length === 6 ? [C.primary, C.primary2] : ['#3a2f5a', '#4a3f6a']} style={s.authBtn}>
              <Text style={s.authBtnText}>{isRTL ? 'تأكيد ←' : 'Verify →'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }} onPress={() => {
            const result = requestPasswordReset(resetEmail.trim());
            if (result.success) { setDemoCode(result.code); Alert.alert(isRTL ? 'كود جديد' : 'New Code', isRTL ? `كودك: ${result.code}` : `Code: ${result.code}`, [{ text: 'OK' }]); }
          }}>
            <Text style={{ fontSize: 12, color: C.accent, fontWeight: '600' }}>{isRTL ? '🔄 إعادة إرسال' : '🔄 Resend Code'}</Text>
          </TouchableOpacity>
          <LangToggle />
          <TouchableOpacity style={s.backLink} onPress={() => { setMode('forgot'); setEnteredOtp(''); setError(''); }}>
            <Text style={[s.backLinkText, { color: C.accent }]}>← {isRTL ? 'رجوع' : 'Back'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (mode === 'newpass') {
    return (
      <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={s.authContainer}>
        <View style={[s.authCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
          <Text style={s.authIcon}>🔑</Text>
          <Text style={[s.authTitle, { color: C.text }, isRTL && s.rtlText]}>{isRTL ? 'كلمة مرور جديدة' : 'New Password'}</Text>
          {!!error && <View style={s.errorBox}><Text style={[s.errorText, isRTL && s.rtlText]}>{error}</Text></View>}
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={isRTL ? '6 أحرف على الأقل' : 'Min 6 characters'} placeholderTextColor={C.textMuted} value={newPassValue} onChangeText={setNewPassValue} secureTextEntry />
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('confirmPassword')}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text, marginBottom: 12 }, isRTL && { textAlign: 'right' }]} placeholder={t('confirmPassword')} placeholderTextColor={C.textMuted} value={confirmNewPassValue} onChangeText={setConfirmNewPassValue} secureTextEntry />
          <TouchableOpacity onPress={() => {
            setError('');
            if (newPassValue.length < 6) { setError(isRTL ? 'كلمة المرور 6 أحرف على الأقل' : 'Min 6 characters'); return; }
            if (newPassValue !== confirmNewPassValue) { setError(t('passwordsNotMatch')); return; }
            const result = verifyOTPAndReset(enteredOtp, newPassValue);
            if (result.success) {
              Alert.alert(isRTL ? '✅ تم التغيير' : '✅ Changed', isRTL ? 'يمكنك تسجيل الدخول الآن' : 'You can now sign in', [{ text: 'OK', onPress: () => { reset(); setMode('login'); } }]);
            } else { setError(result.error); setMode('otp'); }
          }}>
            <LinearGradient colors={[C.primary, C.primary2]} style={s.authBtn}><Text style={s.authBtnText}>{isRTL ? '✅ حفظ' : '✅ Save'}</Text></LinearGradient>
          </TouchableOpacity>
          <LangToggle />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={s.authContainer}>
      <View style={[s.authCard, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <Text style={s.authIcon}>{mode === 'login' ? '👋' : '🎉'}</Text>
        <Text style={[s.authTitle, { color: C.text }, isRTL && s.rtlText]}>{mode === 'login' ? t('welcomeBack') : t('createAccount')}</Text>
        {mode === 'login' && <Text style={[s.authSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('welcomeBackSub')}</Text>}
        {mode === 'login' && <View style={[s.demoBox, { borderColor: 'rgba(124,58,237,0.25)' }]}><Text style={[s.demoText, { color: C.accent }, isRTL && s.rtlText]}>{t('demoText')}</Text></View>}
        {!!error && <View style={s.errorBox}><Text style={[s.errorText, isRTL && s.rtlText]}>{error}</Text></View>}

        {mode === 'register' && (
          <>
            <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('fullName')}</Text>
            <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('fullName')} placeholderTextColor={C.textMuted} value={name} onChangeText={setName} />
            <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('username')}</Text>
            <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('username')} placeholderTextColor={C.textMuted} value={username} onChangeText={setUsername} autoCapitalize="none" />
          </>
        )}

        <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('emailOrUsername')}</Text>
        <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('emailOrUsername')} placeholderTextColor={C.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('password')}</Text>
        <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('password')} placeholderTextColor={C.textMuted} value={password} onChangeText={setPassword} secureTextEntry />

        {mode === 'register' && (
          <>
            <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('confirmPassword')}</Text>
            <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('confirmPassword')} placeholderTextColor={C.textMuted} value={confirmPass} onChangeText={setConfirmPass} secureTextEntry />
          </>
        )}

        {mode === 'login' && (
          <TouchableOpacity onPress={() => { setMode('forgot'); reset(); }} style={[s.forgotLink, isRTL && { alignSelf: 'flex-start' }]}>
            <Text style={[s.forgotLinkText, { color: C.accent }]}>{t('forgotPassword')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={mode === 'login' ? handleLogin : handleRegister}>
          <LinearGradient colors={[C.primary, C.primary2]} style={s.authBtn}>
            <Text style={s.authBtnText}>{mode === 'login' ? t('signIn') : t('createAccount')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <LangToggle />

        <TouchableOpacity style={s.switchLink} onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); reset(); }}>
          <Text style={[s.switchText, { color: C.textMuted }]}>
            {mode === 'login' ? t('noAccount') : t('haveAccount')}
            <Text style={{ color: C.accent }}>{mode === 'login' ? t('signUpLink') : t('signInLink')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export function TransactionsScreen({ navigation }) {
  const { transactions, isRTL, t, currentUser, colors: C } = useApp();
  if (!currentUser) return <GuestGate navigation={navigation} />;

  if (transactions.length === 0) {
    return (
      <View style={[s.centerWrap, { backgroundColor: C.bg }]}>
        <Text style={s.gateIcon}>💳</Text>
        <Text style={[s.gateTitle, { color: C.text }, isRTL && s.rtlText]}>{t('noTransactionsYet')}</Text>
        <Text style={[s.gateSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('noTransactionsSub')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={{ padding: 14 }}>
      {transactions.map((tr, i) => (
        <View key={i} style={[s.transItem, { backgroundColor: C.bg2, borderColor: C.border }, isRTL && s.rowRev]}>
          <View style={[s.transIcon, { backgroundColor: tr.bg }]}><Text style={{ fontSize: 17 }}>{tr.icon}</Text></View>
          <View style={s.transInfo}>
            <Text style={[s.transName, { color: C.textSub }, isRTL && s.rtlText]}>{tr.name}</Text>
            <Text style={[s.transDate, { color: C.textMuted }, isRTL && s.rtlText]}>{tr.date}</Text>
          </View>
          <Text style={[s.transAmount, { color: tr.color }]}>{tr.amount}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── INVOICE ──────────────────────────────────────────────────────────────────
export function InvoiceScreen({ navigation }) {
  const { t, isRTL, currentUser, colors: C, invoices } = useApp();
  if (!currentUser) return <GuestGate navigation={navigation} />;

  if (!invoices || invoices.length === 0) {
    return (
      <View style={[s.centerWrap, { backgroundColor: C.bg }]}>
        <Text style={s.gateIcon}>📄</Text>
        <Text style={[s.gateTitle, { color: C.text }, isRTL && s.rtlText]}>{t('noInvoicesYet')}</Text>
        <Text style={[s.gateSub, { color: C.textMuted }, isRTL && s.rtlText]}>{t('noInvoicesSub')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={{ padding: 14 }}>
      {invoices.map((inv, idx) => (
        <View key={idx} style={[s.invCard, { backgroundColor: C.bg2, borderColor: C.border, marginBottom: 14 }]}>
          <View style={[s.invTop, isRTL && s.rowRev]}>
            <View>
              <Text style={[s.invTitle, { color: C.text }, isRTL && s.rtlText]}>{inv.id}</Text>
              <Text style={[s.invSub, { color: C.textMuted }, isRTL && s.rtlText]}>{inv.date}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: 'rgba(52,211,153,0.15)' }]}>
              <Text style={[s.badgeText, { color: '#34d399' }]}>{isRTL ? 'مدفوعة' : 'PAID'}</Text>
            </View>
          </View>
          <Text style={[s.invBillLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{isRTL ? 'فاتورة إلى:' : 'Bill To:'}</Text>
          <Text style={[s.invBillTo, { color: C.textSub }, isRTL && s.rtlText]}>{currentUser.name}</Text>
          {inv.items?.map((item, i) => (
            <View key={i} style={[s.invRow, { borderBottomColor: C.border }, isRTL && s.rowRev]}>
              <Text style={[s.invK, { color: C.textMuted }]}>{item.name}</Text>
              <Text style={[s.invV, { color: C.textSub }]}>{item.amount}</Text>
            </View>
          ))}
          <View style={[s.invTotalRow, isRTL && s.rowRev]}>
            <Text style={[s.invTotalLabel, { color: C.text }]}>{t('total')}</Text>
            <Text style={[s.invTotalValue, { color: C.accent }]}>{inv.amount}</Text>
          </View>
          <TouchableOpacity>
            <LinearGradient colors={[C.primary, C.primary2]} style={s.confirmBtn}>
              <Text style={s.confirmBtnText}>{isRTL ? '📥 تحميل PDF' : '📥 Download PDF'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
export function SettingsScreen() {
  const { currentUser, logout, t, isRTL, toggleLanguage, language, colors: C, isDark, toggleDarkMode, currency, setCurrency, currencies, changePassword } = useApp();
  const [toggles, setToggles] = useState({ push: true, email: true, sms: false, twofa: false });
  const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const handleChangePw = () => {
    setPwError('');
    if (!oldPw || !newPw || !confirmPw) { setPwError(t('fillAllFields')); return; }
    if (newPw.length < 6) { setPwError(isRTL ? 'كلمة المرور 6 أحرف على الأقل' : 'Min 6 characters'); return; }
    if (newPw !== confirmPw) { setPwError(t('passwordsNotMatch')); return; }
    const result = changePassword(oldPw, newPw);
    if (result.success) { Alert.alert(t('passwordChanged')); setOldPw(''); setNewPw(''); setConfirmPw(''); setShowChangePw(false); }
    else setPwError(result.error);
  };

  const ToggleRow = ({ icon, label, value, onToggle, last }) => (
    <View style={[s.settingRow, { borderBottomColor: C.border, borderBottomWidth: last ? 0 : 1 }, isRTL && s.rowRev]}>
      <Text style={s.settingIcon}>{icon}</Text>
      <Text style={[s.settingLabel, { color: C.textSub }, isRTL && s.rtlText]}>{label}</Text>
      <TouchableOpacity style={[s.toggle, { backgroundColor: value ? C.primary : C.border }]} onPress={onToggle}>
        <View style={[s.toggleThumb, value && s.toggleThumbOn]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[s.container, { backgroundColor: C.bg }]} contentContainerStyle={{ padding: 14 }}>

      {currentUser && (
        <>
          <Text style={[s.groupLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('accountSection')}</Text>
          <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border }]}>
            <View style={[s.settingRow, { borderBottomColor: C.border }, isRTL && s.rowRev]}>
              <Text style={s.settingIcon}>👤</Text>
              <Text style={[s.settingLabel, { color: C.textSub }, isRTL && s.rtlText]}>{t('profile')}: <Text style={{ color: C.accent }}>{currentUser.username}</Text></Text>
            </View>
            <View style={[s.settingRow, { borderBottomWidth: 0 }, isRTL && s.rowRev]}>
              <Text style={s.settingIcon}>💰</Text>
              <Text style={[s.settingLabel, { color: C.textSub }, isRTL && s.rtlText]}>{t('balance')}</Text>
              <Text style={[s.settingRight, { color: C.accent }]}>${currentUser.wallet.toFixed(2)}</Text>
            </View>
          </View>
        </>
      )}

      <Text style={[s.groupLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('language')}</Text>
      <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <TouchableOpacity style={[s.settingRow, { borderBottomWidth: 0 }, isRTL && s.rowRev]} onPress={toggleLanguage}>
          <Text style={s.settingIcon}>🌐</Text>
          <View style={{ flex: 1, marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }}>
            <Text style={[s.settingLabel, { color: C.textSub, marginLeft: 0 }, isRTL && s.rtlText]}>{t('language')}</Text>
            <Text style={[{ fontSize: 10, color: C.textMuted }, isRTL && s.rtlText]}>{t('switchLanguage')}</Text>
          </View>
          <View style={[s.langBadge, { borderColor: 'rgba(124,58,237,0.3)', backgroundColor: 'rgba(124,58,237,0.1)' }]}>
            <Text style={[s.langBadgeText, { color: C.accent }]}>{language === 'ar' ? '🇸🇦 AR' : '🇺🇸 EN'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[s.groupLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('appearance')}</Text>
      <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <ToggleRow icon={isDark ? '🌙' : '☀️'} label={isDark ? t('darkMode') : t('lightMode')} value={isDark} onToggle={toggleDarkMode} />
        <TouchableOpacity style={[s.settingRow, { borderBottomWidth: 0 }, isRTL && s.rowRev]} onPress={() => setShowCurrencyModal(true)}>
          <Text style={s.settingIcon}>💱</Text>
          <Text style={[s.settingLabel, { color: C.textSub }, isRTL && s.rtlText]}>{t('currency')}</Text>
          <View style={[s.currencyPill, { backgroundColor: 'rgba(124,58,237,0.15)' }]}>
            <Text style={[s.currencyPillText, { color: C.accent }]}>{currency?.flag} {currency?.code}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[s.groupLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('notifications')}</Text>
      <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <ToggleRow icon="🔔" label={t('pushNotifications')} value={toggles.push} onToggle={() => toggle('push')} />
        <ToggleRow icon="📧" label={t('emailAlerts')} value={toggles.email} onToggle={() => toggle('email')} />
        <ToggleRow icon="📱" label={t('smsAlerts')} value={toggles.sms} onToggle={() => toggle('sms')} last />
      </View>

      <Text style={[s.groupLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('security')}</Text>
      <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border }]}>
        <ToggleRow icon="🔒" label={t('twoFactorAuth')} value={toggles.twofa} onToggle={() => toggle('twofa')} />
        {currentUser && (
          <TouchableOpacity style={[s.settingRow, { borderBottomWidth: 0 }, isRTL && s.rowRev]} onPress={() => setShowChangePw(!showChangePw)}>
            <Text style={s.settingIcon}>🔑</Text>
            <Text style={[s.settingLabel, { color: C.textSub }, isRTL && s.rtlText]}>{t('changePassword')}</Text>
            <Text style={[s.settingRight, { color: C.textMuted }]}>{showChangePw ? '▲' : (isRTL ? '‹' : '›')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {showChangePw && currentUser && (
        <View style={[s.settingGroup, { backgroundColor: C.bg2, borderColor: C.border, padding: 14, marginBottom: 4 }]}>
          {!!pwError && <View style={s.errorBox}><Text style={[s.errorText, isRTL && s.rtlText]}>{pwError}</Text></View>}
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('oldPassword')}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('oldPassword')} placeholderTextColor={C.textMuted} value={oldPw} onChangeText={setOldPw} secureTextEntry />
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('newPassword')}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text }, isRTL && { textAlign: 'right' }]} placeholder={t('newPassword')} placeholderTextColor={C.textMuted} value={newPw} onChangeText={setNewPw} secureTextEntry />
          <Text style={[s.inputLabel, { color: C.textMuted }, isRTL && s.rtlText]}>{t('confirmNewPassword')}</Text>
          <TextInput style={[s.textInput, { backgroundColor: C.bg3, borderColor: C.border, color: C.text, marginBottom: 12 }, isRTL && { textAlign: 'right' }]} placeholder={t('confirmNewPassword')} placeholderTextColor={C.textMuted} value={confirmPw} onChangeText={setConfirmPw} secureTextEntry />
          <TouchableOpacity onPress={handleChangePw}>
            <LinearGradient colors={[C.primary, C.primary2]} style={s.confirmBtn}><Text style={s.confirmBtnText}>{t('save')}</Text></LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {currentUser && (
        <TouchableOpacity onPress={() => { logout(); Alert.alert(t('loggedOut')); }}>
          <View style={[s.settingGroup, { marginTop: 8, backgroundColor: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.2)' }]}>
            <View style={[s.settingRow, { borderBottomWidth: 0 }, isRTL && s.rowRev]}>
              <Text style={s.settingIcon}>🚪</Text>
              <Text style={[s.settingLabel, { color: '#f87171' }, isRTL && s.rtlText]}>{t('logout')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
      <View style={{ height: 16 }} />

      <Modal visible={showCurrencyModal} transparent animationType="slide" onRequestClose={() => setShowCurrencyModal(false)}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={() => setShowCurrencyModal(false)}>
          <TouchableOpacity activeOpacity={1} style={[s.modalBox, { backgroundColor: C.bg2 }]}>
            <View style={[s.modalHandle, { backgroundColor: C.border }]} />
            <Text style={[s.modalTitle, { color: C.text }, isRTL && s.rtlText]}>{t('selectCurrency')}</Text>
            <FlatList
              data={currencies}
              keyExtractor={item => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.currencyRow, { borderBottomColor: C.border }, currency?.code === item.code && { backgroundColor: 'rgba(124,58,237,0.08)' }, isRTL && s.rowRev]}
                  onPress={() => { setCurrency(item); setShowCurrencyModal(false); }}
                >
                  <Text style={s.currencyFlag}>{item.flag}</Text>
                  <View style={{ flex: 1, marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                    <Text style={[s.currencyName, { color: C.text }, isRTL && s.rtlText]}>{isRTL ? item.nameAr : item.name}</Text>
                    <Text style={[s.currencyCode, { color: C.textMuted }]}>{item.code} · {item.symbol}</Text>
                  </View>
                  {currency?.code === item.code && <Text style={{ color: C.accent, fontSize: 18, fontWeight: '800' }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1 },
  rtlText: { textAlign: 'right' },
  rowRev: { flexDirection: 'row-reverse' },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  gateIcon: { fontSize: 62, marginBottom: 16 },
  gateTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  gateSub: { fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  fullWidth: { width: '100%' },
  actionBtn: { borderRadius: 14, padding: 15, alignItems: 'center' },
  actionBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  authContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  authCard: { borderRadius: 22, padding: 22, borderWidth: 1 },
  authIcon: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  authTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  authSub: { fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  authBtn: { borderRadius: 13, padding: 15, alignItems: 'center', marginTop: 4, marginBottom: 12 },
  authBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  forgotLink: { alignSelf: 'flex-end', marginBottom: 10 },
  forgotLinkText: { fontSize: 12, fontWeight: '600' },
  backLink: { alignItems: 'center', marginTop: 12 },
  backLinkText: { fontSize: 13, fontWeight: '700' },
  switchLink: { alignItems: 'center' },
  switchText: { fontSize: 12 },
  demoBox: { borderWidth: 1, borderRadius: 10, padding: 11, marginBottom: 14, backgroundColor: 'rgba(124,58,237,0.08)' },
  demoText: { fontSize: 11, lineHeight: 18 },
  errorBox: { backgroundColor: 'rgba(248,113,113,0.15)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', borderRadius: 8, padding: 9, marginBottom: 12 },
  errorText: { fontSize: 11, color: '#f87171' },
  inputLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 },
  textInput: { borderWidth: 1, borderRadius: 11, padding: 13, fontSize: 14, marginBottom: 12 },
  confirmBtn: { borderRadius: 13, padding: 14, alignItems: 'center', marginTop: 4 },
  confirmBtnText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  langToggleBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(124,58,237,0.08)', borderRadius: 11, padding: 11, marginBottom: 12, marginTop: 4, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)' },
  langBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1 },
  langBadgeText: { fontSize: 11, fontWeight: '800' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20, marginTop: 8 },
  otpBox: { width: 46, height: 56, borderRadius: 13, borderWidth: 2, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  profileCard: { margin: 14, borderRadius: 20, padding: 20, overflow: 'hidden' },
  profileCardRow: { flexDirection: 'row', alignItems: 'center' },
  profileAvatarLg: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  profileAvatarLgText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileCardInfo: { flex: 1, marginLeft: 14 },
  profileCardName: { fontSize: 18, fontWeight: '900', color: '#fff', marginBottom: 2 },
  profileCardEmail: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  profileCardBal: { flexDirection: 'row', alignItems: 'center' },
  profileCardBalLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  profileCardBalValue: { fontSize: 17, fontWeight: '900', color: '#fbbf24' },
  walBubble: { position: 'absolute', borderRadius: 9999, backgroundColor: 'rgba(255,255,255,0.06)' },
  menuItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginHorizontal: 14, marginBottom: 8, borderWidth: 1, gap: 12 },
  menuIcon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 14, fontWeight: '700' },
  menuSub: { fontSize: 11, marginTop: 1 },
  menuArrow: { fontSize: 22 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(248,113,113,0.08)', borderRadius: 14, padding: 14, marginHorizontal: 14, marginTop: 4, borderWidth: 1, borderColor: 'rgba(248,113,113,0.2)', gap: 10 },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#f87171' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 8 },
  statCard: { borderRadius: 14, padding: 14, borderWidth: 1, flex: 1, minWidth: '45%' },
  statLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '900' },
  orderItem: { borderRadius: 14, padding: 13, marginHorizontal: 14, marginBottom: 8, borderWidth: 1 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { fontSize: 11, fontWeight: '700' },
  orderName: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  orderBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  orderCustomer: { fontSize: 10.5 },
  orderAmount: { fontSize: 13, fontWeight: '900' },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  badgeText: { fontSize: 9.5, fontWeight: '700' },
  walletCard: { margin: 14, borderRadius: 22, padding: 24, overflow: 'hidden' },
  walLabel: { fontSize: 9, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  walBalance: { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  walUser: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, marginBottom: 8 },
  tabsRow: { flexDirection: 'row', marginHorizontal: 14, marginBottom: 14, borderRadius: 14, borderWidth: 1, overflow: 'hidden', padding: 4, gap: 4 },
  tabBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabBtnText: { fontSize: 11, fontWeight: '700' },
  actionBox: { margin: 14, marginTop: 0, borderRadius: 14, padding: 16, borderWidth: 1 },
  actionBoxTitle: { fontSize: 15, fontWeight: '800', marginBottom: 14 },
  quickAmounts: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  quickAmt: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  quickAmtText: { fontSize: 12, fontWeight: '700' },
  balanceHint: { flexDirection: 'row', marginBottom: 12 },
  balanceHintText: { fontSize: 11 },
  transItem: { flexDirection: 'row', alignItems: 'center', borderRadius: 13, padding: 12, marginBottom: 8, borderWidth: 1, gap: 10 },
  transIcon: { width: 42, height: 42, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  transInfo: { flex: 1 },
  transName: { fontSize: 13, fontWeight: '600' },
  transDate: { fontSize: 10, marginTop: 1 },
  transAmount: { fontSize: 13.5, fontWeight: '800' },
  invCard: { borderRadius: 15, padding: 17, borderWidth: 1 },
  invTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  invTitle: { fontSize: 14, fontWeight: '800' },
  invSub: { fontSize: 10, marginTop: 2 },
  invBillLabel: { fontSize: 10, marginTop: 10 },
  invBillTo: { fontSize: 13, fontWeight: '700', marginBottom: 10 },
  invRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1 },
  invK: { fontSize: 12 },
  invV: { fontSize: 12, fontWeight: '700' },
  invTotalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, marginBottom: 12 },
  invTotalLabel: { fontSize: 14, fontWeight: '800' },
  invTotalValue: { fontSize: 16, fontWeight: '900' },
  groupLabel: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.8, paddingLeft: 4, paddingTop: 10, paddingBottom: 6 },
  settingGroup: { borderRadius: 14, overflow: 'hidden', borderWidth: 1, marginBottom: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1 },
  settingIcon: { fontSize: 16, width: 26 },
  settingLabel: { flex: 1, fontSize: 13, marginLeft: 8 },
  settingRight: { fontSize: 12 },
  toggle: { width: 44, height: 25, borderRadius: 13 },
  toggleThumb: { width: 19, height: 19, borderRadius: 10, backgroundColor: '#fff', position: 'absolute', top: 3, left: 3 },
  toggleThumbOn: { transform: [{ translateX: 19 }] },
  currencyPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  currencyPillText: { fontSize: 12, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox: { borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: 20, paddingBottom: 36, maxHeight: '75%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '800', marginBottom: 16 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  currencyFlag: { fontSize: 26 },
  currencyName: { fontSize: 14, fontWeight: '600' },
  currencyCode: { fontSize: 11, marginTop: 1 },
});