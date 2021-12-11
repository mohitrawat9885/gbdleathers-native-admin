import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import Login from './Screens/Authentication/Login';
import DashBoard from './Screens/DashBoard/DashBoard';
import SplashScreen from './Screens/SplashScreen/SplashScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  if (isLoading) {
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
