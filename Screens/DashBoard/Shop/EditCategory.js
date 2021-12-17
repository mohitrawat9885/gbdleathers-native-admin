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

export default function AddCategory({route, navigation}) {
  const [ImageData, setImageData] = useState();
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [ImageName, setImageName] = useState();
  const [categoryName, setCategoryName] = useState();
  const [categoryNameError, setCategoryNameError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Category ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UpdateCategory()},
    ]);
  };

  async function UpdateCategory() {
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
      const response = await fetch(`${global.server}/admin/updatecategory`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${global.token_prefix} ${session.token}`,
        },
        body: JSON.stringify({
          category_id: route.params.category_id,
          name: categoryName,
          image: await uploadImage(),
        }),
      });
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        getCategoryById();
        setIsLoading(false);
      } else if (res.status === 'error') {
        setIsLoading(false);
        alert('Server Error');
      } else {
        setIsLoading(false);
        alert('Unauthorized access');
      }
      console.log(res.message);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert('Uploading Error');
    }
  }

  const getCategoryById = async () => {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/admin/getcategorybyid?categoryId=${route.params.category_id}`,
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
        setIsImageChanged(false);
        setImageName(res.data.image);
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong');
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCategoryById();
    });
    return unsubscribe;
  }, [navigation]);

  const uploadImage = async () => {
    if (!isImageChanged) {
      console.log('Not Changed');
      return ImageName;
    }
    try {
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
      } else {
        return 'noimage.jpg';
      }
    } catch (error) {
      console.log(error);
      alert('Image Error');
    }
  };

  const chooseImage = async () => {
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
          text: 'Create New Category',
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
    marginBottom: 50,
    height: 50,

    fontSize: 18,
    fontWeight: '500',
  },
});
