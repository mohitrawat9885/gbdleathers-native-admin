import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {Header, BottomSheet} from 'react-native-elements';
import {Avatar, Button, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const menu = [{}];

export default function Shop({route, navigation}) {
  const [bottomSheet, setBottomSheet] = useState(false);
  return (
    <>
      <Header
        backgroundColor="lightgray"
        barStyle="dark-content"
        placement="left"
        leftComponent={{
          icon: 'menu',
          color: 'black',
          size: 28,
          onPress: () => navigation.openDrawer(),
        }}
        centerComponent={{
          text: 'Shop',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => setBottomSheet(true)}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="dots-vertical"
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

      <View style={{flex: 1, width: '100%', height: '100%', zIndex: 1}}>
        <ScrollView>
          <List.Accordion
            onLongPress={() => navigation.navigate('EditCategory')}
            titleStyle={{fontSize: 25, color: 'black'}}
            title="Wallets"
            id="1"
            style={{backgroundColor: 'white'}}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                onLongPress={() => navigation.navigate('EditProduct')}>
                <View style={styles.foodStyle}>
                  <Image
                    source={{
                      uri: `https://media.istockphoto.com/photos/sewing-creating-leather-handmade-wallet-leathercraft-picture-id1283147506?b=1&k=20&m=1283147506&s=170667a&w=0&h=7HwBX_wCJCH1EQBzJyqGhsnFF_7g-wJZMOq5lSUqu6k=`,
                    }}
                    style={styles.foodImage}
                  />
                  <Text style={{fontSize: 22, marginLeft: 16}}>
                    Brown Wallets
                  </Text>
                  <View style={{right: 10, position: 'absolute'}}>
                    <Text style={{fontSize: 18}}>QTR 50.00</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{width: '100%'}}>
              <TouchableOpacity
                onLongPress={() => navigation.navigate('EditProduct')}>
                <View style={styles.foodStyle}>
                  <Image
                    source={{
                      uri: `https://media.istockphoto.com/photos/sewing-creating-leather-handmade-wallet-leathercraft-picture-id1283147506?b=1&k=20&m=1283147506&s=170667a&w=0&h=7HwBX_wCJCH1EQBzJyqGhsnFF_7g-wJZMOq5lSUqu6k=`,
                    }}
                    style={styles.foodImage}
                  />
                  <Text style={{fontSize: 22, marginLeft: 16}}>
                    Brown Wallets
                  </Text>
                  <View style={{right: 10, position: 'absolute'}}>
                    <Text style={{fontSize: 18}}>QTR 50.00</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </List.Accordion>
        </ScrollView>
      </View>

      <BottomSheet isVisible={bottomSheet}>
        <View
          style={{
            width: '100%',
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            height: 170,
            padding: '3%',
            backgroundColor: 'rgb(255, 255, 255)',
          }}>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => {
              setBottomSheet(false);
              navigation.navigate('AddProduct');
            }}>
            <Text style={styles.bottomMenuText}>Create New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => {
              setBottomSheet(false);
              navigation.navigate('AddCategory');
            }}>
            <Text style={styles.bottomMenuText}>Create New Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => setBottomSheet(false)}>
            <Text style={styles.bottomMenuText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  bottonMenu: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    padding: 3,
    color: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'rgb(235, 235, 235)',
    borderBottomWidth: 1,
  },
  bottomMenuText: {
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: 'Arial',
  },

  categoryStyle: {
    marginTop: 10,
    paddingLeft: 10,
    width: '98%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',

    // alignItems: 'center'
  },
  foodStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 10,
    width: '98%',
    height: 90,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
  },
});
