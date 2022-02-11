import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {Header} from 'react-native-elements';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default function CanceledOrders({navigation}) {
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    getOrders('?status=canceled&sort=-ordered_at');
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getOrders('?status=canceled&sort=-ordered_at');
    });
    return unsubscribe;
  }, [navigation]);

  async function getOrders(query) {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/orders/${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        setCanceledOrders(res.data);
      } else {
        alert(res.message);
      }
    } catch (err) {
      // console.log(err);
      alert('Something went wrong!');
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {canceledOrders.map((order, index) => (
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
            onPress={() =>
              navigation.navigate('OrderDetail', {
                order,
              })
            }>
            <View style={{marginLeft: 6}}>
              <Text style={{fontSize: 14}}>
                {getTime('year', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 21, fontWeight: 'bold'}}>
                {getTime('date', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 14}}>
                {getTime('month', order.ordered_at)}
              </Text>
            </View>
            <View style={{marginLeft: 16}}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {getTime('time', order.ordered_at)}
              </Text>
              <Text style={{fontSize: 18, color: 'blue'}}>
                {order.customer_detail.first_name}{' '}
                {order.customer_detail.last_name}
              </Text>
              <Text style={{color: 'gray'}}>{order.customer_detail.email}</Text>
            </View>

            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
              }}>
              <View style={{marginLeft: 16}}>
                <Text style={{fontSize: 15, textAlign: 'center'}}>Total</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {order.total_cost.currency}{' '}
                  {order.total_cost.value.$numberDecimal}
                </Text>
                <Text style={{color: 'brown', textAlign: 'center'}}>
                  {order.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}
