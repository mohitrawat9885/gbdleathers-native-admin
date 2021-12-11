import React from 'react';
// import {TextInput, Button} from 'react-native-paper';
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.holder}>
        <Image style={styles.icon} source={require('../Assets/icon.png')} />
        <Text style={styles.brandName}>GBD Leathers</Text>
        <View style={styles.activity}>
          <ActivityIndicator size={28} color="gray" />
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
    height: 'auto',
    top: '20%',
    display: 'flex',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 22,
    letterSpacing: 2,
    marginTop: 10,
    color: 'black',
    fontWeight: '600',
    fontFamily: 'Arial',
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'white',
  },
  activity: {
    marginTop: 280,
  },
});
