import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {Avatar, Button} from 'react-native-paper';
// import {Icon} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header} from 'react-native-elements';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NewOrders from './NewOrders';
import CanceledOrders from './CanceledOrders';
import DeliveredOrders from './DeliveredOrders';
import AllOrders from './AllOrders';
import ProcessingOrders from './ProcessingOrders';

import OrderDetail from './OrderDetail';

const Stack = createNativeStackNavigator();
export default function HomeScreen({navigation}) {
  return (
    <>
      <Stack.Navigator initialRouteName="TodaysOrders">
        <Stack.Screen
          name="NewOrders"
          component={NewOrders}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AllOrders"
          component={AllOrders}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProcessingOrders"
          component={ProcessingOrders}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="DeliveredOrders"
          component={DeliveredOrders}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CanceledOrders"
          component={CanceledOrders}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OrderDetail"
          component={OrderDetail}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
