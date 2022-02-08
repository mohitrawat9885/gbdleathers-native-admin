import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {colors, Header, Icon} from 'react-native-elements';
import {Avatar, Button, TextInput} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';

import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

// const createFormData = photo => {
//   const data = new FormData();
//   data.append('photo', {
//     name: photo.assets[0].fileName,
//     type: photo.assets[0].type,
//     uri:
//       Platform.OS === 'android'
//         ? photo.assets[0].uri
//         : photo.assets[0].uri.replace('file://', ''),
//   });
//   return data;
// };

export default function EditCategory({route, navigation}) {
  const [ImageData, setImageData] = useState();
  const [ImageName, setImageName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [categoryNameError, setCategoryNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Category ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadCategory()},
    ]);
  };

  const handleCategoryDelete = () => {
    Alert.alert('Delete Alert', 'Delete Category ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => DeleteCategory()},
    ]);
  };

  async function DeleteCategory() {
    try {
      setIsLoading(true);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/category/${route.params.category_id}`,
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
        return;
      }
      alert('Try again!');
    } catch (error) {
      alert('Please try again!');
    }
    setIsLoading(false);
  }

  async function UploadCategory() {
    if (
      categoryName == undefined ||
      categoryName == '' ||
      categoryName == null
    ) {
      setCategoryNameError(true);
      return;
    }

    try {
      setIsLoading(true);

      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );

      const data = new FormData();
      if (ImageData) {
        data.append('photo', {
          name: ImageData.assets[0].fileName,
          type: ImageData.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? ImageData.assets[0].uri
              : ImageData.assets[0].uri.replace('file://', ''),
        });
      }
      data.append('name', categoryName);
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/category/${route.params.category_id}`,
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
        // setCategoryName(null);
        // setImageData(null);
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

  const getCategoryById = async () => {
    setIsLoading(true);
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/category/${route.params.category_id}`,
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
        setImageName(res.data.image);
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCategoryById();
    });
    return unsubscribe;
  }, [navigation]);

  const chooseImage = async () => {
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
            source={{
              uri: `${global.server}/images/${ImageName}`,
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
          text: 'Edit Category',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={{
          icon: 'check',
          color: 'black',
          size: 28,
          onPress: () => HandleSubmit(),
        }}
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
            onPress={() => chooseImage()}>
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
            error={categoryNameError}
            style={styles.input}
            label="Category Name"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={categoryName}
            onChangeText={val => {
              setCategoryName(val);
              setCategoryNameError(false);
            }}
          />
          <Button
            style={{
              width: '96%',
              // height: 43,
              // margin: 10,
              padding: 4,
              marginTop: 8,
              borderWidth: 1,
              borderColor: 'red',
              backgroundColor: 'white',
              // justifyContent: 'center',
            }}
            icon="delete"
            mode="outlined"
            color="red"
            onPress={() => handleCategoryDelete()}>
            Remove Category
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: 8,
    marginTop: 20,
    marginBottom: 20,
    height: 50,

    fontSize: 18,
    fontWeight: '500',
  },
});
