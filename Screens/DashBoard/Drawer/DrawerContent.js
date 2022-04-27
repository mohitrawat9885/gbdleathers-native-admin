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
import EncryptedStorage from 'react-native-encrypted-storage';
import RNRestart from 'react-native-restart';
// import ContactMailIcon from '@mui/icons-material/ContactMail';

async function clearStorage() {
  try {
    await EncryptedStorage.clear();
    RNRestart.Restart();
  } catch (error) {
    RNRestart.Restart();
  }
}

export function DrawerContent(props) {
  const [isLoading, setIsLoading] = useState(true);

  const [frontImage_name, setFrontImageName] = useState('');
  const [backImage_name, setBackImageName] = useState('');

  const [shopName, setShopName] = useState('');

  async function getShopProfile() {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/shop-profile`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      const res = JSON.parse(await response.text());
      // console.log(res);
      if (res.status === 'success') {
        // console.log(res.data);
        setFrontImageName(res.data.front_image);
        setBackImageName(res.data.back_image);
        setShopName(res.data.name);
      } else if (res.status === 'error') {
        alert('Server Error');
      } else {
        alert('Unauthorized access');
      }
      setIsLoading(false);
    } catch (error) {
      // console.log(error);
      setIsLoading(false);
      alert('Something went wrong');
    }
  }

  const getProfileDiv = () => {
    if (isLoading) {
      getShopProfile();
      setIsLoading(false);
    }
    return (
      <>
        <View>
          <Image
            source={{
              uri: `${global.server}/images/${backImage_name}`,
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
              uri: `${global.server}/images/${frontImage_name}`,
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
          {shopName}
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
              <Icon name="calendar" color={color} size={size} />
            )}
            onPress={() => {
              // global.workshopType = 'all';
              props.navigation.navigate('AllWorkshops');
            }}
            label="All Workshops"
          />
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="file-check-outline" color={color} size={size} />
            )}
            onPress={() => {
              // global.workshopType = 'previous';
              props.navigation.navigate('AccomplishedWorkshops');
            }}
            label="Accomplished Workshops"
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="contacts" color={color} size={size} />
            )}
            label="Contact Us"
            onPress={() => props.navigation.navigate('ContactUs')}
          />
        </Drawer.Section>
        <Drawer.Section>
          <DrawerItem
            icon={({color, size}) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign out"
            onPress={() => clearStorage()}
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
