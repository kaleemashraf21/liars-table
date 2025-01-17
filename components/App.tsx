import 'expo-dev-client';
import { registerRootComponent } from 'expo';
import React, { StrictMode } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { GetDeck } from './Components/card';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { DrawButton } from './Components/DrawCard';
import { HandProvider } from './Contexts/PlayerHandContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PlayingTable from './Components/PlayingTable';"android.permission.INTERNET"
import SignInScreen from './Components/Signin';
import {SignUpScreen} from './Components/SIgnup';
import {NavigationContainer} from '@react-navigation/native';
import { UserProvider } from './Contexts/UserContexts';
import HomeScreen from './Components/Home';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


function App(): React.JSX.Element {


 
    return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn">
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    );
  
  
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor:"#fff",
    flex: 1

  },
  tableContainer:{
    marginTop: 50,
    flex: 1
    //justifyContent: 'center',
    // alignItems: 'center'
    
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
registerRootComponent(App);
export default App;
