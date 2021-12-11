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
} from 'react-native';
import {colors, Header, Icon} from 'react-native-elements';
import {Avatar, Button, TextInput} from 'react-native-paper';

export default function AddCategory({navigation}) {
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
          text: 'Create Category',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={{
          icon: 'check',
          color: 'black',
          size: 28,
          //   onPress: () => createFoodCategory(),
        }}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={{padding: 15, alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                width: 330,
                marginBottom: 10,
                height: 200,
                borderRadius: 2,
                backgroundColor: 'lightgray',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}></View>
            </TouchableOpacity>
            <Text
              style={{textAlign: 'center', color: 'black', marginBottom: 20}}>
              Category Image
            </Text>

            <TextInput
              style={styles.input}
              label="Category Name"
              autoCapitalize="none"
              mode="flat"
              //   value={categoryName}
              //   onChangeText={val => setCategoryName(val)}
              underlineColor=""
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 330,
    fontSize: 16,
    fontWeight: '500',
    margin: 3,
  },
  images: {
    width: 330,
    height: 200,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  button: {
    width: 330,
    height: 40,
    backgroundColor: 'brown',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    marginTop: 15,
    justifyContent: 'center',
  },
});
