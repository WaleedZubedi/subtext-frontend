import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signup } from '../lib/api';

export default function SignupScreen() {    const router = useRouter(); // Add this line

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Trim all inputs to remove spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedFullName = fullName.trim();
  
    if (!trimmedEmail || !trimmedPassword || !trimmedFullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    if (trimmedPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
  
    setLoading(true);
    try {
      await signup(trimmedEmail, trimmedPassword, trimmedFullName);
      
      Alert.alert(
        'Success',
        'Account created! Please login.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
      
    } catch (error) {
      console.log('❌ Signup error:', error);
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.logo}>
                <Text style={styles.logoMain}>Sub</Text>
                <Text style={styles.logoOrange}>text</Text>
                <Text style={styles.logoDot}>.</Text>
              </Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF5252']}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => router.push('/login')}              >
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginTextBold}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  logoMain: {
    color: '#fff',
  },
  logoOrange: {
    color: '#FF6B6B',
  },
  logoDot: {
    color: '#FF6B6B',
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#888',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
});