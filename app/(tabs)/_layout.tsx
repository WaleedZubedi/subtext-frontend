// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'SubText',
          tabBarStyle: { display: 'none' }, // Hide tab bar since it's a single screen app
        }} 
      />
    </Tabs>
  );
}