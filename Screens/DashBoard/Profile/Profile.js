import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {Header, BottomSheet} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ALERT_TYPE, Dialog, Root, Toast} from 'react-native-alert-notification';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function Profile({navigation}) {
  const [bottomSheet, setBottomSheet] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [backImage, setBackImage] = useState();
  const [frontImage, setfrontImage] = useState();

  const [shopName, setShopName] = useState();

  const [numbers, setNumbers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [address, setAddress] = useState();

  const [galleryImage, setGalleryImage] = useState();
  const [gallery, setGallery] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    getShopProfile();
    getShopGallary();
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  const HandleSubmit = id => {
    Alert.alert('Submit Alert', 'Remove Image ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => removeGalleryImage(id)},
    ]);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getShopProfile();
      getShopGallary();
    });
    return unsubscribe;
  }, [navigation]);

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
        setfrontImage(res.data.front_image);
        setBackImage(res.data.back_image);
        setShopName(res.data.name);
        setEmails(res.data.emails);
        setNumbers(res.data.numbers);
        setAddress(res.data.address);
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
    setIsLoading(false);
  }

  async function getShopGallary() {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/shop-profile/gallary`,
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
        setGallery(res.data);
      } else if (res.status === 'error') {
        alert('Server Error');
      } else {
        alert('Unauthorized access');
      }

      // console.log(res);
    } catch (error) {
      // console.log(error);
      alert('Something went wrong');
    }
    setIsLoading(false);
  }

  async function removeGalleryImage(id) {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/shop-profile/gallary/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      if (response.status === 204) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Gallary Image is removed!',
        });
        getShopGallary();
      } else {
        // const res = JSON.parse(await response.text());
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: 'Failed to remove Gallary Image. Try again!',
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Something went wrong or Internet is disconnected!',
      });
    }
    setIsLoading(false);
  }

  async function uploadShopGallary() {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const data = new FormData();
      if (galleryImage) {
        data.append('photo', {
          name: galleryImage.assets[0].fileName,
          type: galleryImage.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? galleryImage.assets[0].uri
              : galleryImage.assets[0].uri.replace('file://', ''),
        });
      }
      // console.log(data);
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/shop-profile/gallary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
          body: data,
        },
      );
      const res = JSON.parse(await response.text());
      // console.log(res);
      if (res.status === 'success') {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Shop Gallary Image is added successfully!',
        });
        setBottomSheet(false);
        getShopGallary();
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: 'Failed to add Gallary Image. Try again!',
        });
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Something went wrong or Internet is disconnected!',
      });
    }
    setIsLoading(false);
  }

  const chooseGalleryImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        // console.log(response.error);
        alert('Storage Error: ');
      } else {
        setGalleryImage(response);
        setBottomSheet(true);
      }
    });
  };

  function LoadingPage() {
    if (isLoading) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, .8)',
            zIndex: 100,
            position: 'absolute',
          }}>
          <ActivityIndicator size={45} color="black" />
        </View>
      );
    } else {
      return <></>;
    }
  }

  return (
    <>
      <Header
        backgroundColor="lightgray"
        barStyle="dark-content"
        placement="left"
        leftComponent={{
          icon: 'menu',
          color: 'black',
          size: 28,
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{
          text: 'Profile',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        //   rightComponent={{ icon: 'home', color: 'gray', size: 27 }, { icon: 'menu', color: 'gray', size: 27 }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="file-document-edit-outline"
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => chooseGalleryImage()}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="image-plus"
                color="gray"
              />
            </TouchableOpacity>
          </View>
        }
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <LoadingPage />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'white',
          paddingBottom: 200,
        }}>
        <View
          style={{
            height: 240,
          }}>
          <View style={{backgroundColor: 'lightgray'}}>
            <Image
              source={{
                uri: `${global.server}/images/${backImage}`,
              }}
              style={{width: 370, height: 190}}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 110,
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: `${global.server}/images/${frontImage}`,
              }}
              style={{
                width: 130,
                height: 130,
                borderColor: 'white',
                borderWidth: 5,
                shadowColor: 'gray',
                borderRadius: 70,
                backgroundColor: 'lightgray',
              }}
            />
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 20,
              fontSize: 20,
              textAlign: 'center',
            }}>
            {shopName}
          </Text>
        </View>
        {numbers.map((num, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 300,
            }}>
            <Avatar.Icon
              style={{backgroundColor: 'white'}}
              size={30}
              icon="phone"
              color="blue"
            />
            <Text style={{fontSize: 14}}>{num}</Text>
          </View>
        ))}
        {emails.map((email, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: 300,
            }}>
            <Avatar.Icon
              style={{backgroundColor: 'white'}}
              size={28}
              icon="email"
              color="blue"
            />
            <Text style={{fontSize: 14}}>{email}</Text>
          </View>
        ))}

        <View
          style={{
            width: 200,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Avatar.Icon
            style={{backgroundColor: 'white'}}
            size={30}
            icon="map-marker-radius"
            color="blue"
          />
          <Text style={{fontSize: 14, textAlign: 'center'}}>{address}</Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 'auto',
            paddingTop: 10,
            marginTop: 30,
            borderTopWidth: 1,
            marginBottom: 3,
            borderTopColor: 'lightgray',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {gallery.map((val, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: 190,
                height: 140,
                marginBottom: 4,
              }}
              onLongPress={() => HandleSubmit(val._id)}>
              <Image
                source={{
                  uri: `${global.server}/images/${val.image}`,
                }}
                style={{
                  width: 190,
                  height: 140,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <BottomSheet isVisible={bottomSheet}>
          <Header
            backgroundColor="lightgray"
            barStyle="dark-content"
            placement="left"
            leftComponent={{
              icon: 'close',
              color: 'black',
              size: 28,
              onPress: () => setBottomSheet(false),
            }}
            centerComponent={{
              text: 'Add to Shop Gallery',
              style: {color: 'black', fontSize: 22, justifyContent: 'center'},
            }}
            rightComponent={{
              icon: 'check',
              color: 'black',
              size: 28,
              onPress: () => uploadShopGallary(),
            }}
            containerStyle={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <View
            style={{
              width: '100%',
              flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
              height: 350,
              backgroundColor: 'rgb(240, 240, 240)',
            }}>
            <Image
              source={{
                uri: galleryImage ? galleryImage.assets[0].uri : '',
              }}
              style={{width: 380, height: 200, marginTop: 20}}
            />
          </View>
        </BottomSheet>
      </ScrollView>
    </>
  );
}
