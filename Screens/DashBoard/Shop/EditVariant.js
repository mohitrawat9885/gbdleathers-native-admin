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

export default function EditVariant({route, navigation}) {
  const [bottomSheet, setBottomSheet] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isBottomLoading, setIsBottomLoading] = useState(false);

  const [name, setName] = useState();
  const [nameError, setNameError] = useState();

  const [price, setPrice] = useState();
  const [stock, setStock] = useState();

  const [images, setImages] = useState([]);

  const [active, setActive] = useState(false);
  const toggleSwitch = () => setActive(previousState => !previousState);

  const [summary, setSummary] = useState();
  const [description, setDescription] = useState();

  const [variants, setVariants] = useState([]);

  const [variationName, setVariationName] = useState();

  const [variantName, setVariantName] = useState();
  const [variantNameError, setVariantNameError] = useState();

  const [variantPrice, setVariantPrice] = useState();
  const [variantStock, setVariantStock] = useState();

  const [variantSummary, setVariantSummary] = useState();
  const [variantDescription, setVariantDescription] = useState();

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Variant ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadProduct()},
    ]);
  };

  async function addProductVariant() {
    if (!variantName) {
      setVariantNameError(true);
      return;
    }

    try {
      setIsBottomLoading(true);
      const data = new FormData();
      if (variantName) {
        data.append('name', `${variantName}`);
      }
      if (variantPrice) {
        data.append('price', `${variantPrice}`);
      }
      if (variantSummary) {
        data.append('summary', variantSummary);
      }
      if (variantDescription) {
        data.append('description', variantDescription);
      }
      if (variantStock) {
        data.append('stock', variantStock);
      }

      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variantId}`,
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
        setBottomSheet(false);
        setVariantName(null);
        setVariantPrice(null);
        setVariantStock(null);
        setVariantSummary(null);
        setVariantDescription(null);
        getProduct();
      } else if (res.status === 'error') {
        alert('Server Error');
      }
    } catch (error) {
      alert('Error');
    }
    setIsBottomLoading(false);
  }

  async function UploadProduct() {
    if (!name) {
      setNameError(true);
      return;
    }

    try {
      setIsLoading(true);

      const data = new FormData();

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
      if (active) {
        data.append('active', active);
      }
      if (variationName) {
        data.append('variant_name', variationName);
      }
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variantId}`,
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
      } else if (res.status === 'error') {
        console.log(res);
        alert('Server Error');
      }
    } catch (error) {
      // console.log(error);
      alert('Error');
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
        `${global.server}/api/v1/gbdleathers/shop/product/${route.params.variantId}`,
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
        setName(res.data.name);
        setPrice(isNaN(res.data.price) ? null : `${res.data.price}`);
        setStock(isNaN(res.data.stock) ? null : `${res.data.stock}`);
        setImages(res.data.images);
        setActive(res.data.active);
        setSummary(res.data.summary);
        setDescription(res.data.description);
        setVariationName(res.data.variant_name);
        setVariants(res.data.variants);
      } else {
        alert('Something went wrong!');
      }
    } catch (error) {
      alert('Something went wrong!');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProduct();
    });
    return unsubscribe;
  }, [navigation]);

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
  function LoadingBottomPage() {
    if (isBottomLoading) {
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
          <TextInput
            style={styles.input}
            error={nameError}
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
                  id: route.params.variantId,
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
                // marginRight: 30,

                // paddingTop: 20,
                // paddingBottom: 20,
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
            mode="flat"
            // multiline={true}
            // numberOfLines={10}
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
            // multiline={true}
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
          {/* <View style={styles.categoryList}>
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
          </View> */}

          <TextInput
            style={styles.input}
            label="Variation Type"
            mode="flat"
            // multiline={true}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={variationName}
            onChangeText={val => setVariationName(val)}
            underlineColor=""
          />
          <View
            style={{
              width: '92%',
            }}>
            <List.Accordion
              titleStyle={{fontSize: 20, color: 'black', width: '100%'}}
              title={variationName}
              // id="1"
              style={{backgroundColor: 'white'}}>
              {variants.map((variant, index) => (
                <View style={{width: '100%'}} key={index}>
                  <TouchableOpacity
                    onLongPress={() =>
                      navigation.push('EditVariant', {
                        variantId: variant._id,
                      })
                    }>
                    <View style={styles.productStyle}>
                      <Image
                        source={{
                          uri: `https://media.istockphoto.com/photos/sewing-creating-leather-handmade-wallet-leathercraft-picture-id1283147506?b=1&k=20&m=1283147506&s=170667a&w=0&h=7HwBX_wCJCH1EQBzJyqGhsnFF_7g-wJZMOq5lSUqu6k=`,
                        }}
                        style={styles.productImage}
                      />
                      <View style={styles.productDetailStyle}>
                        <Text style={{fontSize: 18, marginLeft: 16}}>
                          {variant.name}
                        </Text>
                        <View style={{right: 10}}>
                          <Text style={{fontSize: 18}}>
                            Stock .{variant.stock}
                          </Text>
                        </View>
                        <View style={{right: 10}}>
                          <Text style={{fontSize: 18}}>
                            QTR .{variant.price}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </List.Accordion>
          </View>

          <Button
            style={{
              width: '92%',
              height: 43,
              // margin: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: 'gray',
              justifyContent: 'center',

              // backgroundColor: '',
              // height: 50,
              // fontSize: 18,
            }}
            icon="book-open-page-variant"
            mode="outlined"
            color="black"
            onPress={() => setBottomSheet(true)}>
            Create Variant
          </Button>
        </View>
        <View style={styles.bottomSpace}></View>

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
              text: 'Add Variant',
              style: {color: 'black', fontSize: 22, justifyContent: 'center'},
            }}
            rightComponent={{
              icon: 'check',
              color: 'black',
              size: 28,
              onPress: () => addProductVariant(),
            }}
            containerStyle={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <LoadingBottomPage />
          <View
            style={{
              width: '100%',
              flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
              height: 350,
              backgroundColor: 'rgb(240, 240, 240)',
            }}>
            <TextInput
              style={styles.input}
              error={variantNameError}
              label="Variant Name"
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={variantName}
              onChangeText={val => {
                setVariantName(val);
                setVariantNameError(false);
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
                value={variantPrice}
                onChangeText={val => {
                  setVariantPrice(val);
                }}
                underlineColor=""
                type="number"
                keyboardType={'numeric'}
                label="Variant Price"
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
                value={variantStock}
                onChangeText={val => {
                  setVariantStock(val);
                }}
                underlineColor=""
                type="number"
                keyboardType={'numeric'}
                label="Variant Stock"
              />
            </View>

            <TextInput
              style={styles.input}
              label="Variant Summary"
              mode="flat"
              // multiline={true}
              // numberOfLines={10}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={variantSummary}
              onChangeText={val => setVariantSummary(val)}
              underlineColor=""
            />
            <TextInput
              style={styles.input}
              label="Variant Description"
              mode="flat"
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={variantDescription}
              onChangeText={val => setVariantDescription(val)}
              underlineColor=""
            />
          </View>
        </BottomSheet>
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
    height: 50,
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
