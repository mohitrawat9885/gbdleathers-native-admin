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
} from 'react-native';
import {colors, Header, Icon} from 'react-native-elements';
import {Avatar, Button, TextInput, List, RadioButton} from 'react-native-paper';

export default function AddProduct({navigation}) {
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
          text: 'Create Product',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={40}
                icon="check-bold"
                color="gray"
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

      <ScrollView>
        <View style={{padding: 15, alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: 330,
              marginBottom: 10,
              height: 200,
              borderRadius: 2,
              backgroundColor: 'lightgray',
            }}
            onPress={() => chooseFoodImage()}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {/* {renderCategoryImage()} */}
            </View>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', color: 'black', marginBottom: 20}}>
            Product Image
          </Text>

          <TextInput
            style={styles.input}
            label="Product Name"
            autoCapitalize="none"
            mode="flat"
            underlineColor=""
            // value={foodName}
            // onChangeText={val => setFoodName(val)}
          />
          <TextInput
            style={styles.input}
            type="number"
            keyboardType={'numeric'}
            label="Price"
            mode="flat"
            // value={foodPrice}
            autoCapitalize="none"
            // onChangeText={val => setFoodPrice(val)}
          />
          <TextInput
            style={styles.input}
            label="Description"
            mode="flat"
            autoCapitalize="none"
            // value={foodDescription}
            // onChangeText={val => setFoodDescription(val)}
          />
          <View
            style={{
              backgroundColor: 'lightgray',
              width: 330,
              marginTop: 14,
            }}>
            <List.Section title={`Category: Undefined`}>
              <List.Accordion
                title="Select Category"
                left={props => <List.Icon {...props} icon="alpha-c-box" />}>
                <RadioButton.Group value="{foodCategoryValue}">
                  <View>
                    <RadioButton.Item label="This" value="Th" />
                    <RadioButton.Item label="This" value="Th" />
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
    backgroundColor: 'rgb(30, 120, 255)',
    borderRadius: 5,
    padding: 5,
    margin: 5,
    marginTop: 15,
    justifyContent: 'center',
  },
});
