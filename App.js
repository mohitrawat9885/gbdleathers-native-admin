import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Login from './Screens/Authentication/Login';
import DashBoard from './Screens/DashBoard/DashBoard';
import SplashScreen from './Screens/SplashScreen/SplashScreen';

import EncryptedStorage from 'react-native-encrypted-storage';
import RNRestart from 'react-native-restart';

LogBox.ignoreLogs(['Reanimated 2']);

global.server = 'http://192.168.43.14:8000';

global.token_prefix = 'Bearer';
const Stack = createNativeStackNavigator();
export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  async function retrieveUserSession() {
    try {
      const session = await EncryptedStorage.getItem('user_session');
      if (session) {
        setIsLogin(true);
      } else {
        await EncryptedStorage.clear();
        setIsLogin(false);
      }
      setLoading(false);
    } catch (error) {
      await EncryptedStorage.clear();
      RNRestart.Restart();
      setLoading(false);
    }
  }

  if (isLoading) {
    retrieveUserSession();
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    if (isLogin) {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="DashBoard"
              component={DashBoard}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}
