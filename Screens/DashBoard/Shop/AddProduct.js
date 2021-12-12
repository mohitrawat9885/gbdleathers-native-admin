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

const categorys = [
  {_id: 1, name: 'Wallets'},
  {_id: 2, name: 'Belts'},
  {_id: 3, name: 'Watches'},
  {_id: 4, name: 'Bags'},
];

export default function AddProduct({navigation}) {
  const [ImageData, setImageData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryCheckedId, setCategoryCheckedId] = useState(0);
  const [categoryCheckedName, setCategoryCheckedName] = useState('No Category');

  const [productName, setProductName] = useState();
  const [productNameError, setProductNameError] = useState();
  const [productPrice, setProductPrice] = useState();
  const [productPriceError, setProductPriceError] = useState();
  const [productDescription, setProductDescription] = useState();

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Create new Category ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadCategory()},
    ]);
  };

  async function UploadCategory() {
    let returnMe = false;

    if (productName == undefined || productName == null || productName == '') {
      setProductNameError(true);
      returnMe = true;
    }
    if (
      productPrice == undefined ||
      productPrice == null ||
      productPrice == '' ||
      productPrice < 0
    ) {
      setProductPriceError(true);
      returnMe = true;
    }
    if (returnMe) return;

    setIsLoading(true);
    alert('Uploded');
    setIsLoading(false);
  }

  const ChooseImage = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    } else if (result.error) {
      alert('Problem Picking Image');
      return;
    } else {
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
            error={productNameError}
            label="Product Name"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={productName}
            onChangeText={val => {
              setProductName(val);
              setProductNameError(false);
            }}
            underlineColor=""
          />
          <TextInput
            style={styles.input}
            error={productPriceError}
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={productPrice}
            onChangeText={val => {
              setProductPrice(val);
              setProductPriceError(false);
            }}
            underlineColor=""
            type="number"
            keyboardType={'numeric'}
            label="Price"
          />
          <TextInput
            style={styles.input}
            label="Description"
            mode="flat"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            //   value={categoryName}
            //   onChangeText={val => setCategoryName(val)}
            underlineColor=""
          />
          <View style={styles.categoryList}>
            <List.Section
              title={`Category :- ${categoryCheckedName}`}
              titleStyle={{color: 'black', fontSize: 17}}>
              <List.Accordion
                titleStyle={{color: 'black', fontSize: 18}}
                title="Select Category"
                left={props => (
                  <List.Icon {...props} color="black" icon="view-list" />
                )}>
                <RadioButton.Group value={categoryCheckedId}>
                  <View>
                    <RadioButton.Item
                      label="No Category"
                      value={0}
                      color="red"
                      onPress={() => {
                        setCategoryCheckedName('No Category');
                        setCategoryCheckedId(0);
                      }}
                    />
                    {categorys.map(data => (
                      <RadioButton.Item
                        key={data.name}
                        label={data.name}
                        value={data._id}
                        color="green"
                        onPress={() => {
                          setCategoryCheckedId(data._id);
                          setCategoryCheckedName(data.name);
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
