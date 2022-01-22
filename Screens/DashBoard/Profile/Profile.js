import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Header, BottomSheet} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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
      console.log(res);
      if (res.status === 'success') {
        console.log(res.data);
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
      console.log(error);
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

      console.log(res);
    } catch (error) {
      console.log(error);
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
        getShopGallary();
      } else {
        const res = JSON.parse(await response.text());
        if (res.status === 'error') {
          alert('Server Error');
        } else {
          alert('Unauthorized access');
        }
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
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
      console.log(res);
      if (res.status === 'success') {
        setBottomSheet(false);
        getShopGallary();
      } else if (res.status === 'error') {
        alert('Server Error');
      } else {
        alert('Unauthorized access');
      }
    } catch (error) {
      console.log(error);
      alert('Error');
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
                uri: `https://media.istockphoto.com/photos/many-tools-of-the-leather-craftsman-picture-id1297871891?b=1&k=20&m=1297871891&s=170667a&w=0&h=l1_XbtJtuI9jcjEcRZ3lyn3v8GAkogWKn2iWaQEORNo=`,
              }}
              style={{width: 380, height: 200}}
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
                uri: `https://diyprojects.com/wp-content/uploads/2020/12/man-working-leather-using-crafting-diy-leather-craft-SS-Featured-1.jpg`,
              }}
              style={{
                width: 140,
                height: 140,
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
              fontSize: 23,
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
              size={38}
              icon="phone"
              color="blue"
            />
            <Text style={{fontSize: 16}}>{num}</Text>
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
              size={38}
              icon="email"
              color="blue"
            />
            <Text style={{fontSize: 16}}>{email}</Text>
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
            size={38}
            icon="map-marker-radius"
            color="blue"
          />
          <Text style={{fontSize: 16, textAlign: 'center'}}>{address}</Text>
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
              onLongPress={() => removeGalleryImage(val._id)}>
              <Image
                source={{
                  uri: `https://diyprojects.com/wp-content/uploads/2020/12/man-working-leather-using-crafting-diy-leather-craft-SS-Featured-1.jpg`,
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
