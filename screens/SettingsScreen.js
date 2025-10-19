import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getToken, logout } from '../lib/api';

const API_BASE_URL = 'https://subtext-backend-f8ci.vercel.app/api';
export default function SettingsScreen() {
  const router = useRouter();
  const { user, logoutUser, hasSubscription } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [pressedItem, setPressedItem] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/subscription/status`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setSubscriptionStatus(data.hasSubscription);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
        setSubscriptionStatus(false);
      }
    };
    fetchSubscription();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              await logoutUser();
              // Force navigation after state is cleared
              setTimeout(() => {
                router.replace('/login');
              }, 100);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    // DEV-ONLY BUTTONS (hidden in production)
    ...(__DEV__ ? [
      {
        key: 'reset_onboarding',
        icon: '🔄',
        title: 'Reset Onboarding (DEV)',
        subtitle: 'Clear onboarding flag',
        color: '#FF6B6B',
        action: async () => {
          try {
            await SecureStore.deleteItemAsync('hasSeenOnboarding');
            Alert.alert('Success', 'Onboarding reset! Close and restart the app to see it.');
          } catch (error) {
            Alert.alert('Error', 'Failed to reset onboarding');
          }
        }
      },
      {
        key: 'clear_all',
        icon: '💣',
        title: 'CLEAR ALL DATA (DEBUG)',
        subtitle: 'Wipe everything',
        color: '#FF0000',
        action: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userData');
          await SecureStore.deleteItemAsync('hasSeenOnboarding');
          await SecureStore.deleteItemAsync('hasSubscription');
          Alert.alert('Cleared!', 'All data wiped. Restart app.');
        }
      }
    ] : []),
    
    // PRODUCTION MENU ITEMS
    {
      key: 'subscription',
      icon: '💎',
      title: 'Subscription',
      subtitle: subscriptionStatus ? 'Premium • Active' : 'Free • Upgrade Available',
      color: subscriptionStatus ? '#FFD700' : '#FF6B6B',
      action: () => Alert.alert(
        'Subscription Status', 
        subscriptionStatus ? 'You have an active premium subscription!' : 'Upgrade to premium to unlock all features!'
      )
    },
    {
      key: 'history',
      icon: '📜',
      title: 'Analysis History',
      subtitle: 'View past analyses',
      color: '#FF6B6B',
      action: () => Alert.alert('Coming Soon', 'History feature coming soon!')
    },
    {
      key: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage alerts',
      color: '#4ECDC4',
      action: () => Alert.alert('Coming Soon', 'Notifications settings coming soon!')
    },
    {
      key: 'privacy',
      icon: '🔒',
      title: 'Privacy & Security',
      subtitle: 'Your data is safe',
      color: '#95E1D3',
      action: () => Alert.alert('Privacy', 'Your conversations are processed securely and not stored permanently.')
    },
    {
      key: 'about',
      icon: 'ℹ️',
      title: 'About SubText',
      subtitle: 'Version 1.0.0',
      color: '#A8E6CF',
      action: () => Alert.alert('About', 'SubText uses advanced AI to decode hidden intentions in conversations.\n\nVersion 1.0.0')
    },
    {
      key: 'support',
      icon: '💬',
      title: 'Help & Support',
      subtitle: 'Get assistance',
      color: '#FFD3B6',
      action: () => Alert.alert('Support', 'Email: support@subtext.app\nWe typically respond within 24 hours.')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E8E']}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0)?.toUpperCase() || user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{user?.fullName || user?.full_name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  pressedItem === item.key && styles.menuItemPressed
                ]}
                onPress={item.action}
                onPressIn={() => setPressedItem(item.key)}
                onPressOut={() => setPressedItem(null)}
              >
                <View style={[styles.menuIcon, { backgroundColor: `${item.color}20` }]}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <View style={styles.logoutIcon}>
              <Text style={styles.logoutIconText}>🚪</Text>
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Made with 🔥 by SubText
            </Text>
            <Text style={styles.footerSubtext}>
              Decode every conversation
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: -2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
  menuSection: {
    gap: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ scale: 0.98 }],
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    color: '#888',
    fontSize: 13,
  },
  chevron: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutIconText: {
    fontSize: 18,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#444',
    fontSize: 12,
    fontStyle: 'italic',
  },
});