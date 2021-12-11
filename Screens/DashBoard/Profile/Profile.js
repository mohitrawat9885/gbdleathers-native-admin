import React, {useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, Image} from 'react-native';
import {Header, BottomSheet} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const gallery = [
  {
    name: 'mo',
  },
  {
    name: 'r',
  },
  {
    name: 'mo',
  },
  {
    name: 'r',
  },
];

export default function Profile({navigation}) {
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
          text: 'Profile',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        //   rightComponent={{ icon: 'home', color: 'gray', size: 27 }, { icon: 'menu', color: 'gray', size: 27 }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="file-document-edit-outline"
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="image-plus"
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
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'white',
          paddingBottom: 200,
        }}>
        <View
          style={{
            height: 240,
          }}>
          <View style={{backgroundColor: 'lightgray'}}>
            <Image
              source={{
                uri: `https://media.istockphoto.com/photos/many-tools-of-the-leather-craftsman-picture-id1297871891?b=1&k=20&m=1297871891&s=170667a&w=0&h=l1_XbtJtuI9jcjEcRZ3lyn3v8GAkogWKn2iWaQEORNo=`,
              }}
              style={{width: 380, height: 200}}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              top: 110,
              alignItems: 'center',
            }}>
            <Image
              source={{
                uri: `https://diyprojects.com/wp-content/uploads/2020/12/man-working-leather-using-crafting-diy-leather-craft-SS-Featured-1.jpg`,
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: 'white',
                borderWidth: 5,
                shadowColor: 'gray',
                borderRadius: 70,
                backgroundColor: 'lightgray',
              }}
            />
          </View>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 20,
              fontSize: 22,
              textAlign: 'center',
            }}>
            Mohit
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            width: 300,
          }}>
          <Avatar.Icon
            style={{backgroundColor: 'white'}}
            size={38}
            icon="phone"
            color="blue"
          />
          <Text style={{fontSize: 16}}>+91-7895995686</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
            width: 300,
          }}>
          <Avatar.Icon
            style={{backgroundColor: 'white'}}
            size={38}
            icon="email"
            color="blue"
          />
          <Text style={{fontSize: 16}}>mohitrawat9885@gmail.com</Text>
        </View>

        <View
          style={{
            width: 200,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Avatar.Icon
            style={{backgroundColor: 'white'}}
            size={38}
            icon="map-marker-radius"
            color="blue"
          />
          <Text style={{fontSize: 16, textAlign: 'center'}}>
            Himalayan Coloney, Najibabad, UttarPradesh, 276346, Near dairy
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 'auto',
            paddingTop: 10,
            marginTop: 30,
            borderTopWidth: 1,
            marginBottom: 3,
            borderTopColor: 'lightgray',
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {gallery.map((val, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: 190,
                height: 140,
                marginBottom: 4,
              }}>
              <Image
                source={{
                  uri: `https://diyprojects.com/wp-content/uploads/2020/12/man-working-leather-using-crafting-diy-leather-craft-SS-Featured-1.jpg`,
                }}
                style={{
                  width: 190,
                  height: 140,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <BottomSheet isVisible={bottomSheet}>
          <Header
            backgroundColor="lightgray"
            barStyle="dark-content"
            placement="left"
            leftComponent={{
              icon: 'close',
              color: 'black',
              size: 28,
              onPress: () => setBottomSheet(false),
            }}
            centerComponent={{
              text: 'Add to Restaurant Gallery',
              style: {color: 'black', fontSize: 22, justifyContent: 'center'},
            }}
            rightComponent={{
              icon: 'check',
              color: 'black',
              size: 28,
              // onPress: () => uploadGalleryImage(),
            }}
            containerStyle={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <View
            style={{
              width: '100%',
              flex: 1,
              // justifyContent: 'center',
              alignItems: 'center',
              height: 350,
              backgroundColor: 'rgb(240, 240, 240)',
            }}>
            {/* <Image
              source={{
                uri: galleryImage.uri,
              }}
              style={{width: 380, height: 200, marginTop: 20}}
            /> */}
          </View>
        </BottomSheet>
      </ScrollView>
    </>
  );
}
