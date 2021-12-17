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

exports.uploadImage = async ImageData => {
  try {
    const session = JSON.parse(await EncryptedStorage.getItem('user_session'));
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
    alert('Error');
  }
};
