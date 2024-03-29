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
import { ALERT_TYPE, Dialog, Root, Toast } from 'react-native-alert-notification';

export default function EditVariant({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  // const [isBottomLoading, setIsBottomLoading] = useState(false);
  // const [categoryList, setCategoryList] = useState([]);

  const [front_image, setFrontImage] = useState();
  const [back_image, setBackImage] = useState();

  const [frontImageName, setFrontImageName] = useState();
  const [backImageName, setBackImageName] = useState();

  // const [categoryId, setCategoryId] = useState('');
  // const [categoryName, setCategoryName] = useState('No Category');

  const [name, setName] = useState();
  // const [nameError, setNameError] = useState();

  const [price, setPrice] = useState();
  const [stock, setStock] = useState();

  const [images, setImages] = useState([]);

  const [active, setActive] = useState(false);
  const toggleSwitch = () => setActive(previousState => !previousState);

  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  // const [variants, setVariants] = useState([]);

  const [multi_properties, setMultiProperties] = useState([]);
  const [properties, setProperties] = useState([]);

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Product ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadProduct()},
    ]);
  };

  const handleVariantDelete = () => {
    Alert.alert('Delete Alert', 'Delete permanently ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => DeleteVariant()},
    ]);
  };

  async function DeleteVariant() {
    try {
      setIsLoading(true);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variant_id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      if (response.status === 204) {
        navigation.goBack();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Variant is Removed!',
          button: 'close',
        })
        return;
      }
      const res = JSON.parse(await response.text());
      // console.log(res);
      // alert('Try again!', res.message);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed!',
        textBody: 'Try again!',
        button: 'close',
      })
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed!',
        textBody: 'Try again!',
        button: 'close',
      })
    }
    setIsLoading(false);
  }

  async function UploadProduct() {
    // if (!name) {
    //   setNameError(true);
    //   return;
    // }

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
        data.append('stock', stock);
      }
      if (active == true || active == false) {
        data.append('active', active);
      }
      if (multi_properties.length > 0) {
        let newMultiProperties = {};
        for (let i in multi_properties) {
          newMultiProperties[multi_properties[i].name] =
            multi_properties[i].value;
        }

        data.append('multi_properties', JSON.stringify(newMultiProperties));
      }

      if (properties.length > 0) {
        let newProperties = {};
        for (let i in properties) {
          newProperties[properties[i].name] = properties[i].value;
        }
        data.append('properties', JSON.stringify(newProperties));
      }
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variant_id}`,
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
      if (res.status === 'success') {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Variant is Updated!',
          button: 'close',
        })
        
      } else if (res.status === 'error') {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: res.message,
          button: 'close',
        })
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: "Something went wrong or Internet is disconnected!",
        button: 'close',
      })
    }
    setIsLoading(false);
  }

  const getProduct = async () => {
    try {
      setIsLoading(true);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variant_id}`,
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
        // setCategoryId(res.data.category._id);
        // setCategoryName(res.data.category.name);
        setFrontImageName(res.data.front_image);
        setBackImageName(res.data.back_image);
        setName(res.data.name);
        setPrice(isNaN(res.data.price) ? null : `${res.data.price}`);
        setStock(isNaN(res.data.stock) ? null : `${res.data.stock}`);
        setImages(res.data.images);
        setActive(res.data.active);
        setSummary(res.data.summary);
        setDescription(res.data.description);
        // setVariationName(res.data.variant_name);
        // setVariants(res.data.variants);

        // console.log('Multi Properties', res.data.multi_properties);
        if (res.data.multi_properties) {
          let mp_arr = [];
          for (let i in res.data.multi_properties) {
            let obj = {
              name: i,
              value: res.data.multi_properties[i],
            };
            mp_arr.push(obj);
          }
          setMultiProperties(mp_arr);
        }
        if (res.data.properties) {
          let p_arr = [];
          for (let i in res.data.properties) {
            let obj = {
              name: i,
              value: res.data.properties[i],
            };
            p_arr.push(obj);
          }
          setProperties(p_arr);
        }
      } else {
        alert('Something went wrong!', res.message);
      }
    } catch (error) {
      // console.log(error);
      alert('Something went wrong!');
    }
    setIsLoading(false);
  };

  // const getAllCategorys = async () => {
  //   try {
  //     const session = JSON.parse(
  //       await EncryptedStorage.getItem('user_session'),
  //     );
  //     const response = await fetch(
  //       `${global.server}/api/v1/gbdleathers/shop/category`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `${global.token_prefix} ${session.token}`,
  //         },
  //       },
  //     );
  //     const res = JSON.parse(await response.text());
  //     if (res.status === 'success') {
  //       setCategoryList(res.data);
  //     } else {
  //       setCategoryList([]);
  //     }
  //   } catch (error) {
  //     setCategoryList([]);
  //   }
  // };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // getAllCategorys();
      getProduct();
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
            source={{
              uri: `${global.server}/images/${frontImageName}`,
            }}
            style={{
              width: '100%',
              height: '100%',
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
            source={{
              uri: `${global.server}/images/${backImageName}`,
            }}
            style={{
              width: '100%',
              height: '100%',
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
  // function LoadingBottomPage() {
  //   if (isBottomLoading) {
  //     return (
  //       <View
  //         style={{
  //           width: '100%',
  //           height: '100%',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           backgroundColor: 'rgba(255, 255, 255, .8)',
  //           zIndex: 100,
  //           position: 'absolute',
  //         }}>
  //         <ActivityIndicator size={45} color="black" />
  //       </View>
  //     );
  //   } else {
  //     return <></>;
  //   }
  // }

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
          text: 'Update Variant',
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
            // error={nameError}
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
              // height: 50,
              fontSize: 16,
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
              underlineColor=""
              type="number"
              keyboardType={'numeric'}
              label="Price"
            />
            <TextInput
              // style={styles.input}
              style={{width: '35%', 
              padding: 8,
              marginTop: 5,
              // height: 50,
              fontSize: 16,
              fontWeight: '500',}}
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
          <View
            style={{
              width: '92%',
              // borderWidth: 1,
              // borderColor: 'lightgray',
              marginTop: 12,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'lightgray',
                paddingLeft: 5,
                paddingRight: 18,
              }}
              onPress={() =>
                navigation.navigate('ProductImages', {
                  id: route.params.variant_id,
                  name: name,
                  images: images,
                })
              }>
              <IconButton
                style={{
                  borderWidth: 1,
                  borderColor: 'lightgray',
                  marginRight: 10,
                }}
                icon="folder-multiple-image"
                color={Colors.blue500}
                size={26}
              />
              <Text style={{fontSize: 20}}>Images</Text>
            </TouchableOpacity>
            <View
              style={{
                width: '40%',
                paddingRight: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 17, color: 'black'}}>
                {active ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                trackColor={{false: 'gray', true: 'gray'}}
                thumbColor={active ? 'green' : 'red'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={active}
              />
            </View>
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
          <View
            style={{
              width: '92%',
              marginBottom: 30,
            }}>
            <List.Accordion
              titleStyle={{fontSize: 20, color: 'black', width: '100%'}}
              title="Properties"
              // id="1"
              style={{backgroundColor: 'white'}}>
              {multi_properties.map((propertie, index) => (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingBottom: 8,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TextInput
                      style={{
                        width: '70%',
                        marginTop: 10,
                      }}
                      label="Propertie Name"
                      // mode="flat"
                      autoCapitalize="none"
                      mode="outlined"
                      color="black"
                      selectionColor="black"
                      // underlineColor="gray"
                      activeUnderlineColor="black"
                      outlineColor="gray"
                      activeOutlineColor="black"
                      value={propertie.name}
                      underlineColor=""
                      onChangeText={val => {
                        let newPro = [];
                        multi_properties[index].name = val;
                        for (let i = 0; i < multi_properties.length; i++) {
                          newPro[i] = multi_properties[i];
                        }
                        setMultiProperties(newPro);
                      }}
                    />
                    <IconButton
                      icon="delete-circle"
                      color={Colors.red600}
                      size={32}
                      onPress={() => {
                        let newPro = [];
                        let indi = 0;
                        for (let i = 0; i < multi_properties.length; i++) {
                          if (i === index) continue;
                          newPro[indi++] = multi_properties[i];
                        }
                        setMultiProperties(newPro);
                      }}
                    />
                    <IconButton
                      icon="plus-circle"
                      color={Colors.blue500}
                      size={32}
                      onPress={() => {
                        let newPro = [];
                        multi_properties[index].value.push('');
                        for (let i = 0; i < multi_properties.length; i++) {
                          newPro[i] = multi_properties[i];
                        }
                        setMultiProperties(newPro);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: '92%',
                    }}>
                    <List.Accordion
                      titleStyle={{fontSize: 20, color: 'black', width: '100%'}}
                      title="Values"
                      // id="1"
                      style={{backgroundColor: 'white'}}>
                      {propertie.value.map((v, i) => (
                        <View
                          key={i}
                          style={{
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <IconButton
                            icon="delete"
                            color={Colors.red400}
                            size={28}
                            onPress={() => {
                              let newValue = [];
                              let indi = 0;
                              for (
                                let j = 0;
                                j < multi_properties[index].value.length;
                                j++
                              ) {
                                if (j === i) continue;
                                newValue[indi++] =
                                  multi_properties[index].value[j];
                              }
                              let newPro = [];
                              multi_properties[index].value = newValue;
                              for (
                                let k = 0;
                                k < multi_properties.length;
                                k++
                              ) {
                                newPro[k] = multi_properties[k];
                              }
                              setMultiProperties(newPro);
                            }}
                          />
                          <TextInput
                            style={{
                              width: '70%',
                            }}
                            label="Propertie Value"
                            // mode="flat"
                            // multiline={true}
                            autoCapitalize="none"
                            mode="outlined"
                            color="black"
                            selectionColor="black"
                            // underlineColor="gray"
                            activeUnderlineColor="black"
                            outlineColor="gray"
                            activeOutlineColor="black"
                            value={String(v)}
                            underlineColor=""
                            onChangeText={val => {
                              let newValue = [];
                              // propertie.value[i] = val;
                              multi_properties[index].value[i] = val;
                              for (let j = 0; j < propertie.value.length; j++) {
                                newValue[j] = multi_properties[index].value[j];
                              }
                              let newPro = [];
                              multi_properties[index].value = newValue;
                              for (
                                let k = 0;
                                k < multi_properties.length;
                                k++
                              ) {
                                newPro[k] = multi_properties[k];
                              }
                              setMultiProperties(newPro);
                            }}
                          />
                        </View>
                      ))}
                    </List.Accordion>
                  </View>
                </View>
              ))}

              <Button
                style={{
                  width: '100%',
                  height: 43,
                  // margin: 10,
                  marginTop: 5,
                  borderWidth: 1,
                  borderColor: 'gray',
                  justifyContent: 'center',
                  // backgroundColor: '',
                  // height: 50,
                  // fontSize: 18,
                }}
                icon="plus"
                mode="outlined"
                color="black"
                onPress={() => {
                  let newPro = [];
                  for (let i = 0; i < multi_properties.length; i++) {
                    newPro[i] = multi_properties[i];
                  }
                  newPro.push({name: '', value: []});
                  setMultiProperties(newPro);
                }}>
                Add New Propertie
              </Button>
            </List.Accordion>
          </View>

          <View
            style={{
              width: '92%',
              marginBottom: 30,
            }}>
            <List.Accordion
              titleStyle={{fontSize: 20, color: 'black', width: '100%'}}
              title="Variant Properties"
              // id="1"
              style={{backgroundColor: 'white'}}>
              {properties.map((propertie, index) => (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                    borderColor: 'gray',
                    borderWidth: 1,
                    paddingBottom: 8,
                  }}>
                  <View
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <TextInput
                      style={{
                        width: '70%',
                        marginTop: 10,
                      }}
                      label="Propertie Name"
                      // mode="flat"
                      autoCapitalize="none"
                      mode="outlined"
                      color="black"
                      selectionColor="black"
                      // underlineColor="gray"
                      activeUnderlineColor="black"
                      outlineColor="gray"
                      activeOutlineColor="black"
                      value={propertie.name}
                      underlineColor=""
                      onChangeText={val => {
                        let newPro = [];
                        properties[index].name = val;
                        for (let i = 0; i < properties.length; i++) {
                          newPro[i] = properties[i];
                        }
                        setProperties(newPro);
                      }}
                    />
                    <IconButton
                      icon="delete-circle"
                      color={Colors.red600}
                      size={32}
                      onPress={() => {
                        let newPro = [];
                        let indi = 0;
                        for (let i = 0; i < properties.length; i++) {
                          if (i === index) continue;
                          newPro[indi++] = properties[i];
                        }
                        setProperties(newPro);
                      }}
                    />
                  </View>

                  <View
                    style={{
                      width: '90%',
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      justifyContent: 'space-between',
                    }}>
                    <TextInput
                      style={{
                        width: '70%',
                      }}
                      label="Propertie Value"
                      // mode="flat"
                      // multiline={true}
                      autoCapitalize="none"
                      mode="outlined"
                      color="black"
                      selectionColor="black"
                      // underlineColor="gray"
                      activeUnderlineColor="black"
                      outlineColor="gray"
                      activeOutlineColor="black"
                      value={String(propertie.value)}
                      underlineColor=""
                      onChangeText={val => {
                        let newPro = [];
                        properties[index].value = val;
                        for (let i = 0; i < properties.length; i++) {
                          newPro[i] = properties[i];
                        }
                        setProperties(newPro);
                      }}
                    />
                  </View>
                </View>
              ))}

              <Button
                style={{
                  width: '100%',
                  height: 43,
                  // margin: 10,
                  marginTop: 5,
                  borderWidth: 1,
                  borderColor: 'gray',
                  justifyContent: 'center',
                  // backgroundColor: '',
                  // height: 50,
                  // fontSize: 18,
                }}
                icon="plus"
                mode="outlined"
                color="black"
                onPress={() => {
                  let newPro = [];
                  for (let i = 0; i < properties.length; i++) {
                    newPro[i] = properties[i];
                  }
                  newPro.push({name: '', value: ''});
                  setProperties(newPro);
                }}>
                Add Variant Propertie
              </Button>
            </List.Accordion>
          </View>
          <Button
            style={{
              width: '92%',
              // height: 43,
              // margin: 10,
              padding: 4,
              marginTop: 20,
              borderWidth: 1,
              borderColor: 'red',
              backgroundColor: 'white',
              // justifyContent: 'center',
            }}
            icon="delete"
            mode="outlined"
            color="red"
            onPress={() => handleVariantDelete()}>
            Remove Variant
          </Button>
        </View>
        <View style={styles.bottomSpace}></View>
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
    fontSize: 16,
    fontWeight: '500',
  },
  categoryList: {
    width: '92%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 25,
    backgroundColor: 'rgb(230, 229, 231)',
    marginBottom: 40,
  },
  bottomSpace: {
    marginBottom: 200,
  },
  productStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 10,
    width: '98%',
    height: 90,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  productDetailStyle: {
    width: '85%',
    // borderWidth: 1,
    // borderColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 55,
    height: 55,
    // borderRadius: 35,
    // borderWidth: 1,
    // borderColor: 'black',
  },
});
