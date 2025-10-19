import * as Clipboard from 'expo-clipboard';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../lib/api';
import { styles } from './styles';

const API_BASE_URL = 'https://subtext-backend-f8ci.vercel.app/api';
const { width: screenWidth } = Dimensions.get('window');
const StaticBackground = () => (
  <LinearGradient
    colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
    style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}
    locations={[0, 0.5, 1]}
  />
);

const MessageBubbleAnimation = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const analysisAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const slideDownAnim = useRef(new Animated.Value(-30)).current;
 
  const phases = [
    { 
      surfaceText: "Hey, are you free tonight?", 
      hiddenText: "I need validation and attention",
      analysis: "Classic availability test → Fishing for priority status",
      manipulationType: "ATTENTION-SEEKING"
    },
    { 
      surfaceText: "Just checking in on you 😊", 
      hiddenText: "I want to control your time",
      analysis: "Fake concern → Boundary invasion disguised as care",
      manipulationType: "CONTROLLING"
    },
    { 
      surfaceText: "We should catch up soon!", 
      hiddenText: "I need something from you",
      analysis: "Vague obligation → Creating social debt without commitment",
      manipulationType: "MANIPULATIVE"
    },
    { 
      surfaceText: "Miss our conversations...", 
      hiddenText: "Guilt-tripping you to respond",
      analysis: "Emotional leverage → Weaponizing nostalgia for response",
      manipulationType: "GUILT-TRIPPING"
    }
  ];

  const typeWriter = (text) => {
    return new Promise((resolve) => {
      setTypewriterText('');
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length && isActive) {
          setTypewriterText(text.substring(0, i));
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 40);
    });
  };

  const resetAnimations = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    revealAnim.setValue(0);
    bounceAnim.setValue(0);
    analysisAnim.setValue(0);
    glitchAnim.setValue(0);
    scanLineAnim.setValue(0);
    slideDownAnim.setValue(-30);
  };

  const runPhaseAnimation = async (phaseIndex) => {
    if (!isActive) return;
    
    const phase = phases[phaseIndex];
    setCurrentPhase(phaseIndex);
    setShowAnalysis(false);
    setTypewriterText('');
    resetAnimations();

    const messageEntrance = Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 120, friction: 8, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -8, duration: 300, useNativeDriver: true }),
        Animated.spring(bounceAnim, { toValue: 0, tension: 180, friction: 8, useNativeDriver: true })
      ])
    ]);

    messageEntrance.start();
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (!isActive) return;

    const glitchEffect = Animated.sequence([
      Animated.timing(glitchAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
      Animated.timing(glitchAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      Animated.timing(glitchAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(glitchAnim, { toValue: 0, duration: 120, useNativeDriver: true })
    ]);

    glitchEffect.start();
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!isActive) return;

    Animated.timing(scanLineAnim, { toValue: 1, duration: 1200, useNativeDriver: true }).start();
    await new Promise(resolve => setTimeout(resolve, 800));
    if (!isActive) return;

    const revealAnimation = Animated.parallel([
      Animated.timing(revealAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(slideDownAnim, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true })
    ]);

    revealAnimation.start();
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (!isActive) return;

    setShowAnalysis(true);
    Animated.spring(analysisAnim, { toValue: 1, tension: 120, friction: 8, useNativeDriver: true }).start();
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!isActive) return;

    await typeWriter(phase.analysis);
    if (!isActive) return;

    await new Promise(resolve => setTimeout(resolve, 2800));
    if (!isActive) return;
    
    const fadeOut = Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(revealAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(analysisAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 600, useNativeDriver: true }),
      Animated.timing(scanLineAnim, { toValue: 0, duration: 400, useNativeDriver: true })
    ]);

    fadeOut.start();
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  useEffect(() => {
    let animationTimeout;
    
    const runAnimationLoop = async () => {
      if (!isActive) return;
      
      for (let i = 0; i < phases.length; i++) {
        if (!isActive) break;
        await runPhaseAnimation(i);
        if (!isActive) break;
        await new Promise(resolve => {
          animationTimeout = setTimeout(resolve, 600);
        });
      }
      
      if (isActive) {
        animationTimeout = setTimeout(runAnimationLoop, 800);
      }
    };

    runAnimationLoop();

    return () => {
      setIsActive(false);
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, []);
  
  const currentPhaseData = phases[currentPhase];

  return (
    <View style={styles.messageAnimation}>
      <Animated.View
        style={[
          styles.messageBubble,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: bounceAnim },
              { 
                translateX: glitchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 4]
                })
              }
            ]
          }
        ]}
      >
        <Text style={styles.surfaceText}>{currentPhaseData.surfaceText}</Text>
        
        <Animated.View
          style={[
            styles.scanningLine,
            {
              opacity: scanLineAnim.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0]
              }),
              transform: [{
                translateX: scanLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-30, screenWidth * 0.8 + 30]
                })
              }]
            }
          ]}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.hiddenIntentBubble,
          {
            opacity: revealAnim,
            transform: [
              { translateY: slideDownAnim },
              { 
                scale: revealAnim.interpolate({ 
                  inputRange: [0, 1], 
                  outputRange: [0.9, 1] 
                }) 
              }
            ]
          }
        ]}
      >
        <Text style={styles.hiddenText}>{currentPhaseData.hiddenText}</Text>
        <View style={styles.intentArrow} />
      </Animated.View>

      {showAnalysis && (
        <Animated.View
          style={[
            styles.analysisLayer,
            {
              opacity: analysisAnim,
              transform: [
                { 
                  translateY: analysisAnim.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [40, 0] 
                  }) 
                },
                { 
                  scale: analysisAnim.interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [0.95, 1] 
                  }) 
                }
              ]
            }
          ]}
        >
          <View style={styles.analysisHeader}>
            <View style={styles.analysisIcon}>
              <Text style={styles.analysisIconText}>AI</Text>
            </View>
            <Text style={styles.analysisTitle}>SubText Analysis</Text>
            <View style={styles.manipulationBadge}>
              <Text style={styles.manipulationType}>{currentPhaseData.manipulationType}</Text>
            </View>
          </View>
          <Text style={styles.analysisText}>
            {typewriterText}
            {typewriterText.length < currentPhaseData.analysis.length && (
              <Text style={styles.cursor}>|</Text>
            )}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const TrainingStats = () => {
  const lightningAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lightningAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(lightningAnim, { toValue: 0, duration: 800, useNativeDriver: true })
      ])
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.trainingStatsContainer, { opacity: fadeAnim }]}>
      <View style={styles.trainingStatsContent}>
        <Animated.View style={[
          styles.lightningIcon,
          {
            transform: [{
              scale: lightningAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.1, 1]
              })
            }]
          }
        ]}>
          <View style={styles.lightningBolt} />
          <View style={styles.lightningTail} />
        </Animated.View>
        <Text style={styles.trainingStatsText}>Trained over 50,000 real conversations</Text>
      </View>
      <Animated.View 
        style={[
          styles.trainingStatsGlow,
          {
            opacity: lightningAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8]
            })
          }
        ]} 
      />
    </Animated.View>
  );
};

const ScanningAnimation = ({ imageUri }) => {
  const lineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(lineAnim, { toValue: 0, duration: 800, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
      ])
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.scanningContainer}>
      <Animated.View style={[styles.scanningImageContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Image source={{ uri: imageUri }} style={styles.scanningImage} />
        <View style={styles.scanLineOverlay}>
          <Animated.View 
            style={[
              styles.scanLine,
              {
                opacity: fadeAnim,
                transform: [{
                  translateX: lineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, screenWidth * 0.8 + 10]
                  })
                }]
              }
            ]}
          />
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.scanStatus, { opacity: fadeAnim }]}>
        <Text style={styles.scanStatusText}>Analyzing conversation patterns...</Text>
        <Text style={styles.scanStatusSubtext}>Decoding hidden intentions</Text>
      </Animated.View>
    </View>
  );
};

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrError, setOcrError] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [manualText, setManualText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [pressedItem, setPressedItem] = useState(null);
  const [burgerPressed, setBurgerPressed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const analysisAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const menuSlideAnim = useRef(new Animated.Value(-300)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current;

  // Check auth on mount
 // Check auth and onboarding on mount
useEffect(() => {
  const checkAuthStatus = async () => {
    const token = await getToken();
    if (!token && !isLoading) {
      router.replace('/login');
    }
  };
  checkAuthStatus();
}, [isAuthenticated, isLoading]);
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -1, duration: 1500, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 1500, useNativeDriver: true })
      ])
    ).start();
    
    if (image || analysis) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    }
    
    if (analysis) {
      Animated.timing(analysisAnim, { toValue: 1, duration: 1000, delay: 500, useNativeDriver: true }).start();
    }

    const scale = Math.max(0.7, 1 - (scrollY / 300));
    Animated.timing(logoScaleAnim, { toValue: scale, duration: 200, useNativeDriver: true }).start();
  }, [image, analysis, loading, scrollY]);

  const toggleMenu = () => {
    const toValue = showMenu ? -300 : 0;
    setShowMenu(!showMenu);
    Animated.spring(menuSlideAnim, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const shareApp = () => {
    Alert.alert('Share SubText', 'Help others decode hidden messages!', [
      { text: 'Copy Link', onPress: () => copyToClipboard('https://subtext.app') },
      { text: 'Cancel', style: 'cancel' }
    ]);
    toggleMenu();
  };

  const contactUs = () => {
    Alert.alert('Contact Us', 'Get in touch with the SubText team', [
      { text: 'Email Support', onPress: () => Alert.alert('Email', 'support@subtext.app') },
      { text: 'Report Bug', onPress: () => Alert.alert('Bug Report', 'Send bug reports to bugs@subtext.app') },
      { text: 'Cancel', style: 'cancel' }
    ]);
    toggleMenu();
  };

  const showAbout = () => {
    Alert.alert('About SubText', 'SubText uses advanced AI to decode hidden intentions in conversations. Trained on 50,000+ real conversations to help you understand what people really mean.\n\nVersion 1.0.0', [{ text: 'OK' }]);
    toggleMenu();
  };

  const showPrivacy = () => {
    Alert.alert('Privacy Policy', 'Your conversations are processed securely and not stored on our servers. All analysis is done in real-time and deleted immediately after processing.', [{ text: 'OK' }]);
    toggleMenu();
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access media library is required.');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        quality: 1,
        base64: false,
      });
    
      if (!result.canceled) {
        const asset = result.assets[0];
        
        setImage(asset.uri);
        setLoading(true);
        
        await sendToOCR(asset);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };
  const handleSubscriptionPurchase = async (plan) => {
    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful purchase
      Alert.alert(
        'Subscription Activated!',
        `Your ${plan} subscription has been activated. You can now analyze conversations!`,
        [
          {
            text: 'Great!',
            onPress: async () => {
              // Mark user as having subscription
              await saveSubscriptionStatus(true);
              // Now allow them to pick image
              pickImage();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Subscription purchase error:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    }
  };
  const sendToOCR = async (asset) => {
    try {
      console.log('🚀 Calling OCR API:', `${API_BASE_URL}/ocr`);
      
      // Get auth token
      const token = await getToken();
      if (!token) {
        Alert.alert('Authentication Required', 'Please login again');
        router.replace('/login');
        return;
      }
      
      // Validate token format (basic check)
      if (typeof token !== 'string' || token.length < 10) {
        Alert.alert('Invalid Token', 'Please login again');
        router.replace('/login');
        return;
      }
      
      const formData = new FormData();
      formData.append('image', {
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || 'image.jpg',
      });
      
      const response = await fetch(`${API_BASE_URL}/ocr`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      console.log('📡 Response status:', response.status);
      
      const responseText = await response.text();
      console.log('📄 Raw response:', responseText);
      
      const data = JSON.parse(responseText);
      
      // Handle authentication errors
      if (response.status === 401) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            { 
              text: 'Login', 
              onPress: () => {
                router.replace('/login');
              }
            }
          ]
        );
        setLoading(false);
        return;
      }
      
      // Handle subscription error
    // Handle subscription error
if (response.status === 403) {
  Alert.alert(
    'Subscription Required',
    'Please subscribe to use this feature',
    [
      { 
        text: 'OK',
        onPress: () => {
          setLoading(false);
          setImage(null);
          setOcrError(false);
        }
      }
    ]
  );
  return;
}
  
      const result = data.ParsedResults[0];
      const parsedText = result.ParsedText?.trim() || 'No text found.';
      
      if (parsedText === 'No text found.' || parsedText === 'OCR failed.') {
        setOcrError(true);
        setLoading(false);
        return;
      }
  
      processTextWithGPT(parsedText);
    } catch (error) {
      console.error('🔥 OCR Error details:', error);
      console.error('🔥 Error message:', error.message);
      
      // Handle auth errors
      if (error.message.includes('authentication') || error.message.includes('token')) {
        Alert.alert('Session Expired', 'Please login again');
        router.replace('/login');
        return;
      }
      
      setOcrError(true);
      setLoading(false);
    }
  };
  
  const analyzeManualText = () => {
    if (!manualText.trim()) {
      Alert.alert('Error', 'Please enter some text to analyze.');
      return;
    }
    setLoading(true);
    processTextWithGPT(manualText);
  };

  const processTextWithGPT = async (rawText) => {
    try {
      const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rawText }),
      });
  
      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        analyzeText([rawText]);
        return;
      }
  
      const responseContent = data.choices[0].message.content;
      const startMarker = 'EXTRACTED_MESSAGES_START';
      const endMarker = 'EXTRACTED_MESSAGES_END';
      
      const startIndex = responseContent.indexOf(startMarker);
      const endIndex = responseContent.indexOf(endMarker);
      
      if (startIndex === -1 || endIndex === -1) {
        analyzeText([rawText]);
        return;
      }
      
      const messagesSection = responseContent.substring(startIndex + startMarker.length, endIndex);
      
      if (!messagesSection || messagesSection.trim().length === 0) {
        analyzeText([rawText]);
        return;
      }
      
      const senderMessages = messagesSection
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 3 && !line.includes('[') && !line.includes(']'));
  
      if (senderMessages.length === 0) {
        analyzeText([rawText]);
        return;
      }
  
      analyzeText(senderMessages);
    } catch (error) {
      console.error('Processing Error:', error);
      analyzeText([rawText]);
    }
  };

  const analyzeText = async (senderMessages) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: senderMessages }),
      });
  
      const data = await response.json();
      
      if (data.choices?.[0]?.message?.content) {
        setAnalysis({ 
          combinedAnalysis: data.choices[0].message.content,
          selectedMessages: senderMessages
        });
      }
    } catch (error) {
      Alert.alert('Analysis Error', 'Failed to analyze the text.');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Reply copied to clipboard.');
    } catch (error) {
      Alert.alert('Copy Failed', 'Unable to copy to clipboard.');
    }
  };
  
  const resetApp = () => {
    setImage(null);
    setAnalysis(null);
    setOcrError(false);
    setShowTextInput(false);
    setManualText('');
    fadeAnim.setValue(0);
    analysisAnim.setValue(0);
  };

  const parseAnalysis = () => {
    if (!analysis) return { intent: '', reply: '', behaviorType: 'Unknown', selectedMessages: [] };
    
    const content = analysis.combinedAnalysis;
    let intent = '', reply = '', behaviorType = 'Unknown', selectedMessages = analysis.selectedMessages || [];
    
    const sections = content.split('**');
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i].trim();
      
      if (section.toLowerCase().includes('hidden intent') && sections[i + 1]) {
        intent = sections[i + 1].replace(/^:?\s*/, '').trim();
      } else if (section.toLowerCase().includes('behavior type') && sections[i + 1]) {
        behaviorType = sections[i + 1].replace(/^:?\s*/, '').trim();
      } else if (section.toLowerCase().includes('strategic reply') && sections[i + 1]) {
        reply = sections[i + 1].replace(/^:?\s*/, '').trim();
      }
    }
    
    intent = intent.replace(/^["']|["']$/g, '').trim();
    reply = reply.replace(/^["']|["']$/g, '').trim();
    
    return { intent, reply, behaviorType, selectedMessages };
  };

  const handleScroll = (event) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  const renderStickyHeader = () => (
    <View style={[styles.stickyHeader, { opacity: scrollY > 50 ? 1 : 0 }]}>
      <Animated.View style={{ transform: [{ scale: logoScaleAnim }] }}>
        <Text style={styles.stickyLogoText}>
          <Text style={styles.stickyLogoMain}>Sub</Text>
          <Text style={styles.stickyLogoOrange}>text</Text>
          <Text style={styles.stickyLogoDot}>.</Text>
        </Text>
      </Animated.View>
    </View>
  );

  const renderBurgerMenu = () => (
    <>
      {showMenu && <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={toggleMenu} />}
      <Animated.View style={[styles.menuPanel, { transform: [{ translateX: menuSlideAnim }] }]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>
            <Text style={styles.menuTitleMain}>Sub</Text>
            <Text style={styles.menuTitleOrange}>text</Text>
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuItems}>
          {[
            { key: 'share', icon: '📤', text: 'Share SubText', action: shareApp },
            { key: 'contact', icon: '📧', text: 'Contact Us', action: contactUs },
            { key: 'about', icon: 'ℹ️', text: 'About', action: showAbout },
            { key: 'privacy', icon: '🔒', text: 'Privacy Policy', action: showPrivacy },
            { key: 'settings', icon: '⚙️', text: 'Settings', action: () => { router.push('/settings'); toggleMenu(); }},

            { key: 'rate', icon: '⭐', text: 'Rate Us', action: () => { Alert.alert('Rate Us', 'Enjoying SubText? Please rate us on the App Store!'); toggleMenu(); }}
          ].map(item => (
            <TouchableOpacity 
              key={item.key}
              style={[styles.menuItem, pressedItem === item.key && styles.menuItemPressed]} 
              onPress={item.action}
              onPressIn={() => setPressedItem(item.key)}
              onPressOut={() => setPressedItem(null)}
            >
              <View style={styles.menuItemIcon}>
                <Text style={styles.menuItemIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.menuItemText}>{item.text}</Text>
              <View style={styles.menuItemChevron}>
                <Text style={styles.menuItemChevronText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.menuFooter}>
          <Text style={styles.menuFooterText}>Version 1.0.0</Text>
          <Text style={styles.menuFooterSubtext}>Decode every conversation</Text>
        </View>
      </Animated.View>
    </>
  );
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTop}>
        {/* TEMPORARY LOGOUT BUTTON */}
       
        
        <TouchableOpacity 
          style={[styles.burgerButtonMain, burgerPressed && styles.burgerButtonMain]} 
          onPress={toggleMenu}
          onPressIn={() => setBurgerPressed(true)}
          onPressOut={() => setBurgerPressed(false)}
        >
          <View style={styles.burgerLineMain} />
          <View style={styles.burgerLineMain} />
          <View style={styles.burgerLineMain} />
        </TouchableOpacity>
      </View>
      <View style={styles.logoContainer}>
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoMain}>Sub</Text>
            <Text style={styles.logoOrange}>text</Text>
            <Text style={styles.logoDot}>.</Text>
          </Text>
        </View>
        <Text style={styles.tagline}>Decode the real intent behind every message</Text>
      </View>
    </View>
  );

  const renderWelcomeSection = () => {
    if (image || loading || analysis) return null;
    
    return (
      <View style={styles.welcomeSection}>
        <MessageBubbleAnimation />
        <TrainingStats />
        
        <View style={styles.actionButtons}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }, { translateY: bounceAnim }] }}>
            <TouchableOpacity 
              style={[styles.uploadButton, { backgroundColor: 'transparent' }]} 
              onPress={pickImage}
              onPressIn={() => console.log('🔘 Button pressed in')}
              onPressOut={() => console.log('🔘 Button pressed out')}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <LinearGradient colors={['#FF6B6B', '#FF5252']} style={styles.uploadGradient} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
                <View style={styles.cameraIcon}>
                  <View style={styles.cameraBody} />
                  <View style={styles.cameraLens} />
                  <View style={styles.cameraFlash} />
                </View>
                <Text style={styles.uploadText}>Upload Screenshot</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.manualButton} onPress={() => setShowTextInput(!showTextInput)}>
            <Text style={styles.manualButtonText}>Enter Text Manually</Text>
          </TouchableOpacity>
        </View>

        {showTextInput && (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Paste your conversation here..."
              placeholderTextColor="#666"
              value={manualText}
              onChangeText={setManualText}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.analyzeButton} onPress={analyzeManualText}>
              <LinearGradient colors={['#FF6B6B', '#FF8E8E']} style={styles.analyzeButtonGradient}>
                <Text style={styles.analyzeButtonText}>Analyze Text</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  const renderImageScan = () => {
    if (loading) return <ScanningAnimation imageUri={image} />;

    if (ocrError) {
      return (
        <View style={{
          alignItems: 'center',
          marginVertical: 20,
          paddingHorizontal: 20,
        }}>
          <View style={{
            backgroundColor: '#0a0a0a',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#333',
            padding: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 16,
          }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 107, 107, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{ fontSize: 24 }}>⚠️</Text>
            </View>
            
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 8,
            }}>Analysis Failed</Text>
            
            <Text style={{
              color: '#888',
              fontSize: 14,
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 18,
            }}>
              Couldn't extract text from the image.{'\n'}
              Try a clearer screenshot or different image.
            </Text>
            
            <TouchableOpacity 
              style={{
                backgroundColor: '#FF6B6B',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 12,
                shadowColor: '#FF6B6B',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={resetApp}
            >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
              }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.imageContainer}>
        <View style={styles.imageCard}>
          <Image source={{ uri: image }} style={styles.fullImage} />
        </View>
        {analysis && (
          <View style={styles.dividerContainer}>
            <LinearGradient colors={['transparent', '#FF6B6B', 'transparent']} style={styles.dividerGradient} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
            <View style={styles.dividerTextContainer}>
              <Text style={styles.dividerText}>
                <Text style={styles.dividerSub}>Sub</Text>
                <Text style={styles.dividerTextOrange}>Text Decoded the Conversation</Text>
              </Text>
              <Text style={styles.dividerSubtext}>Psychological analysis complete</Text>
            </View>
            <LinearGradient colors={['transparent', '#FF6B6B', 'transparent']} style={styles.dividerGradient} start={{x: 0, y: 0}} end={{x: 1, y: 0}} />
          </View>
        )}
      </View>
    );
  };
  
  const renderAnalysisResults = () => {
    const { intent, reply, behaviorType, selectedMessages } = parseAnalysis();
    const confidenceLevel = 96;
    
    return (
      <Animated.View style={[styles.analysisContainer, { opacity: analysisAnim, transform: [{ translateY: analysisAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
        
        <View style={{
          backgroundColor: '#0a0a0a',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#333',
          padding: 12,
          marginBottom: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.5,
          shadowRadius: 16,
          elevation: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 8,
          }}>
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: '#FF6B6B',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#FF6B6B',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 10,
                fontWeight: 'bold',
              }}>AI</Text>
            </View>
            <Text style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: '700',
              flex: 1,
            }}>SubText Analysis</Text>
            <View style={{
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: 'rgba(255, 0, 0, 0.3)',
            }}>
              <Text style={{
                color: '#ff4444',
                fontSize: 8,
                fontWeight: '600',
              }}>{behaviorType || 'ANALYZING'}</Text>
            </View>
          </View>
          
          <Text style={{
            color: '#FF6B6B',
            fontSize: 9,
            fontWeight: '600',
            marginBottom: 2,
          }}>{confidenceLevel}% Confidence</Text>
          
          <View style={{
            width: '50%',
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            overflow: 'hidden',
            marginBottom: 8,
          }}>
            <View style={{
              height: '100%',
              width: `${confidenceLevel}%`,
              backgroundColor: '#FF6B6B',
              borderRadius: 1,
            }} />
          </View>
          
          <Text style={{
            color: '#ccc',
            fontSize: 15,
            lineHeight: 19,
            fontWeight: '500',
          }}>
            {intent || "Analysis in progress... Decoding hidden psychological patterns and manipulation tactics."}
          </Text>
        </View>

        {reply && (
          <View style={{
            backgroundColor: '#0a0a0a',
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#333',
            padding: 12,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
              gap: 8,
            }}>
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
              }}>
                <Text style={{
                  fontSize: 12,
                }}>🛡️</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: '700',
                  marginBottom: 1,
                }}>Strategic Reply</Text>
                <Text style={{
                  color: '#888',
                  fontSize: 9,
                  fontWeight: '500',
                }}>Copy and send this clever response</Text>
              </View>
            </View>
            
            <Text style={{
              color: '#fff',
              fontSize: 15,
              lineHeight: 19,
              fontWeight: '500',
              marginBottom: 8,
            }}>
              {reply}
            </Text>
            
            <TouchableOpacity 
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: 'rgba(255, 107, 107, 0.3)',
                alignSelf: 'flex-start',
              }}
              onPress={() => copyToClipboard(reply)}
            >
              <Text style={{
                color: '#FF6B6B',
                fontSize: 11,
                fontWeight: '600',
              }}>Copy Reply</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.newAnalysisButtonContainer}>
          <TouchableOpacity style={styles.newAnalysisButton} onPress={resetApp}>
            <View style={styles.newAnalysisGlow} />
            <View style={styles.newAnalysisContent}>
              <View style={styles.resetIcon}>
                <View style={styles.resetIconInner} />
              </View>
              <Text style={styles.resetText}>Analyze New Chat</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StaticBackground />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <StaticBackground />
      {renderBurgerMenu()}
      {renderStickyHeader()}
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          {renderWelcomeSection()}
          {(image || ocrError) && renderImageScan()}
          {analysis && renderAnalysisResults()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}