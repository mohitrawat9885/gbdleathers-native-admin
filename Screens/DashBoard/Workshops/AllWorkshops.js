import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {Avatar, Button} from 'react-native-paper';
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

export default function Workshop({route, navigation}) {
  const [workshops, setWorkshops] = useState([]);
  const [totalDocument, setTotalDocument] = useState(50);
  const [pagelimit, setPagelimit] = useState(25);
  const [workshopListLoadingBottom, setWorkshopListLoadingBottom] =
    useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getWorkshops(`?sort=-start&page=1&limit=${pagelimit}`);
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   setPagelimit(25);
  //   getWorkshops(`?sort=-start&page=1&limit=25`);
  // }, [route.params.type]);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setPagelimit(25);
    getWorkshops(`?sort=-start&page=1&limit=25`);
    // console.log(global.workshopType);
    wait(1000).then(() => setRefreshing(false));
  }, []);
  async function getWorkshops(query, fromBottom) {
    try {
      if (fromBottom) {
        query = query + `${pagelimit + 20}`;
      }
      // console.log('Query ', query);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/workshop/all/${query}`,
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
        setTotalDocument(res.totalDocument);
        if (fromBottom === true) {
          setPagelimit(d => d + 20);
          setWorkshopListLoadingBottom(false);
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed!',
          textBody: res.message,
          button: 'close',
        });

        setWorkshopListLoadingBottom(false);
      }
    } catch (err) {
      // console.log(err);
      setWorkshopListLoadingBottom(false);
      console.log(err);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed!',
        textBody: 'Something went wrong!',
        button: 'close',
      });
      // alert('Something went wrong!');
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
  function WorkshopListLoader() {
    if (workshopListLoadingBottom === true) {
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
  function GetWorkshopSchedules(workshop) {
    // if (workshop.days.length > 1) {
    //   return <Text>{workshop.days.length} Days Workshop</Text>;
    // }
    return (
      <>
        <View>
          <Text style={styles.time}>
            {getDateTime(workshop.days[0].start, 'date')}
          </Text>
          <Text style={styles.time}>
            {getDateTime(workshop.days[0].start, 'time')}
          </Text>
        </View>
        <View>
          <Text style={styles.time}>
            {getDateTime(workshop.days[workshop.days.length - 1].end, 'date')}
          </Text>
          <Text style={styles.time}>
            {getDateTime(workshop.days[workshop.days.length - 1].end, 'time')}
          </Text>
        </View>
      </>
    );
  }
  return (
    <>
      <Header
        backgroundColor="lightgray"
        barStyle="dark-content"
        placement="left"
        leftComponent={{
          text: 'All Workshops',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <View style={{flex: 1, width: '100%', height: '100%', zIndex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent) && totalDocument > pagelimit) {
              setWorkshopListLoadingBottom(true);
              getWorkshops(`?sort=-start&page=1&limit=`, true);
            }
          }}>
          {/* <View
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              marginTop: 100,
            }}> */}
          {workshops.map((workshop, index) => (
            <TouchableOpacity
              // activeOpacity={10}
              // disabled={true}
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
                  <Text style={styles.time}>QTR: {workshop.price}</Text>
                  <Text style={styles.time}>Limit: {workshop.limit}</Text>
                  <Text style={styles.time}>
                    Part: {workshop.participants.length}
                  </Text>
                </View>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: 4,
                  }}>
                  {GetWorkshopSchedules(workshop)}
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
          {WorkshopListLoader()}
          {/* </View> */}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 12,
    color: 'gray',
  },
});
