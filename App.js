import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useApp } from './src/context/AppContext';

import SplashScreen        from './src/screens/SplashScreen';
import HomeScreen          from './src/screens/HomeScreen';
import ProductsScreen      from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen          from './src/screens/CartScreen';
import {
  OrdersScreen, WalletScreen, AccountScreen,
  TransactionsScreen, InvoiceScreen, SettingsScreen,
} from './src/screens/OtherScreens';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_CONFIG = {
  Home:     { active: 'home',            inactive: 'home-outline' },
  Products: { active: 'grid',            inactive: 'grid-outline' },
  Orders:   { active: 'receipt',         inactive: 'receipt-outline' },
  Wallet:   { active: 'wallet',          inactive: 'wallet-outline' },
  Cart:     { active: 'cart',            inactive: 'cart-outline' },
  Account:  { active: 'person-circle',   inactive: 'person-circle-outline' },
};

// ─── Logo Component ───────────────────────────────────────────────────────────
function MezLogo({ size = 32 }) {
  return (
    <LinearGradient
      colors={['#a855f7', '#7c3aed', '#5b21b6']}
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
      }}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
    >
      <Text style={{
        fontSize: size * 0.52, fontWeight: '900', color: '#fff',
        letterSpacing: -1, includeFontPadding: false,
      }}>M</Text>
    </LinearGradient>
  );
}

// ─── Custom Header Title ──────────────────────────────────────────────────────
function HeaderTitle({ title }) {
  const { isRTL, colors: C } = useApp();
  return (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center', gap: 9,
    }}>
      {!isRTL && (
        <Text style={{
          fontSize: 18, fontWeight: '900', color: C.text,
          letterSpacing: -0.5,
        }}>
          {title}
        </Text>
      )}
      <MezLogo size={32} />
      {isRTL && (
        <Text style={{
          fontSize: 18, fontWeight: '900', color: C.text,
          letterSpacing: -0.5,
        }}>
          {title}
        </Text>
      )}
    </View>
  );
}

// ─── Stack Options ────────────────────────────────────────────────────────────
function useStackOpts() {
  const { colors: C } = useApp();
  return {
    headerStyle: {
      backgroundColor: C.bg,
      borderBottomColor: C.border,
      borderBottomWidth: 1,
      elevation: 0, shadowOpacity: 0,
    },
    headerTintColor: C.accent,
    headerTitleStyle: { color: C.text, fontWeight: '800', fontSize: 16 },
    headerTitleAlign: 'center',
    cardStyle: { backgroundColor: C.bg },
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
}

// ─── Stacks ───────────────────────────────────────────────────────────────────
function HomeStack() {
  const opts = useStackOpts();
  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="Home" component={HomeScreen}
        options={{ headerTitle: () => <HeaderTitle title="Mez-Cards" /> }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params.product.name })} />
    </Stack.Navigator>
  );
}

function ProductsStack() {
  const { t } = useApp();
  const opts = useStackOpts();
  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="Products" component={ProductsScreen}
        options={{ headerTitle: () => <HeaderTitle title={t('products')} /> }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen}
        options={({ route }) => ({ title: route.params.product.name })} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  const { t } = useApp();
  const opts = useStackOpts();
  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="AccountMain" component={AccountScreen}
        options={{ headerTitle: () => <HeaderTitle title={t('myAccount')} /> }} />
      <Stack.Screen name="Transactions" component={TransactionsScreen}
        options={{ title: t('transactions') }} />
      <Stack.Screen name="Invoice" component={InvoiceScreen}
        options={{ title: t('invoice') }} />
      <Stack.Screen name="Settings" component={SettingsScreen}
        options={{ title: t('settings') }} />
    </Stack.Navigator>
  );
}

function CartStack() {
  const { t } = useApp();
  const opts = useStackOpts();
  return (
    <Stack.Navigator screenOptions={opts}>
      <Stack.Screen name="Cart" component={CartScreen}
        options={{ headerTitle: () => <HeaderTitle title={t('myCart')} /> }} />
    </Stack.Navigator>
  );
}

// ─── Animated Tab Icon ────────────────────────────────────────────────────────
function AnimatedTabIcon({ routeName, focused, cartCount, color }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.2, useNativeDriver: true, tension: 150, friction: 7 }),
        Animated.spring(translateY, { toValue: -2, useNativeDriver: true, tension: 150, friction: 7 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 150, friction: 7 }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 150, friction: 7 }),
      ]).start();
    }
  }, [focused]);

  const iconName = focused
    ? TAB_CONFIG[routeName]?.active
    : TAB_CONFIG[routeName]?.inactive;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
        {focused && (
          <View style={[styles.tabActiveGlow, { backgroundColor: color + '22' }]} />
        )}
        <Ionicons name={iconName || 'ellipse-outline'} size={24} color={color} />
      </Animated.View>
      {routeName === 'Cart' && cartCount > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Tabs ────────────────────────────────────────────────────────────────
function MainTabs() {
  const { cartCount, t, isRTL, colors: C } = useApp();
  const insets = useSafeAreaInsets();

  const tabLabels = {
    Home:     t('home'),
    Products: t('products'),
    Orders:   t('orders'),
    Wallet:   t('wallet'),
    Cart:     t('cart'),
    Account:  t('account'),
  };

  const tabBarStyle = {
    backgroundColor: C.bg2,
    borderTopColor: C.border,
    borderTopWidth: 1,
    height: 62 + insets.bottom,
    paddingBottom: insets.bottom + 6,
    paddingTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  };

  const commonScreenOptions = ({ route }) => ({
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: '#fbbf24',
    tabBarInactiveTintColor: C.textMuted,
    tabBarLabelStyle: styles.tabLabel,
    tabBarLabel: tabLabels[route.name] || route.name,
    tabBarIcon: ({ focused, color }) => (
      <AnimatedTabIcon
        routeName={route.name}
        focused={focused}
        cartCount={cartCount}
        color={color}
      />
    ),
  });

  const makeHeaderOpts = (titleKey) => ({
    headerShown: true,
    headerStyle: {
      backgroundColor: C.bg, elevation: 0, shadowOpacity: 0,
      borderBottomColor: C.border, borderBottomWidth: 1,
    },
    headerTintColor: C.text,
    headerTitleStyle: { fontWeight: '800' },
    headerTitleAlign: 'center',
    headerTitle: () => <HeaderTitle title={t(titleKey)} />,
  });

  if (isRTL) {
    return (
      <Tab.Navigator initialRouteName="Home" screenOptions={commonScreenOptions}>
        <Tab.Screen name="Account"  component={AccountStack} />
        <Tab.Screen name="Cart"     component={CartStack} />
        <Tab.Screen name="Wallet"   component={WalletScreen}  options={makeHeaderOpts('wallet')} />
        <Tab.Screen name="Orders"   component={OrdersScreen}  options={makeHeaderOpts('orders')} />
        <Tab.Screen name="Products" component={ProductsStack} />
        <Tab.Screen name="Home"     component={HomeStack} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={commonScreenOptions}>
      <Tab.Screen name="Home"     component={HomeStack} />
      <Tab.Screen name="Products" component={ProductsStack} />
      <Tab.Screen name="Orders"   component={OrdersScreen}  options={makeHeaderOpts('orders')} />
      <Tab.Screen name="Wallet"   component={WalletScreen}  options={makeHeaderOpts('wallet')} />
      <Tab.Screen name="Cart"     component={CartStack} />
      <Tab.Screen name="Account"  component={AccountStack} />
    </Tab.Navigator>
  );
}

// ─── App Content ──────────────────────────────────────────────────────────────
function AppContent() {
  const [splashDone, setSplashDone] = useState(false);
  const { isDark, colors: C } = useApp();
  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  if (!splashDone) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={C.bg} />
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabLabel: { fontSize: 9.5, fontWeight: '700', marginTop: 1 },
  tabActiveGlow: {
    position: 'absolute', width: 44, height: 44,
    borderRadius: 22, top: -10, left: -10,
  },
  cartBadge: {
    position: 'absolute', top: -6, right: -10,
    backgroundColor: '#ef4444', borderRadius: 9,
    minWidth: 17, height: 17, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#0e0c22', paddingHorizontal: 2,
  },
  cartBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff' },
});