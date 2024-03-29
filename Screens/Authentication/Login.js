import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import RNRestart from 'react-native-restart';
import {ALERT_TYPE, Dialog, Root, Toast} from 'react-native-alert-notification';

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [isLoading, setLoading] = useState(false);

  async function storeUserSession(token) {
    try {
      await EncryptedStorage.setItem(
        'user_session',
        JSON.stringify({
          token: token,
        }),
      );
    } catch (error) {
      await EncryptedStorage.clear();
      RNRestart.Restart();
    }
  }

  async function Login() {
    if (email == '' || email == null || email == undefined) {
      setEmailError(true);
      return;
    }
    if (password == '' || password == null || password == undefined) {
      setPasswordError(true);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/user/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        storeUserSession(res.token);
        setLoading(false);

        RNRestart.Restart();
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Welcome!',
          button: 'close',
        });
      } else {
        // alert('Un Authorized Access');
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: 'Un Authorized Access!',
          button: 'close',
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Check Internet Connection or Restart App',
        button: 'close',
      });
      setLoading(false);
    }
  }

  function LoadingPage() {
    if (isLoading) {
      return (
        <View style={styles.loadingPage}>
          <ActivityIndicator size={45} color="black" />
        </View>
      );
    } else {
      return <></>;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingPage />
      <View style={styles.holder}>
        <View style={styles.brand}>
          <Image style={styles.icon} source={require('../Assets/icon.png')} />
          <Text style={styles.brandName}>GBD Leathers</Text>
        </View>
        <View style={styles.loginPage}>
          <Text style={styles.loginHeading}>Login</Text>
          <Text style={styles.loginLabel}>Email</Text>
          <TextInput
            error={emailError}
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            style={styles.loginInput}
            value={email}
            onChangeText={data => {
              setEmail(data);
              setEmailError(false);
            }}
          />

          <Text style={styles.loginLabel}>Password</Text>

          <TextInput
            error={passwordError}
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            style={styles.loginInput}
            secureTextEntry={true}
            value={password}
            onChangeText={data => {
              setPassword(data);
              setPasswordError(false);
            }}
          />
          <TouchableOpacity style={styles.loginSubmit} onPress={() => Login()}>
            <Text style={{fontSize: 16, letterSpacing: 3, color: 'white'}}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  holder: {
    width: '100%',
    height: '60%',
    top: '12%',
    display: 'flex',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 2,
  },
  brand: {
    width: '100%',
    // borderWidth: 2,
    // borderColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 19,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Arial',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  loginPage: {
    width: '80%',
    height: 'auto',
    top: 5,
    // borderColor: 'green',
    // borderWidth: 1,
  },
  loginHeading: {
    fontSize: 28,
    textAlign: 'center',
    color: 'rgb(40, 40, 40)',
    marginTop: 25,
  },
  loginInput: {
    width: '100%',
    marginTop: 1,
    height: 35,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 0,
    borderRadius: 0,
  },
  loginLabel: {
    fontSize: 18,
    color: 'black',
  },
  loginSubmit: {
    width: '100%',
    marginTop: 20,
    fontSize: 16,
    // borderWidth: 1,
    // borderColor: 'black',
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FC5111',
  },

  loadingPage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, .8)',
    zIndex: 100,
    position: 'absolute',
  },
});
