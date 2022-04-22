import 'react-native-gesture-handler';
import React, {Component, useState, useRef} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {Avatar} from 'react-native-paper';
import {DrawerContent} from './Drawer/DrawerContent';

import Orders from './Orders/Orders';
import Workshops from './Workshops/Workshops';
import Shop from './Shop/Shop';
import Profile from './Profile/Profile';

import AddProduct from './Shop/AddProduct';
import AddCategory from './Shop/AddCategory';
import EditProduct from './Shop/EditProduct';
import EditCategory from './Shop/EditCategory';

import EditProfile from './Profile/EditProfile';
import ProductImages from './Shop/ProductImages';
import AddVariant from './Shop/AddVariant';
import EditVariant from './Shop/EditVariant';

import CreateWorkshop from './Workshops/CreateWorkshop';
import EditWorkshop from './Workshops/EditWorkshop';
import WorkshopDetail from './Workshops/WorkshopDetail';
import WorkshopGallary from './Workshops/WorkshopGallary';

const Tab = createBottomTabNavigator();
function DashHomeTab({route, navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName, size2;
          if (route.name === 'Home') {
            iconName = 'home';
            size2 = focused ? 49 : 35;
          } else if (route.name === 'WorkShops') {
            iconName = 'battlenet';
            size2 = focused ? 49 : 35;
          } else if (route.name === 'Shop') {
            iconName = 'store';
            size2 = focused ? 49 : 35;
          } else if (route.name === 'Profile') {
            iconName = 'account';
            size2 = focused ? 49 : 35;
          }
          return (
            <Avatar.Icon
              size={size2}
              icon={iconName}
              color={color}
              backgroundColor="transparent"
            />
          );
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Home"
        component={Orders}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="WorkShops"
        component={Workshops}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Shop"
        component={Shop}
        navigation
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function DashHome({route, navigation}) {
  const [dashHomeTitle, setDashHomeTitle] = useState('GBD Leathers');
  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={'DashHomeTab'}
        component={DashHomeTab}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function Dashboard({navigation}) {
  return (
    <>
      <Stack.Navigator initialRouteName="DashHome">
        <Stack.Screen
          name="DashHome"
          component={DashHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddProduct"
          component={AddProduct}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddCategory"
          component={AddCategory}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProduct"
          component={EditProduct}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditCategory"
          component={EditCategory}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProductImages"
          component={ProductImages}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AddVariant"
          component={AddVariant}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditVariant"
          component={EditVariant}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateWorkshop"
          component={CreateWorkshop}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditWorkshop"
          component={EditWorkshop}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="WorkshopDetail"
          component={WorkshopDetail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="WorkshopGallary"
          component={WorkshopGallary}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
