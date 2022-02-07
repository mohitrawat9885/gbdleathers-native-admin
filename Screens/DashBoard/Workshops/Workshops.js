import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Header} from 'react-native-elements';
import {Avatar, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Workshop({navigation}) {
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
            // onPress={() =>
            //   navigation.navigate('EditProfile', {
            //     profile: profile,
            //   })
            // }
            >
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="file-document-edit-outline"
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity
            // onPress={() => chooseGalleryImage()}
            >
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
      {/* <Text>Workshop Screen</Text> */}
    </>
  );
}
