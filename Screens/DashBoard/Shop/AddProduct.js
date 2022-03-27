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
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';

export default function AddProduct({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [front_image, setFrontImage] = useState();
  const [back_image, setBackImage] = useState();

  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('No Category');

  const [name, setName] = useState();
  const [nameError, setNameError] = useState();

  const [price, setPrice] = useState();
  const [stock, setStock] = useState();

  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Create new Product ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadProduct()},
    ]);
  };

  async function UploadProduct() {
    if (!name) {
      setNameError(true);
      return;
    }

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
      if (categoryId) {
        data.append('category', categoryId);
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
        data.append('stock', stock);
      }

      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product`,
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
      if (res.status === 'success') {
        setName(null);
        setPrice(null);
        setStock(null)
        setFrontImage(null);
        setBackImage(null);
        setSummary(null);
        setDescription(null);
        setCategoryId('');
        setCategoryName('No Category');

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'New Product is Created Successfully!',
          button: 'close',
        })
      } else if (res.status === 'error') {
        // console.log(res);
        // alert('Server Error');
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: res.message,
          button: 'close',
        })

      }
    } catch (error) {
      // console.log(error);
      alert('Error');
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed!',
        textBody: 'Something went wrong or Internet not connected!',
      })
    }
    setIsLoading(false);
  }

  const getAllCategorys = async () => {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/category`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        setCategoryList(res.data);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      setCategoryList([]);
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllCategorys();
      // getCategoryProductList();
    });
    return unsubscribe;
  }, [navigation]);

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
          text: 'Create New Product',
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
            error={nameError}
            label="Product Name"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            // underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={name}
            onChangeText={val => {
              setName(val);
              setNameError(false);
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
              // style={styles.input}
              style={{width: '55%', 
              padding: 8,
              marginTop: 5,
              fontSize: 18,
              fontWeight: '500',}}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              // underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={price}
              onChangeText={val => {
                setPrice(val);
              }}
              // underlineColor=""
              type="number"
              keyboardType={'numeric'}
              label="Price"
            />
            <TextInput
              // style={styles.input}
              style={{width: '35%',  
              padding: 8,
              marginTop: 5,
              fontSize: 18,
              fontWeight: '500'
            }}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              // underlineColor="gray"
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
            // mode="flat"
            multiline={true}
            numberOfLines={7}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            // underlineColor="gray"
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
            // mode="flat"
            multiline={true}
            numberOfLines={10}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            // underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={description}
            onChangeText={val => setDescription(val)}
            underlineColor=""
          />
          <View style={styles.categoryList}>
            <List.Section
              title={`Category :- ${categoryName}`}
              titleStyle={{color: 'black', fontSize: 17}}>
              <List.Accordion
                titleStyle={{color: 'black', fontSize: 18}}
                title="Select Category"
                left={props => (
                  <List.Icon {...props} color="black" icon="view-list" />
                )}>
                <RadioButton.Group value={categoryId}>
                  <View>
                    <RadioButton.Item
                      label="No Category"
                      value={''}
                      color="red"
                      onPress={() => {
                        setCategoryName('No Category');
                        setCategoryId('');
                      }}
                    />
                    {categoryList.map(data => (
                      <RadioButton.Item
                        key={data.name}
                        label={data.name}
                        value={data._id}
                        color="green"
                        onPress={() => {
                          setCategoryId(data._id);
                          setCategoryName(data.name);
                        }}
                      />
                    ))}
                  </View>
                </RadioButton.Group>
              </List.Accordion>
            </List.Section>
          </View>
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
  categoryList: {
    width: '92%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 25,
    backgroundColor: 'rgb(230, 229, 231)',
    marginBottom: 100,
  },
});
