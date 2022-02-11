import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors, Header, Icon, BottomSheet} from 'react-native-elements';
import {
  Avatar,
  Button,
  TextInput,
  List,
  RadioButton,
  Switch,
  IconButton,
  Colors,
} from 'react-native-paper';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function ProductImages({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [uploadImage, setUploadImage] = useState();
  const [images, setImages] = useState(route.params.images);

  const HandleSubmit = val => {
    Alert.alert('Submit Alert', 'Remove Image ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => removeProductImage(val)},
    ]);
  };

  useEffect(() => {
    if (uploadImage) {
      setTimeout(() => {}, 500);
      setBottomSheet(true);
    }
  }, [uploadImage]);

  const chooseProductImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        alert('Storage Error: ');
      } else {
        setUploadImage(response);
      }
    });
  };
  async function removeProductImage(image) {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.id}/images/${image}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        setImages(res.data.data);
      } else if (res.status === 'error') {
        alert('Server Error');
      } else {
        alert('Unauthorized access');
      }
    } catch (error) {
      // console.log(error);
      alert('Something went wrong');
    }
    setIsLoading(false);
  }

  async function uploadProductImage() {
    setIsLoading(true);
    try {
      const data = new FormData();
      if (uploadImage) {
        data.append('images', {
          name: uploadImage.assets[0].fileName,
          type: uploadImage.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? uploadImage.assets[0].uri
              : uploadImage.assets[0].uri.replace('file://', ''),
        });
      }
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      // console.log(data);
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.id}/images`,
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
      // console.log(res.data.data);
      if (res.status === 'success') {
        setBottomSheet(false);
        setImages(res.data.data);
      } else if (res.status === 'error') {
        alert('Server Error');
      } else {
        alert('Unauthorized access');
      }
    } catch (error) {
      // console.log(error);
      alert('Please Try again!');
    }
    setIsLoading(false);
  }

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
          icon: 'close',
          color: 'black',
          size: 28,
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: `${route.params.name}`,
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => chooseProductImage()}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={40}
                icon="image-plus"
                color="black"
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
      <ScrollView>
        <View
          style={{
            width: '100%',
            height: 'auto',
            paddingTop: 10,
            marginTop: 30,
            // borderTopWidth: 1,
            marginBottom: 3,
            // borderTopColor: 'lightgray',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {images.map((val, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: 190,
                height: 140,
                marginBottom: 4,
              }}
              onLongPress={() => HandleSubmit(val)}>
              <Image
                source={{
                  uri: `${global.server}/images/${val}`,
                }}
                style={{
                  width: 190,
                  height: 140,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
            text: 'Add this Image',
            style: {color: 'black', fontSize: 22, justifyContent: 'center'},
          }}
          rightComponent={{
            icon: 'check',
            color: 'black',
            size: 28,
            onPress: () => uploadProductImage(),
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
              uri: uploadImage ? uploadImage.assets[0].uri : '',
            }}
            style={{width: 380, height: 200, marginTop: 20}}
          />
        </View>
      </BottomSheet>
    </>
  );
}
