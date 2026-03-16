import React, { createContext, useContext, useState } from 'react';
import { Share, Alert } from 'react-native';
import { DEMO_USERS, INITIAL_ORDERS, INITIAL_TRANSACTIONS, DARK_COLORS, LIGHT_COLORS, CURRENCIES } from '../data';

const AppContext = createContext();

const ADMIN_ID = 1;

// ─── Coupons ──────────────────────────────────────────────────────────────────
export const COUPONS = [
  { code: 'SAVE10',    type: 'percent', value: 10, minOrder: 10,  desc: { en: '10% off your order',     ar: '10% خصم على طلبك' } },
  { code: 'WELCOME20', type: 'percent', value: 20, minOrder: 20,  desc: { en: '20% off – Welcome!',      ar: 'خصم 20% – أهلاً بك' } },
  { code: 'FLAT5',     type: 'fixed',   value: 5,  minOrder: 15,  desc: { en: '$5 off any order',       ar: 'خصم $5 على أي طلب' } },
  { code: 'GAME30',    type: 'percent', value: 30, minOrder: 25,  desc: { en: '30% off gaming',         ar: '30% خصم على الألعاب' } },
  { code: 'MEZCARDS',  type: 'percent', value: 15, minOrder: 0,   desc: { en: '15% off everything',    ar: '15% خصم على كل شيء' } },
  { code: 'VIP50',     type: 'percent', value: 50, minOrder: 100, desc: { en: '50% VIP discount',      ar: '50% خصم VIP' } },
];

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_REVIEWS = {
  10: [{ id: 'r1', userId: 1, userName: 'Admin', rating: 5, text: 'Great product! Works perfectly with all my games.', date: '10 Mar', helpful: 3 }],
  30: [{ id: 'r2', userId: 1, userName: 'Admin', rating: 4, text: 'Excellent streaming quality. Highly recommended!', date: '8 Mar', helpful: 1 }],
};

const INITIAL_TICKETS = [
  {
    id: 'TKT-001', subject: 'How to top up wallet?', category: 'General',
    message: 'I want to know how to add funds to my wallet.',
    status: 'closed', createdAt: '10 Mar',
    replies: [
      { from: 'Support', message: 'You can top up from Wallet > Add Funds. Hope this helps!', date: '10 Mar' },
    ],
  },
];

const TICKET_CATEGORIES = ['General', 'Payment Issue', 'Order Issue', 'Account Problem', 'Technical Problem'];

// ─── Translations ─────────────────────────────────────────────────────────────
const TR = {
  ar: {
    home: 'الرئيسية', products: 'المنتجات', orders: 'الطلبات',
    wallet: 'المحفظة', cart: 'السلة', account: 'حسابي',
    categories: '🗂️ التصنيفات', seeAll: 'عرض الكل ›',
    searchPlaceholder: 'ابحث عن المنتجات...',
    noProducts: 'لا توجد منتجات', noProductsSub: 'جرب بحثاً أو تصنيفاً مختلفاً',
    clearFilter: 'مسح الفلتر ✕', buyNow: 'اشترِ الآن', from: 'من',
    selectPackage: 'اختر الباقة', addToCart: '🛒  أضف للسلة',
    addedToCart: '✓ أُضيف للسلة', continueShopping: 'مواصلة التسوق', viewCart: 'عرض السلة',
    myCart: '🛒 سلتي', cartEmpty: 'السلة فارغة',
    cartEmptySub: 'تصفح المنتجات وأضف عناصر لسلتك.',
    browseProducts: 'تصفح المنتجات', subtotal: 'المجموع',
    vat: 'ضريبة (10%)', total: 'الإجمالي',
    checkout: '✅  الدفع', insufficientBalance: '💰 رصيد غير كافٍ',
    walletBalance: 'رصيد المحفظة', addFunds: '+ إضافة رصيد',
    orderPlaced: '✅ تم تقديم الطلب!',
    orderConfirmed: 'تم تأكيد طلبك.\nسيتم تسليم الأكواد قريباً.',
    backToHome: 'العودة للرئيسية',
    signInRequired: 'يجب تسجيل الدخول', signInToPurchase: 'يرجى تسجيل الدخول لإتمام الشراء.',
    cancel: 'إلغاء', signIn: 'تسجيل الدخول', insufficientMsg: 'رصيدك غير كافٍ',
    totalOrders: 'إجمالي الطلبات', revenue: 'الإيرادات',
    completed: 'مكتمل', pending: 'معلق', failed: 'فاشل',
    recentOrders: '📋 الطلبات الأخيرة', noOrdersYet: 'لا توجد طلبات بعد',
    noOrdersSub: 'ستظهر طلباتك هنا بعد أول عملية شراء',
    availableBalance: 'الرصيد المتاح', accountLabel: 'الحساب',
    withdraw: 'سحب', transfer: 'تحويل',
    transferFunds: 'تحويل الرصيد', transferTo: 'تحويل إلى',
    transferPlaceholder: 'اسم المستخدم أو البريد أو الرقم',
    transferAmount: 'المبلغ', transferConfirm: 'تأكيد التحويل',
    transferSuccess: '✓ تم التحويل', userNotFound: 'المستخدم غير موجود',
    cannotTransferSelf: 'لا يمكن التحويل لنفسك',
    addFundsTitle: '💰 إضافة رصيد للمحفظة',
    amountUSD: 'المبلغ (دولار)', confirmTopup: 'تأكيد الإضافة',
    totalSpent: 'إجمالي الإنفاق', cashback: 'كاشباك',
    recentTransactions: '⚡ المعاملات الأخيرة',
    noTransactionsYet: 'لا توجد معاملات بعد', noTransactionsSub: 'ستظهر معاملاتك هنا',
    invalidAmount: 'مبلغ غير صالح', enterValidAmount: 'أدخل مبلغاً صالحاً.',
    successTopup: '✓ تمت الإضافة بنجاح!',
    guestUser: 'زائر', notSignedIn: 'غير مسجل الدخول',
    signOut: 'تسجيل الخروج', loggedOut: 'تم تسجيل الخروج',
    transactions: 'المعاملات', viewPayments: 'عرض سجل المدفوعات',
    invoice: 'الفاتورة', viewInvoices: 'عرض وتحميل الفواتير',
    settings: 'الإعدادات', appPreferences: 'تفضيلات التطبيق',
    signInToApp: 'تسجيل الدخول إلى Mez-Cards', createAccount: 'إنشاء حساب جديد',
    forgotPassword: 'نسيت كلمة المرور؟', resetPassword: 'إعادة تعيين كلمة المرور',
    forgotPasswordSub: 'أدخل بريدك أو اسم المستخدم', sendResetLink: 'إرسال كود التحقق',
    resetSent: '✓ تم الإرسال', resetSentSub: 'تحقق من بريدك الإلكتروني',
    backToLogin: 'العودة لتسجيل الدخول',
    demoText: 'تجريبي: admin / admin123 ($500)\nأو: user@test.com / user123',
    fullName: 'الاسم الكامل', username: 'اسم المستخدم',
    emailOrUsername: 'البريد أو اسم المستخدم', email: 'البريد الإلكتروني',
    password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
    fillAllFields: 'املأ جميع الحقول. كلمة المرور 6 أحرف على الأقل.',
    passwordsNotMatch: 'كلمات المرور غير متطابقة.',
    accountCreated: '✓ تم إنشاء الحساب', canSignIn: 'يمكنك تسجيل الدخول الآن!',
    haveAccount: 'لديك حساب؟ ', noAccount: 'ليس لديك حساب؟ ',
    signInLink: 'سجّل دخولك', signUpLink: 'أنشئ حساباً',
    welcomeBack: 'مرحباً بعودتك 👋', welcomeBackSub: 'سجّل دخولك للمتابعة',
    myAccount: 'حسابي',
    noInvoicesYet: 'لا توجد فواتير بعد', noInvoicesSub: 'ستظهر فواتيرك هنا بعد أول طلب',
    accountSection: 'الحساب', profile: 'الملف الشخصي', balance: 'الرصيد',
    appearance: 'المظهر', darkMode: 'الوضع الليلي', lightMode: 'الوضع النهاري',
    language: 'اللغة', currency: 'العملة', selectCurrency: 'اختر العملة',
    notifications: 'الإشعارات', pushNotifications: 'إشعارات الجوال',
    emailAlerts: 'تنبيهات البريد', smsAlerts: 'تنبيهات SMS',
    security: 'الأمان', twoFactorAuth: 'المصادقة الثنائية',
    changePassword: 'تغيير كلمة المرور', oldPassword: 'كلمة المرور القديمة',
    newPassword: 'كلمة المرور الجديدة', confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    passwordChanged: '✓ تم تغيير كلمة المرور', wrongOldPassword: 'كلمة المرور القديمة غير صحيحة',
    save: 'حفظ', logout: 'تسجيل الخروج',
    switchLanguage: 'Switch to English 🇺🇸',
    signInToView: 'سجّل الدخول لعرض هذه الصفحة',
    signInToViewSub: 'يجب تسجيل الدخول لعرض طلباتك ومعاملاتك',
    loginNow: 'تسجيل الدخول الآن',
    // ─ Coupon
    coupon: 'كوبون الخصم', enterCoupon: 'أدخل كود الخصم',
    applyCoupon: 'تطبيق', couponApplied: '✓ تم تطبيق الكوبون!',
    couponInvalid: 'كود غير صالح', couponMinOrder: 'الحد الأدنى للطلب غير مكتمل',
    couponDiscount: 'خصم الكوبون', removeCoupon: 'إزالة',
    availableCoupons: 'الكوبونات المتاحة',
    // ─ Loyalty
    loyaltyPoints: 'نقاط الولاء', myPoints: 'نقاطي', usePoints: 'استخدام النقاط',
    pointsBalance: 'رصيد النقاط', pointsHistory: 'سجل النقاط',
    pointsInfo: '100 نقطة = $1 رصيد', noPointsYet: 'لا توجد نقاط بعد',
    pointsEarned: 'نقاط مكتسبة', youEarned: 'اكتسبت', pointsFromOrder: 'نقطة من طلبك',
    pointsDiscount: 'خصم النقاط', redeemPoints: 'استبدال',
    pointsUsedInOrder: 'نقاط مستخدمة في الطلب',
    viewPoints: 'عرض النقاط والمكافآت',
    // ─ Reviews
    reviews: 'المراجعات', writeReview: 'كتابة مراجعة',
    yourReview: 'مراجعتك', submitReview: 'إرسال',
    noReviews: 'لا توجد مراجعات بعد', beFirstReview: 'كن أول من يقيّم',
    reviewAdded: '✓ تم إضافة مراجعتك', alreadyReviewed: 'لقد قيّمت هذا المنتج من قبل',
    signInToReview: 'سجّل الدخول لكتابة مراجعة',
    reviewPlaceholder: 'شارك تجربتك مع هذا المنتج...',
    helpful: 'مفيد', outOf5: 'من 5',
    // ─ Wishlist
    wishlist: 'المفضلة', myWishlist: 'مفضلتي',
    addedToWishlist: '❤️ أضيف للمفضلة', removedFromWishlist: 'أزيل من المفضلة',
    wishlistEmpty: 'المفضلة فارغة', wishlistEmptySub: 'أضف منتجاتك المفضلة لتجدها هنا',
    viewWishlist: 'عرض المفضلة',
    // ─ Referral
    referral: 'برنامج الإحالة', myReferrals: 'إحالاتي',
    referralCode: 'كود الإحالة', copyCode: 'نسخ',
    codeCopied: '✓ تم النسخ', referralEarnings: 'الأرباح',
    referralInfo: 'اكسب 50 نقطة عن كل صديق تدعوه للتسجيل',
    referredUsers: 'مستخدمون مُحالون', shareCode: 'مشاركة الكود',
    noReferrals: 'لم تُحل أي مستخدمين بعد', viewReferral: 'برنامج الإحالة',
    referralBonus: 'مكافأة الإحالة: 50 نقطة',
    enterReferralCode: 'أدخل كود الإحالة (اختياري)',
    // ─ Support
    support: 'الدعم الفني', createTicket: 'إنشاء تذكرة',
    myTickets: 'تذاكري', ticketSubject: 'الموضوع', ticketMessage: 'رسالتك',
    ticketCategory: 'الفئة', submitTicket: 'إرسال', ticketCreated: '✓ تم إنشاء التذكرة',
    noTickets: 'لا توجد تذاكر دعم',
    noTicketsSub: 'يمكنك إنشاء تذكرة للحصول على المساعدة',
    ticketOpen: 'مفتوح', ticketInProgress: 'جاري المعالجة', ticketClosed: 'مغلق',
    reply: 'رد', addReply: 'إضافة رد', replyPlaceholder: 'اكتب ردك...',
    adminReply: 'فريق الدعم', viewSupport: 'الدعم الفني',
    // ─ Payment Methods
    paymentMethods: 'طرق الدفع', addCard: 'إضافة بطاقة',
    savedCards: 'البطاقات المحفوظة', cardNumber: 'رقم البطاقة',
    cardHolder: 'اسم حامل البطاقة', expiryDate: 'تاريخ الانتهاء',
    cvv: 'رمز CVV', noPaymentMethods: 'لا توجد طرق دفع محفوظة',
    noPaymentMethodsSub: 'أضف بطاقة لتسريع عمليات الدفع',
    makeDefault: 'تعيين كافتراضي', cardAdded: '✓ تم إضافة البطاقة',
    payWith: 'الدفع بـ', removeCard: 'حذف البطاقة',
    viewPaymentMethods: 'إدارة طرق الدفع', isDefault: 'افتراضي',
    selectPaymentMethod: 'اختر طريقة الدفع',
    payByWallet: 'المحفظة الإلكترونية', payByCard: 'بطاقة بنكية',
  },
  en: {
    home: 'Home', products: 'Products', orders: 'Orders',
    wallet: 'Wallet', cart: 'Cart', account: 'Account',
    categories: '🗂️ Categories', seeAll: 'See all ›',
    searchPlaceholder: 'Search products...',
    noProducts: 'No products found', noProductsSub: 'Try a different search or category',
    clearFilter: 'Clear filter ✕', buyNow: 'Buy Now', from: 'from',
    selectPackage: 'SELECT PACKAGE', addToCart: '🛒  Add to Cart',
    addedToCart: '✓ Added to Cart', continueShopping: 'Continue Shopping', viewCart: 'View Cart',
    myCart: '🛒 My Cart', cartEmpty: 'Cart is Empty',
    cartEmptySub: 'Browse products and add items to your cart.',
    browseProducts: 'Browse Products', subtotal: 'Subtotal',
    vat: 'VAT (10%)', total: 'Total',
    checkout: '✅  Checkout', insufficientBalance: '💰 Insufficient Balance',
    walletBalance: 'Wallet Balance', addFunds: '+ Add Funds',
    orderPlaced: '✅ Order Placed!',
    orderConfirmed: 'Your order has been confirmed.\nCodes will be delivered shortly.',
    backToHome: 'Back to Home',
    signInRequired: 'Sign In Required', signInToPurchase: 'Please sign in to complete your purchase.',
    cancel: 'Cancel', signIn: 'Sign In', insufficientMsg: 'Insufficient Balance',
    totalOrders: 'Total Orders', revenue: 'Revenue',
    completed: 'Completed', pending: 'Pending', failed: 'Failed',
    recentOrders: '📋 Recent Orders', noOrdersYet: 'No orders yet',
    noOrdersSub: 'Your orders will appear here after your first purchase',
    availableBalance: 'Available Balance', accountLabel: 'Account',
    withdraw: 'Withdraw', transfer: 'Transfer',
    transferFunds: 'Transfer Funds', transferTo: 'Transfer to',
    transferPlaceholder: 'Username, email or user ID',
    transferAmount: 'Amount', transferConfirm: 'Confirm Transfer',
    transferSuccess: '✓ Transfer Successful', userNotFound: 'User not found',
    cannotTransferSelf: 'Cannot transfer to yourself',
    addFundsTitle: '💰 Add Funds to Wallet',
    amountUSD: 'Amount (USD)', confirmTopup: 'Confirm Top-up',
    totalSpent: 'Total Spent', cashback: 'Cashback',
    recentTransactions: '⚡ Recent Transactions',
    noTransactionsYet: 'No transactions yet', noTransactionsSub: 'Your transactions will appear here',
    invalidAmount: 'Invalid Amount', enterValidAmount: 'Please enter a valid amount.',
    successTopup: '✓ Funds added successfully!',
    guestUser: 'Guest User', notSignedIn: 'Not signed in',
    signOut: 'Sign Out', loggedOut: 'Logged out successfully',
    transactions: 'Transactions', viewPayments: 'View payment history',
    invoice: 'Invoice', viewInvoices: 'View and download invoices',
    settings: 'Settings', appPreferences: 'App preferences & account',
    signInToApp: 'Sign In to Mez-Cards', createAccount: 'Create New Account',
    forgotPassword: 'Forgot Password?', resetPassword: 'Reset Password',
    forgotPasswordSub: 'Enter your email or username', sendResetLink: 'Send Verification Code',
    resetSent: '✓ Sent!', resetSentSub: 'Check your email inbox',
    backToLogin: 'Back to Login',
    demoText: 'Demo: admin / admin123 ($500)\nOr: user@test.com / user123',
    fullName: 'Full Name', username: 'Username',
    emailOrUsername: 'Email or Username', email: 'Email Address',
    password: 'Password', confirmPassword: 'Confirm Password',
    fillAllFields: 'Fill all fields. Password min 6 chars.',
    passwordsNotMatch: 'Passwords do not match.',
    accountCreated: '✓ Account Created', canSignIn: 'You can now sign in!',
    haveAccount: 'Already have an account? ', noAccount: "Don't have an account? ",
    signInLink: 'Sign In', signUpLink: 'Sign Up',
    welcomeBack: 'Welcome Back 👋', welcomeBackSub: 'Sign in to continue',
    myAccount: 'My Account',
    noInvoicesYet: 'No invoices yet', noInvoicesSub: 'Invoices appear here after orders',
    accountSection: 'ACCOUNT', profile: 'Profile', balance: 'Balance',
    appearance: 'APPEARANCE', darkMode: 'Dark Mode', lightMode: 'Light Mode',
    language: 'Language', currency: 'Currency', selectCurrency: 'Select Currency',
    notifications: 'NOTIFICATIONS', pushNotifications: 'Push Notifications',
    emailAlerts: 'Email Alerts', smsAlerts: 'SMS Alerts',
    security: 'SECURITY', twoFactorAuth: 'Two-Factor Auth',
    changePassword: 'Change Password', oldPassword: 'Current Password',
    newPassword: 'New Password', confirmNewPassword: 'Confirm New Password',
    passwordChanged: '✓ Password changed', wrongOldPassword: 'Incorrect current password',
    save: 'Save', logout: 'Logout',
    switchLanguage: 'التبديل للعربية 🇸🇦',
    signInToView: 'Sign In to View This Page',
    signInToViewSub: 'You must be signed in to view your orders and transactions',
    loginNow: 'Login Now',
    // ─ Coupon
    coupon: 'Discount Coupon', enterCoupon: 'Enter coupon code',
    applyCoupon: 'Apply', couponApplied: '✓ Coupon applied!',
    couponInvalid: 'Invalid coupon code', couponMinOrder: 'Minimum order not reached',
    couponDiscount: 'Coupon discount', removeCoupon: 'Remove',
    availableCoupons: 'Available Coupons',
    // ─ Loyalty
    loyaltyPoints: 'Loyalty Points', myPoints: 'My Points', usePoints: 'Use Points',
    pointsBalance: 'Points Balance', pointsHistory: 'Points History',
    pointsInfo: '100 points = $1 credit', noPointsYet: 'No points yet',
    pointsEarned: 'Points earned', youEarned: 'You earned', pointsFromOrder: 'points from your order',
    pointsDiscount: 'Points discount', redeemPoints: 'Redeem',
    pointsUsedInOrder: 'Points used in this order',
    viewPoints: 'View Points & Rewards',
    // ─ Reviews
    reviews: 'Reviews', writeReview: 'Write a Review',
    yourReview: 'Your review', submitReview: 'Submit',
    noReviews: 'No reviews yet', beFirstReview: 'Be the first to review',
    reviewAdded: '✓ Review added!', alreadyReviewed: 'You already reviewed this product',
    signInToReview: 'Sign in to write a review',
    reviewPlaceholder: 'Share your experience with this product...',
    helpful: 'Helpful', outOf5: 'out of 5',
    // ─ Wishlist
    wishlist: 'Wishlist', myWishlist: 'My Wishlist',
    addedToWishlist: '❤️ Added to wishlist', removedFromWishlist: 'Removed from wishlist',
    wishlistEmpty: 'Wishlist is Empty', wishlistEmptySub: 'Add your favorite products to find them here',
    viewWishlist: 'View Wishlist',
    // ─ Referral
    referral: 'Referral Program', myReferrals: 'My Referrals',
    referralCode: 'Referral Code', copyCode: 'Copy',
    codeCopied: '✓ Copied!', referralEarnings: 'Earnings',
    referralInfo: 'Earn 50 points for every friend you invite',
    referredUsers: 'Referred Users', shareCode: 'Share Code',
    noReferrals: 'No referrals yet', viewReferral: 'Referral Program',
    referralBonus: 'Referral Bonus: 50 points',
    enterReferralCode: 'Enter referral code (optional)',
    // ─ Support
    support: 'Support', createTicket: 'Create Ticket',
    myTickets: 'My Tickets', ticketSubject: 'Subject', ticketMessage: 'Your message',
    ticketCategory: 'Category', submitTicket: 'Submit Ticket', ticketCreated: '✓ Ticket created!',
    noTickets: 'No support tickets', noTicketsSub: 'Create a ticket if you need help',
    ticketOpen: 'Open', ticketInProgress: 'In Progress', ticketClosed: 'Closed',
    reply: 'Reply', addReply: 'Add Reply', replyPlaceholder: 'Write your reply...',
    adminReply: 'Support Team', viewSupport: 'Support',
    // ─ Payment Methods
    paymentMethods: 'Payment Methods', addCard: 'Add Card',
    savedCards: 'Saved Cards', cardNumber: 'Card Number',
    cardHolder: 'Card Holder Name', expiryDate: 'Expiry Date',
    cvv: 'CVV Code', noPaymentMethods: 'No saved payment methods',
    noPaymentMethodsSub: 'Add a card to speed up checkout',
    makeDefault: 'Set as Default', cardAdded: '✓ Card added successfully',
    payWith: 'Pay with', removeCard: 'Remove Card',
    viewPaymentMethods: 'Manage Payment Methods', isDefault: 'Default',
    selectPaymentMethod: 'Select Payment Method',
    payByWallet: 'Wallet', payByCard: 'Credit / Debit Card',
  },
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [language, setLanguage] = useState('ar');
  const [isDark, setIsDark] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [pendingOTP, setPendingOTP] = useState(null);

  // Per-user data
  const [userOrders, setUserOrders] = useState({ [ADMIN_ID]: INITIAL_ORDERS });
  const [userTransactions, setUserTransactions] = useState({ [ADMIN_ID]: INITIAL_TRANSACTIONS });
  const [userInvoices, setUserInvoices] = useState({ [ADMIN_ID]: [
    { id: '#INV-2024-0001', date: '15 Mar', amount: '$59.99', status: 'paid', items: [{ name: 'PlayStation Plus 1Y', amount: '$59.99' }] },
  ]});

  // New features state
  const [userWishlists, setUserWishlists] = useState({ [ADMIN_ID]: [] });
  const [userPoints, setUserPoints] = useState({
    [ADMIN_ID]: {
      balance: 1254,
      history: [
        { id: 'ph1', type: 'earn', amount: 599, description: { en: 'Order #ORD-4821', ar: 'طلب #ORD-4821' }, date: '15 Mar' },
        { id: 'ph2', type: 'earn', amount: 500, description: { en: 'Order #ORD-3917', ar: 'طلب #ORD-3917' }, date: '12 Mar' },
        { id: 'ph3', type: 'earn', amount: 155, description: { en: 'Order #ORD-2743', ar: 'طلب #ORD-2743' }, date: '10 Mar' },
        { id: 'ph4', type: 'bonus', amount: 0, description: { en: 'Welcome bonus', ar: 'مكافأة الترحيب' }, date: '1 Mar' },
      ],
    },
  });
  const [userTickets, setUserTickets] = useState({ [ADMIN_ID]: INITIAL_TICKETS });
  const [userPaymentMethods, setUserPaymentMethods] = useState({
    [ADMIN_ID]: [
      { id: 'pm1', type: 'card', brand: 'visa', last4: '4242', holder: 'Admin', expiry: '12/27', isDefault: true },
    ],
  });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [userReferrals, setUserReferrals] = useState({
    [ADMIN_ID]: { code: 'ADMIN1234', referred: [], totalEarnings: 0 },
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const t = (key) => TR[language]?.[key] || TR['en']?.[key] || key;
  const isRTL = language === 'ar';
  const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  const toggleDarkMode = () => setIsDark(prev => !prev);
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const now = () => {
    const months_ar = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const months_en = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const d = new Date();
    return language === 'ar'
      ? `${d.getDate()} ${months_ar[d.getMonth()]}`
      : `${months_en[d.getMonth()]} ${d.getDate()}`;
  };

  // Derived per-user data
  const orders = currentUser ? (userOrders[currentUser.id] || []) : [];
  const transactions = currentUser ? (userTransactions[currentUser.id] || []) : [];
  const invoices = currentUser ? (userInvoices[currentUser.id] || []) : [];
  const wishlist = currentUser ? (userWishlists[currentUser.id] || []) : [];
  const pointsData = currentUser ? (userPoints[currentUser.id] || { balance: 0, history: [] }) : { balance: 0, history: [] };
  const tickets = currentUser ? (userTickets[currentUser.id] || []) : [];
  const paymentMethods = currentUser ? (userPaymentMethods[currentUser.id] || []) : [];
  const referralData = currentUser ? (userReferrals[currentUser.id] || { code: '', referred: [], totalEarnings: 0 }) : null;

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = (emailOrUser, password) => {
    const user = users.find(u => (u.email === emailOrUser || u.username === emailOrUser) && u.password === password);
    if (user) { setCurrentUser({ ...user }); return { success: true }; }
    return { success: false, error: isRTL ? 'بيانات الدخول غير صحيحة.' : 'Invalid credentials.' };
  };

  const generateReferralCode = (username) =>
    (username.toUpperCase().slice(0, 4) + Math.floor(1000 + Math.random() * 9000));

  const register = (name, username, email, password, referralCode) => {
    const exists = users.find(u => u.email === email || u.username === username);
    if (exists) return { success: false, error: isRTL ? 'البريد أو اسم المستخدم موجود مسبقاً.' : 'Email or username already exists.' };
    const newUser = { id: users.length + 100, name, username, email, password, wallet: 0, avatar: name.substring(0, 2).toUpperCase(), spent: 0 };
    const newCode = generateReferralCode(username);

    setUsers(prev => [...prev, newUser]);
    setUserOrders(prev => ({ ...prev, [newUser.id]: [] }));
    setUserTransactions(prev => ({ ...prev, [newUser.id]: [] }));
    setUserInvoices(prev => ({ ...prev, [newUser.id]: [] }));
    setUserWishlists(prev => ({ ...prev, [newUser.id]: [] }));
    setUserPoints(prev => ({ ...prev, [newUser.id]: { balance: 0, history: [] } }));
    setUserTickets(prev => ({ ...prev, [newUser.id]: [] }));
    setUserPaymentMethods(prev => ({ ...prev, [newUser.id]: [] }));
    setUserReferrals(prev => ({ ...prev, [newUser.id]: { code: newCode, referred: [], totalEarnings: 0 } }));

    // Handle referral code
    if (referralCode?.trim()) {
      const referrer = Object.entries(userReferrals).find(([, v]) => v.code === referralCode.trim().toUpperCase());
      if (referrer) {
        const referrerId = parseInt(referrer[0]);
        setUserReferrals(prev => ({
          ...prev,
          [referrerId]: {
            ...prev[referrerId],
            referred: [...(prev[referrerId]?.referred || []), { userId: newUser.id, name, date: now(), earned: 50 }],
            totalEarnings: (prev[referrerId]?.totalEarnings || 0) + 50,
          },
        }));
        // Award 50 points to referrer
        setUserPoints(prev => ({
          ...prev,
          [referrerId]: {
            balance: (prev[referrerId]?.balance || 0) + 50,
            history: [
              { id: `ref-${Date.now()}`, type: 'bonus', amount: 50, description: { en: `Referral bonus: ${name}`, ar: `مكافأة إحالة: ${name}` }, date: now() },
              ...(prev[referrerId]?.history || []),
            ],
          },
        }));
      }
    }

    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  const changePassword = (oldPass, newPass) => {
    if (!currentUser) return { success: false };
    if (currentUser.password !== oldPass) return { success: false, error: t('wrongOldPassword') };
    const updated = { ...currentUser, password: newPass };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPass } : u));
    return { success: true };
  };

  const requestPasswordReset = (emailOrUsername) => {
    const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername);
    if (!user) return { success: false, error: isRTL ? 'البريد أو اسم المستخدم غير موجود.' : 'Email or username not found.' };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPendingOTP({ email: user.email, userId: user.id, code, expiresAt: Date.now() + 10 * 60 * 1000 });
    return { success: true, email: user.email, code };
  };

  const verifyOTPAndReset = (inputCode, newPassword) => {
    if (!pendingOTP) return { success: false, error: isRTL ? 'انتهت الجلسة.' : 'Session expired.' };
    if (Date.now() > pendingOTP.expiresAt) { setPendingOTP(null); return { success: false, error: isRTL ? 'انتهت صلاحية الكود.' : 'Code expired.' }; }
    if (inputCode.trim() !== pendingOTP.code) return { success: false, error: isRTL ? 'الكود غير صحيح.' : 'Incorrect code.' };
    if (newPassword) {
      setUsers(prev => prev.map(u => u.id === pendingOTP.userId ? { ...u, password: newPassword } : u));
      setPendingOTP(null);
    }
    return { success: true };
  };

  // ─── Coupon ───────────────────────────────────────────────────────────────
  const validateCoupon = (code, subtotal) => {
    const coupon = COUPONS.find(c => c.code === code.toUpperCase().trim());
    if (!coupon) return { valid: false, error: t('couponInvalid') };
    if (subtotal < coupon.minOrder) return { valid: false, error: `${t('couponMinOrder')} ($${coupon.minOrder})` };
    const discount = coupon.type === 'percent'
      ? (subtotal * coupon.value) / 100
      : coupon.value;
    return { valid: true, discount: Math.min(discount, subtotal), coupon, description: coupon.desc[language] };
  };

  // ─── Wishlist ─────────────────────────────────────────────────────────────
  const toggleWishlist = (productId) => {
    if (!currentUser) return false;
    const uid = currentUser.id;
    const current = userWishlists[uid] || [];
    const isIn = current.includes(productId);
    setUserWishlists(prev => ({
      ...prev,
      [uid]: isIn ? current.filter(id => id !== productId) : [...current, productId],
    }));
    return !isIn;
  };

  const isInWishlist = (productId) => {
    if (!currentUser) return false;
    return (userWishlists[currentUser.id] || []).includes(productId);
  };

  // ─── Loyalty Points ───────────────────────────────────────────────────────
  const earnPoints = (amount, description) => {
    if (!currentUser) return;
    const pointsToAdd = Math.floor(amount * 10); // 10 points per $1
    const uid = currentUser.id;
    setUserPoints(prev => ({
      ...prev,
      [uid]: {
        balance: (prev[uid]?.balance || 0) + pointsToAdd,
        history: [
          { id: `pt-${Date.now()}`, type: 'earn', amount: pointsToAdd, description, date: now() },
          ...(prev[uid]?.history || []),
        ],
      },
    }));
    return pointsToAdd;
  };

  const redeemPointsForDiscount = (pointsToUse, subtotal) => {
    if (!currentUser) return 0;
    const uid = currentUser.id;
    const available = userPoints[uid]?.balance || 0;
    const toUse = Math.min(pointsToUse, available);
    const discount = toUse / 100; // 100 points = $1
    const maxDiscount = subtotal * 0.5; // max 50% of order
    const finalDiscount = Math.min(discount, maxDiscount);
    const finalPoints = Math.round(finalDiscount * 100);
    if (finalPoints <= 0) return 0;

    setUserPoints(prev => ({
      ...prev,
      [uid]: {
        balance: (prev[uid]?.balance || 0) - finalPoints,
        history: [
          { id: `pd-${Date.now()}`, type: 'redeem', amount: -finalPoints, description: { en: 'Redeemed in order', ar: 'استبدال في طلب' }, date: now() },
          ...(prev[uid]?.history || []),
        ],
      },
    }));
    return finalDiscount;
  };

  // ─── Reviews ─────────────────────────────────────────────────────────────
  const addReview = (productId, rating, text) => {
    if (!currentUser) return { success: false, error: t('signInToReview') };
    const existing = (reviews[productId] || []).find(r => r.userId === currentUser.id);
    if (existing) return { success: false, error: t('alreadyReviewed') };
    const newReview = {
      id: `rv-${Date.now()}`, userId: currentUser.id, userName: currentUser.name,
      rating, text, date: now(), helpful: 0,
    };
    setReviews(prev => ({ ...prev, [productId]: [newReview, ...(prev[productId] || [])] }));
    return { success: true };
  };

  const getProductReviews = (productId) => reviews[productId] || [];

  const getProductRating = (productId) => {
    const r = reviews[productId] || [];
    if (r.length === 0) return { average: 0, count: 0 };
    return { average: r.reduce((s, rv) => s + rv.rating, 0) / r.length, count: r.length };
  };

  const markHelpful = (productId, reviewId) => {
    setReviews(prev => ({
      ...prev,
      [productId]: (prev[productId] || []).map(r =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      ),
    }));
  };

  // ─── Support Tickets ──────────────────────────────────────────────────────
  const createTicket = (subject, category, message) => {
    if (!currentUser) return { success: false };
    const ticket = {
      id: `TKT-${String(Date.now()).slice(-5)}`,
      subject, category, message, status: 'open',
      createdAt: now(), replies: [],
    };
    const uid = currentUser.id;
    setUserTickets(prev => ({ ...prev, [uid]: [ticket, ...(prev[uid] || [])] }));

    // Simulate auto-reply
    setTimeout(() => {
      const autoReply = {
        from: 'Support',
        message: language === 'ar'
          ? 'شكراً لتواصلك معنا. سيقوم فريقنا بمراجعة تذكرتك والرد في أقرب وقت.'
          : 'Thank you for contacting us. Our team will review your ticket and respond shortly.',
        date: now(),
      };
      setUserTickets(prev => ({
        ...prev,
        [uid]: (prev[uid] || []).map(tk =>
          tk.id === ticket.id
            ? { ...tk, status: 'in-progress', replies: [...tk.replies, autoReply] }
            : tk
        ),
      }));
    }, 1500);

    return { success: true, ticket };
  };

  const addTicketReply = (ticketId, message) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setUserTickets(prev => ({
      ...prev,
      [uid]: (prev[uid] || []).map(tk =>
        tk.id === ticketId
          ? { ...tk, replies: [...tk.replies, { from: currentUser.name, message, date: now() }] }
          : tk
      ),
    }));
  };

  const closeTicket = (ticketId) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setUserTickets(prev => ({
      ...prev,
      [uid]: (prev[uid] || []).map(tk =>
        tk.id === ticketId ? { ...tk, status: 'closed' } : tk
      ),
    }));
  };

  // ─── Payment Methods ──────────────────────────────────────────────────────
  const addPaymentMethod = (method) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    const newMethod = { ...method, id: `pm-${Date.now()}`, isDefault: (userPaymentMethods[uid] || []).length === 0 };
    setUserPaymentMethods(prev => ({ ...prev, [uid]: [...(prev[uid] || []), newMethod] }));
    return { success: true };
  };

  const removePaymentMethod = (methodId) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setUserPaymentMethods(prev => ({
      ...prev,
      [uid]: (prev[uid] || []).filter(m => m.id !== methodId),
    }));
  };

  const setDefaultPaymentMethod = (methodId) => {
    if (!currentUser) return;
    const uid = currentUser.id;
    setUserPaymentMethods(prev => ({
      ...prev,
      [uid]: (prev[uid] || []).map(m => ({ ...m, isDefault: m.id === methodId })),
    }));
  };

  // ─── Referral ─────────────────────────────────────────────────────────────
  const shareReferralCode = async () => {
    if (!currentUser) return;
    const code = userReferrals[currentUser.id]?.code || '';
    try {
      await Share.share({
        message: language === 'ar'
          ? `انضم إلى Mez-Cards واحصل على خصم!\nكود الإحالة: ${code}\nحمّل التطبيق الآن`
          : `Join Mez-Cards and get a discount!\nReferral code: ${code}\nDownload the app now`,
        title: 'Mez-Cards',
      });
    } catch (e) {}
  };

  // ─── Transfer Funds ───────────────────────────────────────────────────────
  const transferFunds = (targetIdentifier, amount) => {
    if (!currentUser) return { success: false, error: t('signInRequired') };
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return { success: false, error: t('enterValidAmount') };
    if (currentUser.wallet < amt) return { success: false, error: t('insufficientMsg') };
    const target = users.find(u => String(u.id) === String(targetIdentifier) || u.username === targetIdentifier || u.email === targetIdentifier);
    if (!target) return { success: false, error: t('userNotFound') };
    if (target.id === currentUser.id) return { success: false, error: t('cannotTransferSelf') };
    const uid = currentUser.id;
    const dateStr = now();
    setCurrentUser(prev => ({ ...prev, wallet: prev.wallet - amt }));
    setUsers(prev => prev.map(u => {
      if (u.id === uid) return { ...u, wallet: u.wallet - amt };
      if (u.id === target.id) return { ...u, wallet: u.wallet + amt };
      return u;
    }));
    setUserTransactions(prev => ({
      ...prev,
      [uid]: [{ icon: '↗️', name: language === 'ar' ? `تحويل إلى ${target.name}` : `Transfer to ${target.name}`, date: dateStr, amount: `-$${amt.toFixed(2)}`, type: 'debit', color: '#f87171', bg: 'rgba(248,113,113,0.15)' }, ...(prev[uid] || [])],
      [target.id]: [{ icon: '↙️', name: language === 'ar' ? `تحويل من ${currentUser.name}` : `Transfer from ${currentUser.name}`, date: dateStr, amount: `+$${amt.toFixed(2)}`, type: 'credit', color: '#34d399', bg: 'rgba(52,211,153,0.15)' }, ...(prev[target.id] || [])],
    }));
    return { success: true, targetName: target.name, amount: amt };
  };

  // ─── Cart ─────────────────────────────────────────────────────────────────
  const addToCart = (product, pkgIndex) => {
    const pkg = product.pkgs[pkgIndex];
    setCart(prev => {
      const ex = prev.find(i => i.productId === product.id && i.pkgIndex === pkgIndex);
      if (ex) return prev.map(i => i.productId === product.id && i.pkgIndex === pkgIndex ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, pkgIndex, qty: 1, name: product.name, pkg: pkg.a, price: pkg.p, colors: product.colors, short: product.short, image: product.image }];
    });
  };
  const removeFromCart = (productId, pkgIndex) => setCart(prev => prev.filter(i => !(i.productId === productId && i.pkgIndex === pkgIndex)));
  const clearCart = () => setCart([]);

  // ─── Checkout ────────────────────────────────────────────────────────────
  const checkout = ({ couponCode, usePointsAmount = 0, paymentMethodId = null } = {}) => {
    if (!currentUser) return { success: false, error: t('signInRequired') };
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    let couponDiscount = 0;
    let couponInfo = null;

    if (couponCode) {
      const cv = validateCoupon(couponCode, subtotal);
      if (cv.valid) { couponDiscount = cv.discount; couponInfo = cv.coupon; }
    }

    let pointsDiscount = 0;
    if (usePointsAmount > 0) {
      const maxPointsDiscount = (subtotal - couponDiscount) * 0.5;
      pointsDiscount = Math.min(usePointsAmount / 100, maxPointsDiscount);
    }

    const afterDiscount = subtotal - couponDiscount - pointsDiscount;
    const vat = afterDiscount * 0.1;
    const total = afterDiscount + vat;

    if (currentUser.wallet < total) return { success: false, error: t('insufficientMsg') };

    const dateStr = now();
    const invId = `#INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000 + 1000))}`;
    const uid = currentUser.id;

    const newOrders = cart.map(item => ({
      id: `#ORD-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: `${item.name} (${item.pkg})`, customer: currentUser.name,
      date: dateStr, amount: `$${(item.price * item.qty).toFixed(2)}`, status: 'completed',
    }));

    const newTrans = cart.map(item => ({
      icon: '🎮', name: `${item.name} ${item.pkg}`, date: dateStr,
      amount: `-$${(item.price * item.qty).toFixed(2)}`, type: 'debit', color: '#f87171', bg: 'rgba(248,113,113,0.15)',
    }));

    const newInvoice = {
      id: invId, date: dateStr, amount: `$${total.toFixed(2)}`, status: 'paid',
      items: [
        ...cart.map(i => ({ name: `${i.name} ${i.pkg} ×${i.qty}`, amount: `$${(i.price * i.qty).toFixed(2)}` })),
        ...(couponDiscount > 0 ? [{ name: `Coupon: ${couponInfo?.code}`, amount: `-$${couponDiscount.toFixed(2)}` }] : []),
        ...(pointsDiscount > 0 ? [{ name: 'Points discount', amount: `-$${pointsDiscount.toFixed(2)}` }] : []),
      ],
    };

    // Deduct points if used
    if (usePointsAmount > 0 && pointsDiscount > 0) {
      const usedPoints = Math.round(pointsDiscount * 100);
      setUserPoints(prev => ({
        ...prev,
        [uid]: {
          balance: (prev[uid]?.balance || 0) - usedPoints,
          history: [
            { id: `pd-${Date.now()}`, type: 'redeem', amount: -usedPoints, description: { en: 'Redeemed in order', ar: 'استبدال في طلب' }, date: dateStr },
            ...(prev[uid]?.history || []),
          ],
        },
      }));
    }

    setUserOrders(prev => ({ ...prev, [uid]: [...newOrders, ...(prev[uid] || [])] }));
    setUserTransactions(prev => ({ ...prev, [uid]: [...newTrans, ...(prev[uid] || [])] }));
    setUserInvoices(prev => ({ ...prev, [uid]: [newInvoice, ...(prev[uid] || [])] }));
    setCurrentUser(prev => ({ ...prev, wallet: prev.wallet - total, spent: prev.spent + total }));
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, wallet: u.wallet - total, spent: u.spent + total } : u));

    // Earn points from order (10 per $1)
    const earned = Math.floor(subtotal * 10);
    setUserPoints(prev => ({
      ...prev,
      [uid]: {
        balance: (prev[uid]?.balance || 0) + earned,
        history: [
          { id: `pe-${Date.now()}`, type: 'earn', amount: earned, description: { en: `Order ${newOrders[0]?.id}`, ar: `طلب ${newOrders[0]?.id}` }, date: dateStr },
          ...(prev[uid]?.history || []),
        ],
      },
    }));

    setCart([]);
    return { success: true, total, earned };
  };

  const addFunds = (amount) => {
    if (!currentUser) return;
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const uid = currentUser.id;
    const dateStr = now();
    setCurrentUser(prev => ({ ...prev, wallet: prev.wallet + amt }));
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, wallet: u.wallet + amt } : u));
    setUserTransactions(prev => ({
      ...prev,
      [uid]: [{ icon: '💳', name: language === 'ar' ? 'شحن المحفظة' : 'Wallet Top-up', date: dateStr, amount: `+$${amt.toFixed(2)}`, type: 'credit', color: '#34d399', bg: 'rgba(52,211,153,0.15)' }, ...(prev[uid] || [])],
    }));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0) * 1.1;

  return (
    <AppContext.Provider value={{
      currentUser, cart, orders, transactions, invoices, cartCount, cartTotal,
      language, isRTL, t, toggleLanguage,
      isDark, toggleDarkMode, colors,
      currency, setCurrency, currencies: CURRENCIES,
      // Auth
      login, register, logout, changePassword, requestPasswordReset, verifyOTPAndReset,
      // Features
      validateCoupon, COUPONS,
      wishlist, toggleWishlist, isInWishlist,
      pointsData, earnPoints, redeemPointsForDiscount,
      reviews, addReview, getProductReviews, getProductRating, markHelpful,
      tickets, createTicket, addTicketReply, closeTicket, TICKET_CATEGORIES,
      paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod,
      referralData, shareReferralCode,
      transferFunds,
      addToCart, removeFromCart, clearCart, checkout, addFunds,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);