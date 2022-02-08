import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Header, BottomSheet, Icon, Input} from 'react-native-elements';
import {Avatar, Button, TextInput} from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import {TouchableOpacity} from 'react-native-gesture-handler';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function Profile({navigation}) {
  // const data = new FormData();
  const [isLoading, setIsLoading] = useState(true);
  const [backImage, setBackImage] = useState();
  const [frontImage, setfrontImage] = useState();

  const [frontImage_name, setFrontImageName] = useState();
  const [backImage_name, setBackImageName] = useState();

  const [shopName, setShopName] = useState();

  const [numbers, setNumbers] = useState([]);
  const [emails, setEmails] = useState([]);
  const [address, setAddress] = useState();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getShopProfile();
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
        setFrontImageName(res.data.front_image);
        setBackImageName(res.data.back_image);
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
  }

  async function updateShopProfile() {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const data = new FormData();
      if (frontImage) {
        data.append('front_image', {
          name: frontImage.assets[0].fileName,
          type: frontImage.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? frontImage.assets[0].uri
              : frontImage.assets[0].uri.replace('file://', ''),
        });
      }
      if (backImage) {
        data.append('back_image', {
          name: backImage.assets[0].fileName,
          type: backImage.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? backImage.assets[0].uri
              : backImage.assets[0].uri.replace('file://', ''),
        });
      }
      data.append('name', shopName);
      data.append('address', address);

      if (!emails[0]) {
        data.append('emails[]', '');
        console.log('email null');
      } else {
        emails.forEach(item => data.append('emails[]', item));
      }
      if (!numbers[0]) {
        data.append('numbers[]', '');
        console.log('Number null');
      } else {
        numbers.forEach(item => data.append('numbers[]', item));
      }

      // console.log(data);
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/shop-profile`,
        {
          method: 'PATCH',
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

  const chooseBackImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else {
        // createFormData('back_image', response);
        setBackImage(response);
      }
    });
  };
  const chooseFrontImage = () => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else {
        // createFormData('front_image', response);
        setfrontImage(response);
      }
    });
  };
  function renderBackImage() {
    if (backImage) {
      return (
        <Image
          source={{uri: backImage.assets[0].uri}}
          style={{width: 380, height: 200}}
        />
      );
    } else {
      return (
        <Image
          source={{
            uri: `${global.server}/images/${backImage_name}`,
          }}
          style={{width: 380, height: 200}}
        />
      );
    }
  }
  function renderFrontImage() {
    if (frontImage) {
      return (
        <Image
          source={{uri: frontImage.assets[0].uri}}
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            borderWidth: 5,
            borderColor: 'white',
          }}
        />
      );
    } else {
      return (
        <Image
          source={{
            uri: `${global.server}/images/${frontImage_name}`,
          }}
          style={{
            width: 140,
            height: 140,
            borderRadius: 70,
            borderWidth: 5,
            borderColor: 'white',
          }}
        />
      );
    }
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
          text: 'Edit Profile',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                updateShopProfile();
              }}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={40}
                icon="check-bold"
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
          paddingBottom: 40,
        }}>
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            height: '100%',
          }}>
          <View
            style={{
              height: 255,
            }}>
            <View>
              <TouchableOpacity
                style={{width: 380, height: 200, backgroundColor: 'lightgray'}}
                onPress={() => chooseBackImage()}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {renderBackImage()}
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                top: 110,
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => chooseFrontImage()}>
                {renderFrontImage()}
              </TouchableOpacity>
            </View>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 320,
                marginTop: 14,
                marginBottom: 20,
                // fontSize: 22,
                // textAlign: 'center',
              }}>
              <Input
                placeholder="Shop Name"
                value={shopName}
                multiline={true}
                fontSize={22}
                onChangeText={val => setShopName(val)}
                textAlign="center"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  margin: 5,
                  marginBottom: 8,
                  width: 300,
                }}>
                Public Numbers.
              </Text>
            </View>

            {/* <Text style={{fontSize: 16}}>+91-7895995686</Text> */}

            {numbers.map((val, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 180,
                }}>
                <Avatar.Icon
                  style={{backgroundColor: 'white'}}
                  size={38}
                  icon="phone"
                  color="blue"
                />
                <Input
                  placeholder="Public Number"
                  value={numbers[index]}
                  fontSize={16}
                  textAlign="center"
                  onChangeText={val => {
                    let newNum = [];
                    numbers[index] = val;
                    for (let i = 0; i < numbers.length; i++) {
                      newNum[i] = numbers[i];
                    }
                    setNumbers(newNum);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    let newNum = [];

                    // numbers[numbers.length] = '';
                    let indi = 0;
                    for (let i = 0; i < numbers.length; i++) {
                      if (i != index) newNum[indi++] = numbers[i];
                    }
                    setNumbers(newNum);
                  }}>
                  <Avatar.Icon
                    style={{backgroundColor: 'lightgray'}}
                    size={30}
                    icon="minus"
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={{width: 220, marginBottom: 16}}>
              <Button
                icon="plus"
                mode="outlined"
                color="gray"
                onPress={() => {
                  let newNum = [];
                  numbers[numbers.length] = '';
                  for (let i = 0; i < numbers.length; i++) {
                    newNum[i] = numbers[i];
                  }
                  setNumbers(newNum);
                }}>
                Add New Number
              </Button>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  margin: 5,
                  marginBottom: 8,
                  width: 300,
                }}>
                Public E-mails.
              </Text>
            </View>

            {emails.map((val, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 280,
                }}>
                <Avatar.Icon
                  style={{backgroundColor: 'white'}}
                  size={38}
                  icon="email"
                  color="blue"
                />
                <Input
                  placeholder="Public Email"
                  value={emails[index]}
                  fontSize={16}
                  textAlign="center"
                  onChangeText={val => {
                    let newEmails = [];
                    emails[index] = val;
                    for (let i = 0; i < emails.length; i++) {
                      newEmails[i] = emails[i];
                    }
                    setEmails(newEmails);
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    let newEmails = [];
                    // numbers[numbers.length] = '';
                    let indi = 0;
                    for (let i = 0; i < emails.length; i++) {
                      if (i != index) newEmails[indi++] = emails[i];
                    }
                    setEmails(newEmails);
                  }}>
                  <Avatar.Icon
                    style={{backgroundColor: 'lightgray'}}
                    size={30}
                    icon="minus"
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            ))}
            <View style={{width: 220, marginBottom: 16}}>
              <Button
                icon="plus"
                mode="outlined"
                color="gray"
                onPress={() => {
                  let newEmails = [];
                  emails[emails.length] = '';
                  for (let i = 0; i < emails.length; i++) {
                    newEmails[i] = emails[i];
                  }
                  setEmails(newEmails);
                }}>
                Add New Email
              </Button>
            </View>

            <View
              style={{
                flexDirection: 'column',
                // justifyContent: 'center',
                width: 330,
              }}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="map-marker-radius"
                color="blue"
              />

              <View
                style={{
                  width: 340,
                }}>
                <TextInput
                  placeholder="Shop Address"
                  label="Address"
                  multiline={true}
                  value={address}
                  onChangeText={val => setAddress(val)}
                  fontSize={16}
                  textAlign="center"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
