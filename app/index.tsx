import { Image, StyleSheet, Platform } from 'react-native';
import { UserProvider } from '@/Contexts/UserContexts';
import { NavigationContainer } from '@react-navigation/native';
import SignInScreen from '@/components/Signin';
import { SignUpScreen } from '@/components/SIgnup';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from '@/components/Home';
import { registerRootComponent } from 'expo'

const Stack = createStackNavigator();

// export default function App() {
//   return (
    
//     <NavigationContainer>
//       <UserProvider>

//       <Stack.Navigator initialRouteName="Signin">
//         <Stack.Screen name="Signin" component={SignInScreen} />
//         <Stack.Screen name="Signup" component={SignUpScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//       </UserProvider>
//     </NavigationContainer>
 
    
//   );
// }

import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to signin screen
  return <Redirect href="/signin" />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});


