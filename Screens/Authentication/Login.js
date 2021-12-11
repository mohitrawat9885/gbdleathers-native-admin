import React from 'react';
import {TextInput, Button} from 'react-native-paper';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  //   TextInput,
} from 'react-native';

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.holder}>
        <View style={styles.brand}>
          <Image style={styles.icon} source={require('../Assets/icon.png')} />
          <Text style={styles.brandName}>GBD Leathers</Text>
        </View>
        <View style={styles.loginPage}>
          <Text style={styles.loginHeading}>Login</Text>
          <Text style={styles.loginLabel}>Email</Text>
          <TextInput
            mode="outlined"
            // label="Email"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            style={styles.loginInput}
            keyboardType="email-address"
            // backgroundColor="rgb(240, 240, 240)"
          />

          <Text style={styles.loginLabel}>Password</Text>

          <TextInput
            mode="outlined"
            // label="Email"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            style={styles.loginInput}
            secureTextEntry={true}
            // backgroundColor="rgb(240, 240, 240)"
          />
          <Button
            style={styles.loginSubmit}
            fontSize={20}
            color="black"
            uppercase={false}
            mode="outlined">
            <Text style={{fontSize: 18, letterSpacing: 3}}>Submit</Text>
          </Button>
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
    width: '85%',
    height: 'auto',
    top: 20,
    // borderColor: 'green',
    // borderWidth: 1,
  },
  loginHeading: {
    fontSize: 30,
    textAlign: 'center',
    color: 'rgb(40, 40, 40)',
    marginTop: 25,
    marginBottom: 10,
  },
  loginInput: {
    width: '100%',
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 0,
    borderRadius: 0,

    // fontSize: 19,

    // borderWidth: 1,
    // borderColor: 'gray',
  },
  loginLabel: {
    fontSize: 20,
    color: 'black',
  },
  loginSubmit: {
    width: '100%',
    marginTop: 20,
    color: 'black',
    borderWidth: 1,
    borderColor: 'gray',
    height: 50,
    fontSize: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
