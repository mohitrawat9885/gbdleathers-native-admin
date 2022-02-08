import React, {useState} from 'react';
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
import {colors, Header, Icon} from 'react-native-elements';
import {Avatar, Button, TextInput, List, RadioButton} from 'react-native-paper';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function AddVariant({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);

  const [front_image, setFrontImage] = useState();
  const [back_image, setBackImage] = useState();

  const [name, setName] = useState();

  const [price, setPrice] = useState();
  const [stock, setStock] = useState();

  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Create new Variant ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadProduct()},
    ]);
  };

  async function UploadProduct() {
    try {
      setIsLoading(true);

      const data = new FormData();

      if (front_image) {
        data.append('front_image', {
          name: front_image.assets[0].fileName,
          type: front_image.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? front_image.assets[0].uri
              : front_image.assets[0].uri.replace('file://', ''),
        });
      }
      if (back_image) {
        data.append('back_image', {
          name: back_image.assets[0].fileName,
          type: back_image.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? back_image.assets[0].uri
              : back_image.assets[0].uri.replace('file://', ''),
        });
      }

      if (name) {
        data.append('name', `${name}`);
      }
      if (price) {
        data.append('price', `${price}`);
      }
      if (summary) {
        data.append('summary', summary);
      }
      if (description) {
        data.append('description', description);
      }
      if (stock) {
        data.append('stock', `${stock}`);
      }

      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.product_id}`,
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
      console.log('Responce', res);
      if (res.status === 'success') {
        setName(null);
        setPrice(null);
        setStock(null);
        setFrontImage(null);
        setBackImage(null);
        setSummary(null);
        setDescription(null);
      } else if (res.status === 'faile' || res.status === 'error') {
        alert('Server Error');
      }
      //   console.log(res);
    } catch (error) {
      console.log(error);
      alert('Error');
    }
    setIsLoading(false);
  }

  const ChooseFrontImage = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    } else if (result.error) {
      alert('Problem Picking Image');
      return;
    } else {
      setFrontImage(result);
    }
  };

  const ChooseBackImage = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    } else if (result.error) {
      alert('Problem Picking Image');
      return;
    } else {
      setBackImage(result);
    }
  };

  function RenderFrontImage() {
    if (front_image) {
      return (
        <Image
          source={{
            uri: front_image.assets[0].uri,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            backgroundColor: 'rgb(230, 235, 235)',
            borderColor: 'lightgray',
          }}>
          <Image
            source={require('../../Assets/uploadImage.png')}
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </View>
      );
    }
  }

  function RenderBackImage() {
    if (back_image) {
      return (
        <Image
          source={{
            uri: back_image.assets[0].uri,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            backgroundColor: 'rgb(230, 235, 235)',
            borderColor: 'lightgray',
          }}>
          <Image
            source={require('../../Assets/uploadImage.png')}
            style={{
              width: '40%',
              height: '40%',
            }}
          />
        </View>
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
          text: 'Create New Variant',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => HandleSubmit()}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={40}
                icon="check-bold"
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
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              width: 400,
              marginTop: 10,
              marginBottom: 10,
              height: 400,
            }}
            onPress={() => ChooseFrontImage()}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {RenderFrontImage()}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 400,
              marginTop: 10,
              marginBottom: 10,
              height: 400,
            }}
            onPress={() => ChooseBackImage()}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {RenderBackImage()}
            </View>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            label="Product Name"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={name}
            onChangeText={val => {
              setName(val);
            }}
            underlineColor=""
          />
          <View
            style={{
              width: '92%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={styles.input}
              style={{width: '55%'}}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={price}
              onChangeText={val => {
                setPrice(val);
              }}
              underlineColor=""
              type="number"
              keyboardType={'numeric'}
              label="Price"
            />
            <TextInput
              style={styles.input}
              style={{width: '35%'}}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={stock}
              onChangeText={val => {
                setStock(val);
              }}
              underlineColor=""
              type="number"
              keyboardType={'numeric'}
              label="Stock"
            />
          </View>

          <TextInput
            style={styles.input}
            label="Summary"
            mode="flat"
            multiline={true}
            numberOfLines={7}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={summary}
            onChangeText={val => setSummary(val)}
            underlineColor=""
          />
          <TextInput
            style={styles.input}
            label="Description"
            mode="flat"
            multiline={true}
            numberOfLines={10}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={description}
            onChangeText={val => setDescription(val)}
            underlineColor=""
          />
          <View
            style={{
              height: 100,
              marginBottom: 20,
            }}></View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '96%',
    padding: 8,
    marginTop: 5,
    // height: 50,
    fontSize: 18,
    fontWeight: '500',
  },
});
