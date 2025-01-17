

import { Stack } from 'expo-router';
import { UserProvider } from '@/Contexts/UserContexts';

export default function Layout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen 
          name="signin" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="home"
          options={{
            headerBackVisible: false,
            gestureEnabled: false
          }}
        />
      </Stack>
    </UserProvider>
  );
}