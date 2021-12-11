import React, {useState} from 'react';
import {View, StyleSheet, Image, NativeModules, ScrollView} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  ActivityIndicator,
  Switch,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

export function DrawerContent(props) {
  const getProfileDiv = () => {
    return (
      <>
        <View>
          <Image
            source={{
              uri: `https://mymodernmet.com/wp/wp-content/uploads/2021/01/diy-leather-craft-projects-and-tools-facebook.jpg`,
            }}
            style={{width: '100%', height: 120}}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            top: 60,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Image
            source={{
              uri: `https://media.istockphoto.com/photos/skilled-leather-manufacture-worker-cutting-some-samples-picture-id1320932798?k=20&m=1320932798&s=612x612&w=0&h=JBxX6sfvXmFqsTYvzdnuh2dv1ZShXB7YBuYqgP5qELA=`,
            }}
            style={{
              width: 100,
              height: 100,
              borderColor: 'white',
              borderWidth: 5,
              borderRadius: 50,
            }}
          />
        </View>
        <Text
          style={{
            // padding: 5,\
            paddingLeft: 70,
            marginTop: 30,
            marginBottom: 15,
            fontSize: 18,
            color: 'rgb(90, 90, 90)',
            textAlign: 'center',
          }}>
          GBD Leathers Admin
        </Text>
      </>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.userInfoSection}>{getProfileDiv()}</View>
      {/* <DrawerContentScrollView> */}
      <ScrollView>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="home" color={color} size={size} />
            )}
            label="Home"
            onPress={() => props.navigation.navigate('NewOrders')}
          />

          <DrawerItem
            icon={({color, size}) => (
              <Icon name="account" color={color} size={size} />
            )}
            label="Profile"
            onPress={() => props.navigation.navigate('Profile')}
          />
        </Drawer.Section>
        <Drawer.Section title="Orders">
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="cart-arrow-down" color={color} size={size} />
            )}
            label="New Orders"
            onPress={() => props.navigation.navigate('NewOrders')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('AllOrders')}
            label="All Orders"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-eye-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('ProcessingOrders')}
            label="Processing Orders"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-check-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('DeliveredOrders')}
            label="Delivered Orders"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-cancel-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('CanceledOrders')}
            label="Canceled Orders"
          />
        </Drawer.Section>

        <Drawer.Section title="WorkShops">
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="cart-arrow-down" color={color} size={size} />
            )}
            label="Workshopa"
            onPress={() => props.navigation.navigate('NewOrders')}
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('AllOrders')}
            label="All Workshops"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-eye-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('ProcessingOrders')}
            label="Processing Workshop"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-check-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('DeliveredOrders')}
            label="Delivered Workshop"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-cancel-outline" color={color} size={size} />
            )}
            onPress={() => props.navigation.navigate('CanceledOrders')}
            label="Canceled Workshop"
          />
        </Drawer.Section>

        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign out"
          />
        </Drawer.Section>
      </ScrollView>
      {/* </DrawerContentScrollView> */}
      {/* <Drawer.Section style={styles.bottomDrawerSection}>
        <TouchableRipple>
          <View style={styles.preference}>
            <Text
              style={{
                color: 'blue',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
              Status
            </Text>
            <View pointerEvents="none">
              <Switch value={true} />
            </View>
          </View>
        </TouchableRipple>
      </Drawer.Section> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 0,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  Caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
