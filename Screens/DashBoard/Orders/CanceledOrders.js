import React from 'react';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {Header} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const newOrders = [
  {
    name: 'Mohit',
  },
];

export default function CanceledOrders({navigation}) {
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
          text: 'Canceled Orders',
          style: {color: 'red', fontSize: 21, justifyContent: 'center'},
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
        {newOrders.map((order, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              flexDirection: 'row',
              backgroundColor: 'white',
              marginLeft: 6,
              marginRight: 6,
              borderTopColor: 'lightgray',
              borderTopWidth: 2,
              padding: 6,
            }}
            onPress={() => navigation.navigate('OrderDetail')}>
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
              <Text style={{color: 'red'}}>Canceled</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}
