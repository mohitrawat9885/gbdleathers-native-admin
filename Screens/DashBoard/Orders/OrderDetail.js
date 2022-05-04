import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ALERT_TYPE, Dialog, Root, Toast} from 'react-native-alert-notification';

export default function OrderDetail({route, navigation}) {
  const [order, setOrder] = useState(route.params.order);

  const HandleComplete = () => {
    Alert.alert('Submit Alert', 'Is Order Completed ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => updateOrder('completed')},
    ]);
  };
  const HandleProcessing = () => {
    Alert.alert('Submit Alert', 'Is Order Processing ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => updateOrder('pending')},
    ]);
  };
  const HandleCancel = () => {
    Alert.alert('Submit Alert', 'Cancel This Order ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => updateOrder('canceled')},
    ]);
  };
  const HandleDelete = () => {
    Alert.alert('Submit Alert', 'Delete This Order ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => HandleDelete2()},
    ]);
  };
  const HandleDelete2 = () => {
    Alert.alert('Delete Alert', 'Delete Order Permanently ?', [
      {
        text: 'No',
      },
      {text: 'Delete', onPress: () => deleteOrder('canceled')},
    ]);
  };

  async function updateOrder(operation) {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/orders/${order._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
          body: JSON.stringify({
            status: operation,
          }),
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        Dialog.show({
          type:
            operation !== 'completed' ? ALERT_TYPE.WARNING : ALERT_TYPE.SUCCESS,
          title: String(operation).toUpperCase(),
          textBody: `Order is now ${operation}`,
          button: 'close',
        });
        setOrder(res.data.data);
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Failed!',
          textBody: res.message,
        });
      }
    } catch (err) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Something went wrong or Internet is disconnected!',
      });
    }
  }

  async function deleteOrder() {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/orders/${order._id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      if (response.status === 204) {
        navigation.goBack();
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Success!',
          textBody: 'Order Deleted Successfully!',
        });
        return;
      }
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Something went wrong. Try again later.',
      });
    } catch (err) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: 'Failed!',
        textBody: 'Something went wrong or Internet is disconnected!',
      });
    }
  }

  function getTime(op, d) {
    const date = new Date(d);
    if (op === 'time') {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes.toString().padStart(2, '0');
      let strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    } else if (op === 'year') {
      return date.getFullYear();
    } else if (op === 'date') {
      if (date.getDate() < 10) {
        return '0' + date.getDate();
      }
      return date.getDate();
    } else if (op === 'month') {
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return months[date.getMonth()];
    }
  }
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
              <Text style={{fontSize: 12}}>
                {getTime('year', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {getTime('date', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 13}}>
                {getTime('month', order.ordered_at)}
              </Text>
            </View>
            <View style={{marginLeft: 16}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {getTime('time', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 14, color: 'blue'}}>
                {order.customer_detail.first_name}{' '}
                {order.customer_detail.last_name}
              </Text>
              <Text style={{fontSize: 12, color: 'gray'}}>
                {order.customer_detail.email}
              </Text>
            </View>

            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
              }}>
              <View style={{marginLeft: 16}}>
                <Text style={{fontSize: 11, textAlign: 'center'}}>Total</Text>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                  {order.total_cost.currency}{' '}
                  {order.total_cost.value.$numberDecimal}
                </Text>
                <Text
                  style={{fontSize: 11, color: 'brown', textAlign: 'center'}}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>

          {order.products.map((product, index) => (
            <View key={index}>
              <View style={styles.productNameStyle}>
                <Text style={{fontSize: 16, color: 'black'}}>
                  {product.name}
                </Text>
                {/* <Text>COLOR: Red</Text> */}
              </View>
              <View style={styles.productPropertiesStyle}>
                {product.properties?.map((v, i) => (
                  <Text
                    key={i}
                    style={{
                      color: 'rgb(110, 110, 110)',
                      fontSize: 12,
                    }}>
                    {v.name}: {v.value}
                  </Text>
                ))}
              </View>
              <View key={index} style={styles.productStyle}>
                <Image
                  source={{
                    uri: `${global.server}/images/${product.image}`,
                  }}
                  style={styles.productImage}
                />
                <View>
                  <Text style={{fontSize: 16}}>
                    {order.total_cost.currency}
                    {':'}
                    {product.price}
                  </Text>
                  <Text style={{fontSize: 14}}>
                    Quantity: {product.quantity}
                  </Text>
                </View>
                <View style={{marginRight: 10}}>
                  <Text style={{fontSize: 12}}>Total</Text>
                  <Text style={{fontSize: 13}}>
                    {order.total_cost.currency}{' '}
                    {product.price * product.quantity}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View
            style={{
              backgroundColor: 'white',
              margin: 6,
              padding: 6,
            }}>
            <View
              style={{
                width: 200,
              }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  marginLeft: 10,
                }}>
                {order.address.first_name} {order.address.last_name}
              </Text>
            </View>
          </View>

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
                size={30}
                icon="map-marker-radius"
                color="blue"
              />

              <Text style={{fontSize: 14, textAlign: 'center'}}>
                {order.address.address_1}, {order.address.address_2},
                {order.address.city}, {order.address.postal_zip_code}{' '}
                {order.address.province} {order.address.country}{' '}
                {order.address.phone}
              </Text>
            </View>
          </View>
          <View
            style={{
              margin: 6,
              marginTop: 30,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              style={{width: '40%'}}
              icon="account-off"
              mode="contained"
              color="gray"
              backgroundColor="white"
              onPress={() => HandleCancel()}>
              Cancel Order
            </Button>

            <Button
              style={{width: '40%'}}
              icon="account-convert"
              mode="contained"
              color="orange"
              onPress={() => HandleProcessing()}>
              Processing
            </Button>
          </View>

          <View
            style={{
              margin: 6,
              marginTop: 20,
              marginBottom: 60,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Button
              style={{width: '40%'}}
              icon="delete"
              mode="contained"
              color="red"
              backgroundColor="white"
              onPress={() => HandleDelete()}>
              Delete Order
            </Button>
            <Button
              style={{width: '40%'}}
              icon="account-check"
              mode="contained"
              color="green"
              onPress={() => HandleComplete()}>
              Completed
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
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 10,
    width: '98%',
    height: 90,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productNameStyle: {
    margin: 6,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    borderBottomColor: 'lightgray',
    paddingLeft: 10,
    width: '98%',
    height: 40,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPropertiesStyle: {
    margin: 6,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: 'lightgray',
    borderBottomColor: 'lightgray',
    paddingLeft: 30,
    width: '98%',
    // height: 45,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    // borderRadius: 35,
    // borderWidth: 1,
    // borderColor: 'black',
  },
});
