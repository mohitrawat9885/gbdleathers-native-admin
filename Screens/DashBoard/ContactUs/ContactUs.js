import React, {useState} from 'react';
import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Header} from 'react-native-elements';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ALERT_TYPE, Dialog, Root, Toast} from 'react-native-alert-notification';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default function ContactUs({navigation}) {
  const [contacts, setContacts] = useState([]);
  const [totalDocument, setTotalDocument] = useState(50);
  const [pagelimit, setPagelimit] = useState(25);
  const [orderListLoadingBottom, setOrderListLoadingBottom] = useState(false);
  const HandleDelete = id => {
    Alert.alert('Submit Alert', 'Do you want to remove this contact ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => HandleDelete2(id)},
    ]);
  };
  const HandleDelete2 = id => {
    Alert.alert('Submit Alert', 'Sure ?', [
      {
        text: 'No',
      },
      {text: 'Yes', onPress: () => deleteContact(id)},
    ]);
  };
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setPagelimit(25);
    getContacts('?sort=-created_at&page=1&limit=25', false);
    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getContacts(`?sort=-created_at&page=1&limit=${pagelimit}`, false);
    });
    return unsubscribe;
  }, [navigation]);

  async function getContacts(query, fromBottom) {
    try {
      if (fromBottom) {
        query = query + `${pagelimit + 20}`;
      }
      // console.log(query)
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/contact-us/${query}`,
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
        setContacts(res.data);
        setTotalDocument(res.totalDocument);
        if (fromBottom === true) {
          setPagelimit(d => d + 20);
          setOrderListLoadingBottom(false);
        }
        // console.log("page", pagelimit,"docs", totalDocument)
      } else {
        alert(res.message);
        setOrderListLoadingBottom(false);
      }
    } catch (err) {
      // console.log(err);
      setOrderListLoadingBottom(false);
      alert('Something went wrong!');
    }
  }
  async function deleteContact(id) {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/contact-us/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
        },
      );
      if (response.status === 204) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: 'Success!',
          textBody: 'Contact Deleted Successfully!',
        });
        getContacts(`?sort=-created_at&page=1&limit=${pagelimit}`, false);
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
  function OrderListLoader() {
    if (orderListLoadingBottom === true) {
      return (
        <View
          style={{
            height: 58,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="gray" />
        </View>
      );
    } else {
      return <></>;
    }
  }
  return (
    <>
      <Header
        backgroundColor="lightgray"
        barStyle="dark-content"
        placement="left"
        leftComponent={{
          icon: 'keyboard-backspace',
          color: 'black',
          size: 28,
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: 'Contacts',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <ScrollView
        style={{
          marginBottom: 10,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent) && totalDocument > pagelimit) {
            setOrderListLoadingBottom(true);
            getContacts(`?sort=-created_at&page=1&limit=`, true);
          }
        }}>
        {contacts.map((contact, index) => (
          <TouchableOpacity
            activeOpacity={1}
            key={index}
            style={{
              flex: 1,
              // flexDirection: 'c',
              backgroundColor: 'white',
              marginLeft: 6,
              marginRight: 6,
              borderTopColor: 'lightgray',
              // borderTopWidth: 2,
              padding: 2,
            }}
            onLongPress={() => HandleDelete(contact._id)}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'white',
                // marginLeft: 6,
                marginRight: 6,
                borderTopColor: 'lightgray',
                borderTopWidth: 2,
                padding: 6,
              }}>
              <View style={{marginLeft: 6}}>
                <Text style={{fontSize: 11}}>
                  {getTime('year', contact.created_at)}
                </Text>
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  {getTime('date', contact.created_at)}
                </Text>
                <Text style={{fontSize: 12}}>
                  {getTime('month', contact.created_at)}
                </Text>
              </View>
              <View style={{marginLeft: 16}}>
                <Text
                  style={{fontSize: 12, color: 'black', fontWeight: 'bold'}}>
                  {getTime('time', contact.created_at)}
                </Text>
                <Text style={{fontSize: 13, color: 'black'}}>
                  {contact.name}
                </Text>
                <Text style={{fontSize: 12, color: 'gray'}}>
                  {contact.email}
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                }}>
                <Text>{contact.number}</Text>
                {/* <Text>{contact.message}</Text> */}
                {/* <View style={{marginLeft: 16}}>
                <Text style={{fontSize: 11, textAlign: 'center'}}>Total</Text>
                <Text style={{fontSize: 11, fontWeight: 'bold'}}>
                  {order.total_cost.currency}{' '}
                  {order.total_cost.value.$numberDecimal}
                </Text>
                <Text
                  style={{fontSize: 11, color: 'brown', textAlign: 'center'}}>
                  {order.status}
                </Text>
              </View> */}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                marginLeft: 10,
                // marginRight: 15,
                paddingRight: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                }}>
                Message:
              </Text>
              <Text
                style={{
                  textAlign: 'auto',
                }}>
                {contact.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        {OrderListLoader()}
      </ScrollView>
    </>
  );
}
