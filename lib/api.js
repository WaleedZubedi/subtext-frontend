import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://subtext-backend-f8ci.vercel.app/api';

// Token management
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync('userToken', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// User data management
export const saveUserData = async (userData) => {
  try {
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

export const getUserData = async () => {
  try {
    const data = await SecureStore.getItemAsync('userData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Subscription management
export const saveSubscriptionStatus = async (hasSubscription) => {
  try {
    await SecureStore.setItemAsync('hasSubscription', hasSubscription.toString());
  } catch (error) {
    console.error('Error saving subscription status:', error);
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const status = await SecureStore.getItemAsync('hasSubscription');
    return status === 'true';
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return false; // Default to no subscription
  }
};

export const removeSubscriptionStatus = async () => {
  try {
    await SecureStore.deleteItemAsync('hasSubscription');
  } catch (error) {
    console.error('Error removing subscription status:', error);
  }
};






// Auth API calls
export const signup = async (email, password, fullName) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, fullName }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Use details if available, otherwise use error
    const errorMessage = data.details || data.error || 'Signup failed';
    throw new Error(errorMessage);
  }
  
  // Save token if session exists
  if (data.session?.accessToken) {
    await saveToken(data.session.accessToken);
  }
  
  // Save user data if user exists
  if (data.user) {
    await saveUserData(data.user);
  }
  
  return data;
};
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Save token
  if (data.session?.accessToken) {
    await saveToken(data.session.accessToken);
  }
  
  // Save user data
  if (data.user) {
    await saveUserData(data.user);
  }
  
  return data;
};

export const logout = async () => {
  const token = await getToken();
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  // Remove both token and user data
  await removeToken();
  await removeUserData();
};



// OCR with auth
export const analyzeImage = async (imageAsset) => {
  const token = await getToken();
  
  if (!token) {
    throw new Error('No authentication token');
  }

  const formData = new FormData();
  formData.append('image', {
    uri: imageAsset.uri,
    type: imageAsset.mimeType || 'image/jpeg',
    name: imageAsset.fileName || 'image.jpg',
  });

  const response = await fetch(`${API_BASE_URL}/ocr`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Analysis failed');
  }
  
  return data;
};

// Onboarding tracking
export const hasSeenOnboarding = async () => {
  try {
    const value = await SecureStore.getItemAsync('hasSeenOnboarding');
    return value === 'true';
  } catch (error) {
    return false;
  }
};

export const markOnboardingComplete = async () => {
  try {
    await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
  } catch (error) {
    console.error('Error marking onboarding complete:', error);
  }
};