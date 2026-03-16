import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../data';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale    = useRef(new Animated.Value(0)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const textY        = useRef(new Animated.Value(30)).current;
  const loaderOpacity= useRef(new Animated.Value(0)).current;
  const ring1Scale   = useRef(new Animated.Value(0.8)).current;
  const ring2Scale   = useRef(new Animated.Value(0.9)).current;
  const dot1         = useRef(new Animated.Value(1)).current;
  const dot2         = useRef(new Animated.Value(1)).current;
  const dot3         = useRef(new Animated.Value(1)).current;
  const screenOpacity= useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Ring pulse
    const ringAnim = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ring1Scale, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
          Animated.timing(ring1Scale, { toValue: 0.8,  duration: 1500, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(ring2Scale, { toValue: 1.05, duration: 1800, useNativeDriver: true }),
          Animated.timing(ring2Scale, { toValue: 0.9,  duration: 1800, useNativeDriver: true }),
        ]),
      ])
    );
    ringAnim.start();

    // Loader dots
    const dotBounce = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(dot, { toValue: 1.5, duration: 300, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 1,   duration: 300, easing: Easing.ease, useNativeDriver: true }),
        Animated.delay(600),
      ])
    );
    dotBounce(dot1, 0).start();
    dotBounce(dot2, 150).start();
    dotBounce(dot3, 300).start();

    // Entry sequence
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, friction: 6, tension: 100, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textY,       { toValue: 0, duration: 400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.timing(loaderOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(screenOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start(() => onFinish());

    return () => ringAnim.stop();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <LinearGradient colors={['#0d0b1e', '#1a0533', '#2d0b5e', '#0d0b1e']} style={StyleSheet.absoluteFill} />

      {/* Rings */}
      <Animated.View style={[styles.ring, styles.ring1, { transform: [{ scale: ring1Scale }] }]} />
      <Animated.View style={[styles.ring, styles.ring2, { transform: [{ scale: ring2Scale }] }]} />

      {/* Logo */}
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center' }}>
        <LinearGradient colors={['#7c3aed', '#a855f7', '#f472b6']} style={styles.logoBox} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.logoLetter}>w</Text>
        </LinearGradient>
      </Animated.View>

      {/* Name + tagline */}
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }], alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.appName}><Text style={styles.appNameW}>w</Text>upex</Text>
        <Text style={styles.tagline}>DIGITAL CARDS &amp; GAMING STORE</Text>
      </Animated.View>

      {/* Loader */}
      <Animated.View style={[styles.loader, { opacity: loaderOpacity }]}>
        {[dot1, dot2, dot3].map((dot, i) => (
          <Animated.View key={i} style={[styles.dot, i === 1 && { backgroundColor: '#a855f7' }, i === 2 && { backgroundColor: '#f472b6' }, { transform: [{ scale: dot }] }]} />
        ))}
      </Animated.View>

      <TouchableOpacity style={styles.skipBtn} onPress={onFinish}>
        <Text style={styles.skipText}>Skip ›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 100, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  ring1: { width: width * 1.2, height: width * 1.2, top: -width * 0.3, left: -width * 0.1 },
  ring2: { width: width * 1.0, height: width * 1.0, bottom: -width * 0.3, right: -width * 0.1 },
  logoBox: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 15 },
  logoLetter: { fontSize: 48, fontWeight: '900', color: '#fff', fontStyle: 'italic' },
  appName: { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 6 },
  appNameW: { color: '#c084fc', fontStyle: 'italic' },
  tagline: { fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2.5, textTransform: 'uppercase' },
  loader: { flexDirection: 'row', gap: 8, marginTop: 48 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7c3aed' },
  skipBtn: { position: 'absolute', bottom: 40, right: 24, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  skipText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
});
