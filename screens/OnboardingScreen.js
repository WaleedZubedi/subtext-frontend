import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { markOnboardingComplete } from '../lib/api';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Decode Hidden Messages',
    description: 'See what people really mean behind every text',
    gradient: ['#0a0a0a', '#1a0000', '#0a0a0a'],
  },
  {
    id: 2,
    title: 'Trained AI',
    description: 'Advanced psychology trained on real conversations',
    gradient: ['#000000', '#0a0000', '#000000'],
  },
  {
    id: 3,
    title: 'Strategic Control',
    description: 'Get replies that put you in control of every conversation',
    gradient: ['#0a0000', '#1a0000', '#0a0000'],
  },
];

// Crime scene tape component
const CrimeTape = ({ style }) => {
  return (
    <View style={[styles.crimeTape, style]}>
      {Array.from({ length: 10 }).map((_, i) => (
        <Text key={i} style={styles.crimeTapeText}>SUBTEXT</Text>
      ))}
    </View>
  );
};

// Demon scan animation - SubText gets scanned and reveals demon
const DemonScanAnimation = ({ onComplete }) => {
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;
  const demonScaleAnim = useRef(new Animated.Value(0)).current;
  const demonFadeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Phase 1: SubText logo fades in
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Phase 2: Scan line moves across
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      
      // Phase 3: Glitch effect
      Animated.sequence([
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(glitchAnim, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 4: Logo fades out, demon appears
      Animated.parallel([
        Animated.timing(logoFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 5: Flash fades, demon scales in
      Animated.parallel([
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(demonScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(demonFadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 6: Hold demon for a moment
      Animated.delay(600),
      
      // Phase 7: Fade everything out
      Animated.timing(demonFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onComplete, 100);
    });
  }, []);

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenHeight, screenHeight],
  });

  const glitchTranslate = glitchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  return (
    <View style={styles.demonContainer}>
      {/* Red flash effect */}
      <Animated.View
        style={[
          styles.flashOverlay,
          { opacity: flashAnim }
        ]}
      />
      
      {/* SubText Logo */}
      <Animated.View
        style={[
          styles.scanLogoContainer,
          {
            opacity: logoFadeAnim,
            transform: [
              { translateX: glitchTranslate },
              { 
                scale: logoFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }
            ],
          },
        ]}
      >
        <Text style={styles.scanLogo}>
          <Text style={styles.scanLogoMain}>Sub</Text>
          <Text style={styles.scanLogoAccent}>Text</Text>
        </Text>
        
        {/* Scan line */}
        <Animated.View
          style={[
            styles.demonScanLine,
            {
              transform: [{ translateY: scanLineTranslate }],
            },
          ]}
        >
          <LinearGradient
            colors={['transparent', '#ff4444', '#ff4444', 'transparent']}
            style={styles.scanLineGradient}
          />
        </Animated.View>
        
        {/* Scan frame */}
        <View style={styles.scanFrame} />
      </Animated.View>
      
      {/* Demon emoji appears */}
      <Animated.View
        style={[
          styles.demonEmoji,
          {
            opacity: demonFadeAnim,
            transform: [{ scale: demonScaleAnim }],
          },
        ]}
      >
        <Text style={styles.demonEmojiText}>😈</Text>
      </Animated.View>
    </View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showScrollingExit, setShowScrollingExit] = useState(false);
  
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / screenWidth);
        if (index !== currentIndex) {
          setCurrentIndex(index);
        }
      },
    }
  );

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * screenWidth,
        animated: true,
      });
    }
  };

  const handleGetStarted = async () => {
    setShowScrollingExit(true);
  };

  const handleScrollingComplete = async () => {
    await markOnboardingComplete();
    router.replace('/signup');
  };

  const handleSkip = async () => {
    await markOnboardingComplete();
    router.replace('/login');
  };

  const currentSlide = slides[currentIndex];

  if (showScrollingExit) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={[styles.background, { backgroundColor: '#000' }]} />
        <DemonScanAnimation onComplete={handleScrollingComplete} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
        colors={currentSlide.gradient}
        style={styles.background}
        locations={[0, 0.5, 1]}
      />

      {/* Crime scene tapes */}
      <CrimeTape style={styles.crimeTapeTop} />
      <CrimeTape style={styles.crimeTapeBottom} />

      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.slideContent}>
              {/* Title */}
              <Text style={[
                styles.title,
                index === 1 && styles.titleSmall
              ]}>
                {slide.title}
              </Text>

              {/* Second slide stats */}
              {index === 1 && (
                <View style={styles.statsContainer}>
                  <Text style={styles.statsNumber}>5,000+</Text>
                  <Text style={styles.statsLabel}>REAL CONVERSATIONS ANALYZED</Text>
                </View>
              )}

              {/* Description */}
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Pagination dots */}
        <View style={styles.pagination}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * screenWidth,
              index * screenWidth,
              (index + 1) * screenWidth,
            ];

            const width = scrollX.interpolate({
              inputRange,
              outputRange: [8, 32, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width,
                    opacity,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={currentIndex === slides.length - 1 ? handleGetStarted : scrollToNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B0000', '#ff4444']}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Continue'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Login link on last slide */}
        {currentIndex === slides.length - 1 && (
          <TouchableOpacity style={styles.loginLink} onPress={handleSkip}>
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text style={styles.loginTextBold}>Log In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Crime scene tape
  crimeTape: {
    position: 'absolute',
    height: 40,
    backgroundColor: 'rgba(139, 0, 0, 0.9)',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 5,
  },
  crimeTapeTop: {
    top: 80,
    left: -50,
    right: -50,
    transform: [{ rotate: '3deg' }],
    width: screenWidth + 100,
  },
  crimeTapeBottom: {
    bottom: 200,
    left: -50,
    right: -50,
    transform: [{ rotate: '-3deg' }],
    width: screenWidth + 100,
  },
  crimeTapeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
    marginHorizontal: 20,
  },
  
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  
  slide: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  
  title: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 60,
    letterSpacing: -2,
    lineHeight: 52,
  },
  titleSmall: {
    fontSize: 32,
    marginBottom: 40,
  },
  
  statsContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  statsNumber: {
    color: '#ff4444',
    fontSize: 56,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -2,
  },
  statsLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  
  description: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ff4444',
  },
  continueButton: {
    width: '100%',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  continueGradient: {
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  loginTextBold: {
    color: '#ff4444',
    fontWeight: '600',
  },
  
  // Demon scan animation styles
  demonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  flashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff4444',
  },
  scanLogoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLogo: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -3,
  },
  scanLogoMain: {
    color: '#fff',
  },
  scanLogoAccent: {
    color: '#ff4444',
  },
  demonScanLine: {
    position: 'absolute',
    left: -50,
    right: -50,
    height: 80,
  },
  scanLineGradient: {
    flex: 1,
  },
  scanFrame: {
    position: 'absolute',
    top: -40,
    left: -40,
    right: -40,
    bottom: -40,
    borderWidth: 2,
    borderColor: '#ff4444',
    borderRadius: 8,
  },
  demonEmoji: {
    position: 'absolute',
  },
  demonEmojiText: {
    fontSize: 120,
    textShadowColor: '#ff4444',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
});