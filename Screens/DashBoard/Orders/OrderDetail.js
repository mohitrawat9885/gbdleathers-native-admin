import React from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const order = {
  products: [
    {
      name: 'Product',
    },
    {
      name: 'Product',
    },
    {
      name: 'Product',
    },
  ],
};
export default function OrderDetail({navigation}) {
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
          text: 'GBDLeathers',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        rightComponent={{
          icon: 'home',
          color: 'gray',
          size: 26,
          onPress: () => navigation.navigate('NewOrders'),
        }}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <ScrollView>
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'white',
              margin: 6,
              padding: 6,
            }}>
            <View style={{marginLeft: 6}}>
              <Text style={{fontSize: 14}}>2022</Text>
              <Text style={{fontSize: 21, fontWeight: 'bold'}}>5</Text>
              <Text style={{fontSize: 14}}>Dec</Text>
            </View>
            <View style={{marginLeft: 16}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>10:00 AM</Text>
              <Text style={{fontSize: 18, color: 'blue'}}>Mohit Rawat</Text>
              <Text style={{color: 'gray'}}>+91-7895995686</Text>
            </View>

            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
              }}>
              <View style={{marginLeft: 16}}>
                <Text style={{fontSize: 15}}>Total</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>$130</Text>
              </View>
              <Text style={{color: 'brown'}}>Ordered</Text>
            </View>
          </View>

          {order.products.map((prd, index) => (
            <View key={index} style={styles.productStyle}>
              <Image
                source={{
                  uri: `https://mymodernmet.com/wp/wp-content/uploads/2021/01/diy-leather-craft-projects-and-tools-facebook.jpg`,
                }}
                style={styles.productImage}
              />
              <Text style={{fontSize: 18, marginLeft: 10}}>Wallets</Text>
              <View style={{right: 120, position: 'absolute'}}>
                <Text style={{fontSize: 16}}>QTR 5</Text>
                <Text style={{fontSize: 16}}>Qty:- 3</Text>
              </View>
              <View style={{right: 10, position: 'absolute'}}>
                <Text style={{fontSize: 16}}>Total</Text>
                <Text style={{fontSize: 16}}>QTR 100.00</Text>
              </View>
            </View>
          ))}

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'white',
              justifyContent: 'center',
              margin: 6,
              padding: 6,
            }}>
            <View
              style={{
                width: 200,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="map-marker-radius"
                color="blue"
              />
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                Himalayan Coloney, Near Dairy , Najibabad, UttarPradesh 246763
              </Text>
            </View>
          </View>
          <View
            style={{
              margin: 6,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              style={{width: '40%'}}
              icon="account-off"
              mode="contained"
              color="lightgray"
              backgroundColor="white">
              Cancel Order
            </Button>

            <Button
              style={{width: '40%'}}
              icon="account-convert"
              mode="contained"
              color="orange">
              Processing
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  productStyle: {
    margin: 6,
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
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
  },
});
