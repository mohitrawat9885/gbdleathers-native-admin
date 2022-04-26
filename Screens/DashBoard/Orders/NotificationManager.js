import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await EncryptedStorage.getItem('fcmToken');
  // console.log(fcmToken, 'The old token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // console.log(fcmToken, 'The new generated token');
        await EncryptedStorage.setItem('fcmToken', JSON.stringify(fcmToken));
      }
    } catch (error) {
      // console.log(error, 'Error in fcmToken');
      alert(error);
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // console.log(
    //   'Notification caused app to open from background state:',
    //   remoteMessage.notification,
    // );
  });
  messaging().onMessage(async remoteMessage => {
    // console.log('Receiving foreground', remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        // console.log(
        //   'Notification caused app to open from quit state:',
        //   remoteMessage.notification,
        // );
      }
    });
};
