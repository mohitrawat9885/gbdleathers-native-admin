import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Workshop({route, navigation}) {
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
        // leftComponent={{
        //   icon: 'menu',
        //   color: 'black',
        //   size: 28,
        //   onPress: () => navigation.openDrawer(),
        // }}
        leftComponent={{
          icon: 'close',
          color: 'black',
          size: 28,
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: 'Workshop Detail',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        //   rightComponent={{ icon: 'home', color: 'gray', size: 27 }, { icon: 'menu', color: 'gray', size: 27 }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditWorkshop', {
                  workshop: route.params.workshop,
                })
              }>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="calendar-edit"
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('WorkshopGallary', {
                  images: route.params.workshop.images,
                  id: route.params.workshop._id,
                })
              }>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="image-multiple"
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
            marginTop: 10,
            padding: 8,
          }}>
          <View
            style={{
              width: '96%',
              backgroundColor: 'white',
              borderRadius: 3,
              borderBottomColor: 'lightgray',
              borderBottomWidth: 1,
              marginBottom: 25,
            }}
            // onStartShouldSetResponder={() => alert('hi')}
            // onPress={() => navigation.navigate('WorkshopDetail')}
          >
            <View
              style={{
                padding: 5,
                // width: '68%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  marginBottom: 20,
                }}>
                {route.params.workshop.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  marginBottom: 10,
                }}>
                {route.params.workshop.location}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 5,
                  marginBottom: 10,
                  // borderBottomColor: 'lightgray',
                  // borderBottomWidth: 1,
                }}>
                <Text style={styles.time}>
                  QTR: {route.params.workshop.price}
                </Text>
                <Text style={styles.time}>
                  Limit: {route.params.workshop.limit}
                </Text>
                <Text style={styles.time}>
                  Part: {route.params.workshop.participants.length}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: route.params.workshop.name ? 'green' : 'red',
                  }}>
                  {route.params.workshop.active ? 'Active' : 'In Not Active'}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  paddingRight: 4,
                  marginBottom: 10,
                }}>
                {route.params.workshop.days.map((d, i) => (
                  <View
                    key={i}
                    style={{
                      padding: 5,
                      borderWidth: 1,
                      borderColor: 'lightgray',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 2,
                    }}>
                    <View>
                      <Text style={styles.time}>
                        {getDateTime(d.start, 'date')}
                      </Text>
                      <Text style={styles.time}>
                        {getDateTime(d.start, 'time')}
                      </Text>
                    </View>
                    <Text>Day {i + 1}</Text>
                    <View>
                      <Text style={styles.time}>
                        {getDateTime(d.start, 'date')}
                      </Text>
                      <Text style={styles.time}>
                        {getDateTime(d.end, 'time')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <Image
              style={{
                width: '100%',
                height: 310,
                // borderBottomLeftRadius: 3,
                // borderTopLeftRadius: 3,
              }}
              source={{
                uri: `${global.server}/images/${route.params.workshop.banner}`,
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
            }}>
            {route.params.workshop.participants.map((customer, index) => (
              <View
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
                }}>
                <View style={{marginLeft: 6}}>
                  <Text style={{fontSize: 11}}>
                    {getTime('year', customer.created_at)}
                  </Text>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {getTime('date', customer.created_at)}
                  </Text>
                  <Text style={{fontSize: 13}}>
                    {getTime('month', customer.created_at)}
                  </Text>
                </View>
                <View style={{marginLeft: 16}}>
                  <Text
                    style={{fontSize: 13, color: 'black', fontWeight: 'bold'}}>
                    {getTime('time', customer.created_at)}
                  </Text>
                  <Text style={{fontSize: 14, color: 'blue'}}>
                    {customer.name}
                  </Text>
                  <Text style={{color: 'gray'}}>{customer.email}</Text>
                </View>

                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                  }}>
                  {/* <View style={{marginLeft: 16}}>
                  <Text style={{fontSize: 13, textAlign: 'center'}}>Total</Text>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                    1200 2222
                  </Text>
                  <Text style={{color: 'brown', textAlign: 'center'}}>
                    Active
                  </Text>
                </View> */}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 13,
    color: 'gray',
    textAlign: 'center',
  },
});
