import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const PAYPAL_CLIENT_ID = 'AQkBJ3wyz9rRNdY36CFMsaQpchZTrqgaRPQgXA1zPtfnUVhVA4BeV75KIG7ikzGWBgYfRn8NULl2Ivqj';
const API_BASE_URL = 'https://subtext-backend-f8ci.vercel.app/api';

export default function PayPalButton({ planId, tier, onSuccess, onError }) {
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;

    script.onload = () => {
      setSdkReady(true);
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      if (onError) {
        onError(new Error('Failed to load PayPal SDK'));
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (sdkReady && buttonContainerRef.current && window.paypal) {
      renderPayPalButton();
    }
  }, [sdkReady, planId]);

  const renderPayPalButton = () => {
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '';
    }

    window.paypal
      .Buttons({
        style: {
          shape: 'rect',
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe',
        },

        createSubscription: function (data, actions) {
          setLoading(true);

          return actions.subscription.create({
            plan_id: planId,
          });
        },

        onApprove: async function (data) {
          console.log('Subscription approved:', data.subscriptionID);

          try {
            const token = await SecureStore.getItemAsync('userToken');

            if (!token) {
              throw new Error('Not authenticated');
            }

            const response = await fetch(`${API_BASE_URL}/subscriptions/create`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subscriptionId: data.subscriptionID,
                tier: tier,
              }),
            });

            const result = await response.json();

            if (!response.ok) {
              throw new Error(result.message || 'Failed to activate subscription');
            }

            console.log('Subscription activated:', result);
            setLoading(false);

            if (onSuccess) {
              onSuccess(result);
            }
          } catch (error) {
            console.error('Subscription activation error:', error);
            setLoading(false);

            if (onError) {
              onError(error);
            }
          }
        },

        onError: function (err) {
          console.error('PayPal error:', err);
          setLoading(false);

          if (onError) {
            onError(err);
          }
        },

        onCancel: function () {
          console.log('PayPal subscription cancelled by user');
          setLoading(false);
        },
      })
      .render(buttonContainerRef.current);
  };

  if (!sdkReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#0070ba" />
        <Text style={styles.loadingText}>Loading PayPal...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div ref={buttonContainerRef} style={{ width: '100%' }} />
      {loading && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  processingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 14,
  },
});
