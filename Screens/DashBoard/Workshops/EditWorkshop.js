import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {colors, Header, Icon} from 'react-native-elements';
import {Avatar, Button, TextInput, Switch} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import ImagePicker, {
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

import {ALERT_TYPE, Dialog, Root, Toast} from 'react-native-alert-notification';

export default function CreateWorkshop({route, navigation}) {
  const [ImageData, setImageData] = useState();
  const [ImageName, setImageName] = useState(route.params.workshop.banner);
  const [name, setName] = useState(route.params.workshop.name);
  const [price, setPrice] = useState(`${route.params.workshop.price}`);
  const [limit, setLimit] = useState(`${route.params.workshop.limit}`);
  const [summary, setSummary] = useState(route.params.workshop.summary);
  const [location, setLocation] = useState(route.params.workshop.location);
  const [days, setDays] = useState(() => {
    let dates = [];
    for (let i in route.params.workshop.days) {
      dates.push({
        start: new Date(route.params.workshop.days[i].start),
        end: new Date(route.params.workshop.days[i].end),
      });
    }
    return dates;
  });
  const [dateType, setDateType] = useState('start');

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [mode, setMode] = useState('date');
  const [dayIndex, setDayIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [active, setActive] = useState(route.params.workshop.active);
  const toggleSwitch = () => setActive(previousState => !previousState);

  const showDatePicker = (mode, type, index) => {
    setMode(mode);
    setDateType(type);
    setDayIndex(index);
    setDatePickerVisibility(true);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = date => {
    hideDatePicker();
    if (dateType === 'start')
      setDays(d => {
        let nd = [...d];
        nd[dayIndex].start = date;
        return nd;
      });
    else
      setDays(d => {
        let nd = [...d];
        nd[dayIndex].end = date;
        return nd;
      });
  };
  const HandleSubmit = () => {
    Alert.alert('Submit Alert', 'Update Workshop ?', [
      {
        text: 'Cancel',
      },
      {text: 'OK', onPress: () => UploadCategory()},
    ]);
  };

  async function UploadCategory() {
    if (!name) {
      return;
    }
    try {
      setIsLoading(true);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const data = new FormData();
      if (ImageData) {
        data.append('banner', {
          name: ImageData.assets[0].fileName,
          type: ImageData.assets[0].type,
          uri:
            Platform.OS === 'android'
              ? ImageData.assets[0].uri
              : ImageData.assets[0].uri.replace('file://', ''),
        });
      }
      data.append('name', name);
      data.append('price', price);
      data.append('limit', limit);
      if (summary) data.append('summary', summary);
      if (location) data.append('location', location);
      days.forEach(day => data.append('days[]', JSON.stringify(day)));

      if (active == true || active == false) data.append('active', active);

      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/workshop/${route.params.workshop._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${global.token_prefix} ${session.token}`,
          },
          body: data,
        },
      );
      const res = JSON.parse(await response.text());
      if (res.status === 'success') {
        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Workshop Updated Successfully!',
          button: 'close',
        });
      } else if (res.status === 'error') {
        // alert('Server Error');
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed!',
          textBody: `${res.message}`,
          button: 'close',
        });
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failed!',
          textBody: res.message,
          button: 'close',
        });
        // alert('Unauthorized access');
      }
    } catch (error) {
      // console.log('Workshop error ', error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Failed!',
        textBody: 'Something went wrong!',
        button: 'close',
      });
    }
    setIsLoading(false);
  }

  const chooseImage = async () => {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    } else if (result.error) {
      alert('Problem Picking Image');
      return;
    } else {
      setImageData(result);
    }
  };

  function RenderImage() {
    if (ImageData) {
      return (
        <Image
          source={{
            uri: ImageData.assets[0].uri,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    } else {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            backgroundColor: 'rgb(230, 235, 235)',
            borderColor: 'lightgray',
          }}>
          <Image
            source={{uri: `${global.server}/images/${ImageName}`}}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </View>
      );
    }
  }
  function LoadingPage() {
    if (isLoading) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, .8)',
            zIndex: 100,
            position: 'absolute',
          }}>
          <ActivityIndicator size={45} color="black" />
        </View>
      );
    } else {
      return <></>;
    }
  }
  // function getDateTime(date, type) {
  //   let d = new Date(date);
  //   if (type === 'date') {
  //     return String(d.toDateString());
  //   }
  //   let time = d
  //     .toString()
  //     .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  //   if (time.length > 1) {
  //     // If time format correct
  //     time = time.slice(1); // Remove full string match value
  //     time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
  //     time[0] = +time[0] % 12 || 12; // Adjust hours
  //   }
  //   return time.join('');
  //   // return String(d.toTimeString());
  // }
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
          icon: 'close',
          color: 'black',
          size: 28,
          onPress: () => navigation.goBack(),
        }}
        centerComponent={{
          text: 'Update Workshop',
          style: {color: 'black', fontSize: 22, justifyContent: 'center'},
        }}
        rightComponent={{
          icon: 'check',
          color: 'black',
          size: 28,
          onPress: () => HandleSubmit(),
        }}
        containerStyle={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
      <LoadingPage />
      <ScrollView>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={mode}
          date={
            dateType === 'start' ? days[dayIndex]?.start : days[dayIndex]?.end
          }
          onConfirm={date => {
            handleDateConfirm(date);
          }}
          onCancel={hideDatePicker}
        />
        <View style={styles.container}>
          <TouchableOpacity
            style={{
              width: 400,
              marginTop: 10,
              marginBottom: 10,
              height: 400,
            }}
            onPress={() => chooseImage()}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {RenderImage()}
            </View>
          </TouchableOpacity>
          <View
            style={{
              width: '95%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'lightgray',
              padding: 5,
            }}>
            {days?.map((date, i) => (
              <View
                key={i}
                style={{
                  width: '95%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'lightgray',
                }}>
                <View>
                  <TouchableOpacity
                    onPress={() => showDatePicker('date', 'start', i)}>
                    <Text style={styles.date}>
                      {getDateTime(date.start, 'date')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showDatePicker('time', 'start', i)}>
                    <Text style={styles.date}>
                      {getDateTime(date.start, 'time')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Button
                    color="gray"
                    onPress={() =>
                      setDays(d => {
                        if (days.length === 1) return d;
                        let nd = [];
                        for (let x in d) {
                          if (x == i) continue;
                          nd.push(d[x]);
                        }
                        return nd;
                      })
                    }>
                    ❌ Day {i + 1}
                  </Button>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => showDatePicker('date', 'end', i)}>
                    <Text style={styles.date}>
                      {getDateTime(date.end, 'date')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => showDatePicker('time', 'end', i)}>
                    <Text style={styles.date}>
                      {getDateTime(date.end, 'time')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <Button
              onPress={() =>
                setDays(d => {
                  let nd = [...d];
                  nd.push({
                    start: new Date(),
                    end: new Date(),
                  });
                  return nd;
                })
              }
              color="gray"
              style={{
                borderWidth: 1,
                marginTop: 5,
                marginBottom: 5,
                borderColor: 'lightgray',
                color: 'gray',
              }}>
              Add Day {days.length + 1}
            </Button>
          </View>
          <TextInput
            style={styles.input}
            label="Name"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={name}
            onChangeText={val => {
              setName(val);
            }}
          />
          <View
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{
                width: '48%',
                padding: 8,
                marginTop: 5,
                marginBottom: 5,
                height: 45,
                fontSize: 16,
                fontWeight: '500',
              }}
              label="Price"
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={price}
              type="number"
              keyboardType={'numeric'}
              onChangeText={val => {
                setPrice(val);
              }}
            />
            <TextInput
              style={{
                width: '48%',
                padding: 8,
                marginTop: 5,
                marginBottom: 5,
                height: 45,
                fontSize: 16,
                fontWeight: '500',
              }}
              label="Limit"
              autoCapitalize="none"
              mode="outlined"
              color="black"
              selectionColor="black"
              underlineColor="gray"
              activeUnderlineColor="black"
              outlineColor="gray"
              activeOutlineColor="black"
              value={limit}
              type="number"
              keyboardType={'numeric'}
              onChangeText={val => {
                setLimit(val);
              }}
            />
          </View>

          <TextInput
            style={styles.input}
            label="Summary"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={summary}
            onChangeText={val => {
              setSummary(val);
            }}
          />
          <TextInput
            style={styles.input}
            label="Location"
            autoCapitalize="none"
            mode="outlined"
            color="black"
            selectionColor="black"
            underlineColor="gray"
            activeUnderlineColor="black"
            outlineColor="gray"
            activeOutlineColor="black"
            value={location}
            onChangeText={val => {
              setLocation(val);
            }}
          />
          <View
            style={{
              width: '90%',
              display: 'flex',
              flexDirection: 'row-reverse',
              marginBottom: 10,
            }}>
            <Switch
              trackColor={{false: 'gray', true: 'gray'}}
              thumbColor={active ? 'green' : 'red'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={active}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    marginBottom: 120,
  },
  input: {
    width: '100%',
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    padding: 8,
    margin: 3,
    fontSize: 11,
    // color: 'gray',
    backgroundColor: 'rgb(230, 230, 230)',
    // borderRadius: 12,

    textAlign: 'center',
  },
});
