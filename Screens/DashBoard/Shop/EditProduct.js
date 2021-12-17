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
import {
  Avatar,
  Button,
  TextInput,
  List,
  RadioButton,
  Switch,
} from 'react-native-paper';
import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import EncryptedStorage from 'react-native-encrypted-storage';

const createFormData = photo => {
  const data = new FormData();
  data.append('photo', {
    name: photo.assets[0].fileName,
    type: photo.assets[0].type,
    uri:
      Platform.OS === 'android'
        ? photo.assets[0].uri
        : photo.assets[0].uri.replace('file://', ''),
  });
  return data;
};

export default function AddProduct({route, navigation}) {
  const [categoryList, setCategoryList] = useState([]);

  const [ImageData, setImageData] = useState();
  const [ImageName, setImageName] = useState();
  const [isImageChanged, setIsImageChanged] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState('0');
  const [categoryName, setCategoryName] = useState('No Category');

  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [price, setPrice] = useState(`${0}`);
  const [priceError, setPriceError] = useState();
  const [stock, setStock] = useState(`${0}`);
  const [sortDetail, setSortDetail] = useState();
  const [longDetail, setLongDetail] = useState();

  const [isPublished, setIsPublished] = useState(false);
  const toggleSwitch = () => setIsPublished(previousState => !previousState);

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Product ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UpdateProduct()},
    ]);
  };

  async function UpdateProduct() {
    let returnMe = false;
    if (name == undefined || name == null || name == '') {
      setNameError(true);
      returnMe = true;
    }
    if (price == undefined || price == null || price == '' || price < 0) {
      setPriceError(true);
      returnMe = true;
    }
    if (returnMe) return;
    try {
      setIsLoading(true);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(`${global.server}/admin/updateproduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${global.token_prefix} ${session.token}`,
        },
        body: JSON.stringify({
          product_id: route.params.product_id,
          name: name,
          price: price,
          stock: stock,
          published: isPublished,
          image: await uploadImage(),
          sort_detail: sortDetail,
          long_detail: longDetail,
          category: categoryId,
        }),
      });
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        // setName('');
        // setPrice(0);
        // setImageData('');
        // setSortDetail('');
        // setLongDetail('');
        // setCategoryId('0');
        // setCategoryName('No Category');
        getProductById();
        setIsLoading(false);
      } else if (res.status === 'error') {
        setIsLoading(false);
        alert('Server Error');
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert('Error');
    }
  }

  const uploadImage = async () => {
    try {
      if (!isImageChanged) {
        return ImageName;
      }
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(`${global.server}/admin/uploadimage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${global.token_prefix} ${session.token}`,
        },
        body: createFormData(ImageData),
      });
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        return res.imageName;
      } else if (res.status === 'error') {
        alert('Image Error');
      }
    } catch (error) {
      console.log(error);
      alert('Error');
    }
  };
  const getProductById = async () => {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/admin/getproductbyid?productId=${route.params.product_id}`,
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
        setPrice(`${parseInt(res.data.price)}`);
        setStock(`${parseInt(res.data.stock)}`);
        setIsPublished(res.data.published);
        setIsImageChanged(false);
        setImageName(res.data.image[0]);
        setSortDetail(res.data.sort_detail);
        setLongDetail(res.data.long_detail);
        setCategoryId(res.data.category);
        getCategoryById(res.data.category);
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
    [0];
  };

  const getCategoryById = async categoryId => {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/admin/getcategorybyid?categoryId=${categoryId}`,
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
        setCategoryName(res.data.name);
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  const getAllCategorys = async () => {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(`${global.server}/admin/getallcategorys`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${global.token_prefix} ${session.token}`,
        },
      });
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
      getProductById();
    });
    return unsubscribe;
  }, [navigation]);

  const ChooseImage = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    } else if (result.error) {
      alert('Problem Picking Image');
      return;
    } else {
      setIsImageChanged(true);
      setImageData(result);
    }
  };

  function RenderImage() {
    if (ImageData) {
      return (
        <Image
          source={{
            uri: ImageData.assets[0].uri,
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
              uri: `${global.server}/assets/images/${ImageName}`,
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
          text: 'Edit Product',
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
            onPress={() => ChooseImage()}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {RenderImage()}
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
          <TextInput
            style={styles.input}
            error={priceError}
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
              setPriceError(false);
            }}
            underlineColor=""
            type="number"
            keyboardType={'numeric'}
            label="Price"
          />

          <View
            style={{
              width: '92%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{width: '40%'}}
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={stock}
              onChangeText={val => setStock(val)}
              underlineColor=""
              type="number"
              keyboardType={'numeric'}
              label="Stock"
            />
            <View
              style={{
                width: '40%',
                // marginRight: 30,
                paddingRight: 30,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 17, color: 'black'}}> Published</Text>
              <Switch
                trackColor={{false: 'gray', true: 'gray'}}
                thumbColor={isPublished ? 'green' : 'red'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isPublished}
              />
            </View>
          </View>

          <TextInput
            style={styles.input}
            label="Sort Description"
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
            value={sortDetail}
            onChangeText={val => setSortDetail(val)}
            underlineColor=""
          />
          <TextInput
            style={styles.input}
            label="Long Description"
            mode="flat"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={longDetail}
            onChangeText={val => setLongDetail(val)}
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
                      value={'0'}
                      color="red"
                      onPress={() => {
                        setCategoryName('No Category');
                        setCategoryId('0');
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
    height: 50,
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
