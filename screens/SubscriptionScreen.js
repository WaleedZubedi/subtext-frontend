import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = 'https://subtext-backend-f8ci.vercel.app/api';
const PAYPAL_CLIENT_ID = 'AQkBJ3wyz9rRNdY36CFMsaQpchZTrqgaRPQgXA1zPtfnUVhVA4BeV75KIG7ikzGWBgYfRn8NULl2Ivqj'; // TODO: Replace with actual ID

export default function SubscriptionScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/plans`);
      const data = await response.json();

      if (data.success) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      Alert.alert('Error', 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);

    // On web, we'll use PayPal's JavaScript SDK
    if (Platform.OS === 'web') {
      initiatePayPalWeb(plan);
    } else {
      Alert.alert('Note', 'This app is now web-only. Please visit our website to subscribe.');
    }
  };

  const initiatePayPalWeb = (plan) => {
    // This function will be called when PayPal SDK is loaded
    // The actual PayPal button rendering happens in the web-specific component below
    console.log('Selected plan:', plan);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#000000', '#1a0033', '#000000']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock the power of AI conversation analysis
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={() => handleSelectPlan(plan)}
              isPopular={plan.id === 'pro'}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            • Cancel anytime, no questions asked
          </Text>
          <Text style={styles.footerText}>
            • Secure payment powered by PayPal
          </Text>
          <Text style={styles.footerText}>
            • Instant access after purchase
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function PlanCard({ plan, onSelect, isPopular }) {
  return (
    <TouchableOpacity
      style={[styles.planCard, isPopular && styles.popularCard]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <Text style={styles.planName}>{plan.name}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.currency}>$</Text>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.period}>/month</Text>
      </View>

      <Text style={styles.limitText}>
        {plan.limit === -1 ? 'Unlimited' : plan.limit} analyses per month
      </Text>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {/* PayPal button will be rendered here on web */}
        <TouchableOpacity style={styles.selectButton} onPress={onSelect}>
          <Text style={styles.selectButtonText}>Select Plan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  plansContainer: {
    gap: 20,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  popularCard: {
    borderColor: '#6200ea',
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#6200ea',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 8,
  },
  currency: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  period: {
    fontSize: 18,
    color: '#aaa',
  },
  limitText: {
    fontSize: 16,
    color: '#6200ea',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    color: '#6200ea',
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  buttonContainer: {
    marginTop: 8,
  },
  selectButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    gap: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
