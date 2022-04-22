import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNoFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Workshop({navigation}) {
  const [workshops, setWorkshops] = useState([]);
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getWorkshops();
    });
    return unsubscribe;
  }, [navigation]);

  async function getWorkshops(query, fromBottom) {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/workshop`,
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
        setWorkshops(res.data);
      } else {
        alert(res.message);
      }
    } catch (err) {
      // console.log(err);

      alert('Something went wrong!');
    }
  }
  function getDateTime(d, op) {
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
    } else if (op === 'date') {
      let _date;
      if (date.getDate() < 10) {
        _date = `${'0' + date.getDate()}`;
      } else _date = date.getDate();

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
      return `${_date}-${months[date.getMonth()]}-${date.getFullYear()}`;
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
          text: 'Workshops',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        //   rightComponent={{ icon: 'home', color: 'gray', size: 27 }, { icon: 'menu', color: 'gray', size: 27 }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateWorkshop')}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="table-plus"
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
        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            marginTop: 6,
          }}>
          {workshops.map((workshop, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: '96%',
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                borderRadius: 3,
                borderBottomColor: 'lightgray',
                borderBottomWidth: 1,
                marginTop: 3,
                marginBottom: 4,
              }}
              // onStartShouldSetResponder={() => alert('hi')}
              onPress={() =>
                navigation.navigate('WorkshopDetail', {workshop: workshop})
              }>
              <Image
                style={{
                  width: 110,
                  height: 110,
                  borderBottomLeftRadius: 3,
                  borderTopLeftRadius: 3,
                }}
                source={{
                  uri: `${global.server}/images/${workshop.banner}`,
                }}
              />
              <View
                style={{
                  padding: 5,
                  width: '68%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                  numberOfLines={1}>
                  {workshop.name}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                  }}
                  numberOfLines={2}>
                  {workshop.location}
                </Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: 5,
                    // borderBottomColor: 'lightgray',
                    // borderBottomWidth: 1,
                  }}>
                  <Text style={styles.time}>QTR:- {workshop.price}</Text>
                  <Text style={styles.time}>Limit:- {workshop.limit}</Text>
                  <Text style={styles.time}>
                    Part:- {workshop.participants.length}
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: 4,
                  }}>
                  <View>
                    <Text style={styles.time}>
                      {getDateTime(workshop.start_date, 'date')}
                    </Text>
                    <Text style={styles.time}>
                      {getDateTime(workshop.start_date, 'time')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.time}>
                      {getDateTime(workshop.end_date, 'date')}
                    </Text>
                    <Text style={styles.time}>
                      {getDateTime(workshop.end_date, 'time')}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: `${workshop.active ? 'green' : 'red'}`,
                    }}>
                    {`${workshop.active ? 'Active' : 'Not Active'}`}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
