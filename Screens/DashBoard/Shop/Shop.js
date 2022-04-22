import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {Header, BottomSheet} from 'react-native-elements';
import {Avatar, Button, List} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

async function storeUserSession(type) {
  try {
    await EncryptedStorage.setItem('listType', `${type}`);
  } catch (error) {
    await EncryptedStorage.clear();
    RNRestart.Restart();
  }
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default function Shop({route, navigation}) {
  const [categoryProductList, setCategoryProductList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [listType, setListType] = useState(global.listType);
  const [productListLoadingBottom, setProductListLoadingBottom] =
    useState(false);
  const [pagelimit, setPagelimit] = useState(10);
  const [totalDocument, setTotalDocument] = useState();

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    if (listType === 'products') {
      getProductList('?page=1&limit=25');
      setPagelimit(10);
    } else {
      getCategoryProductList();
    }

    setRefreshing(true);
    wait(1000).then(() => setRefreshing(false));
  }, []);

  async function getCategoryProductList() {
    try {
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/category/products`,
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
        setCategoryProductList(res.data);
      } else {
        // alert(res.message);
        setCategoryProductList([]);
      }
    } catch (error) {
      // console.log(error);
      setCategoryProductList([]);
    }
  }
  async function getProductList(query, pos) {
    try {
      if (pos === 'bottom') {
        query = query + `${pagelimit + 10}`;
      }
      console.log(query);
      const session = JSON.parse(
        await EncryptedStorage.getItem('user_session'),
      );
      const response = await fetch(
        `${global.server}/api/v1/gbdleathers/shop/product${query ? query : ''}`,
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
        setProductList(res.data);
        setTotalDocument(res.totalDocument);
        if (pos === 'bottom' && pagelimit < res.totalDocument) {
          setPagelimit(p => p + 10);
          console.log(res.status, pagelimit);
        }
      } else {
        // alert(res.message);
        setProductList([]);
      }
      setProductListLoadingBottom(false);
    } catch (error) {
      // console.log(error);
      setProductList([]);
      setProductListLoadingBottom(false);
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (listType === 'products') {
        getProductList('?page=1&limit=25');
      } else {
        getCategoryProductList();
      }
    });
    return unsubscribe;
  }, [navigation]);

  const [bottomSheet, setBottomSheet] = useState(false);

  function ProductCategoryListLoader() {
    if (productListLoadingBottom) {
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

  function ProductCategoryList() {
    if (listType === 'products') {
      return (
        <>
          {productList?.map((product, index2) => (
            <View style={{width: '100%'}} key={index2}>
              <TouchableOpacity
                onLongPress={() =>
                  navigation.navigate('EditProduct', {
                    product_id: product._id,
                  })
                }>
                <View style={styles.productStyle}>
                  <Image
                    source={{
                      uri: `${global.server}/images/${product.front_image}`,
                    }}
                    style={styles.productImage}
                  />
                  <Text style={{fontSize: 18, marginLeft: 16}}>
                    {product.name}
                  </Text>
                  {/* <View style={{right: 10, position: 'absolute'}}>
                      <Text style={{fontSize: 18}}>
                        QTR {product.price}.00
                      </Text>
                    </View> */}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </>
      );
    } else {
      return (
        <>
          {categoryProductList.map((category, index) => (
            <List.Accordion
              key={index}
              onLongPress={() =>
                navigation.navigate('EditCategory', {
                  category_id: category._id,
                  name: category.name,
                  image: category.image,
                })
              }
              titleStyle={{fontSize: 18, color: 'black'}}
              title={category.name}
              id="1"
              style={{backgroundColor: 'white'}}>
              {category.products.map((product, index2) => (
                <View style={{width: '100%'}} key={index2}>
                  <TouchableOpacity
                    onLongPress={() =>
                      navigation.navigate('EditProduct', {
                        product_id: product._id,
                      })
                    }>
                    <View style={styles.productStyle}>
                      <Image
                        source={{
                          uri: `${global.server}/images/${product.front_image}`,
                        }}
                        style={styles.productImage}
                      />
                      <Text style={{fontSize: 16, marginLeft: 16}}>
                        {product.name}
                      </Text>
                      {/* <View style={{right: 10, position: 'absolute'}}>
                      <Text style={{fontSize: 18}}>
                        QTR {product.price}.00
                      </Text>
                    </View> */}
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </List.Accordion>
          ))}
        </>
      );
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
          text: 'Shop',
          style: {color: 'black', fontSize: 21, justifyContent: 'center'},
        }}
        rightComponent={
          <View style={{flex: 1, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                if (listType !== 'products') {
                  setListType('products');
                  getProductList();
                  storeUserSession('products');
                } else {
                  setListType('categorys');
                  getCategoryProductList();
                  storeUserSession('categorys');
                }
              }}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="format-list-checks"
                color="gray"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBottomSheet(true)}>
              <Avatar.Icon
                style={{backgroundColor: 'white'}}
                size={38}
                icon="dots-vertical"
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

      <View style={{flex: 1, width: '100%', height: '100%', zIndex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={({nativeEvent}) => {
            if (
              isCloseToBottom(nativeEvent) &&
              listType === 'products' &&
              totalDocument > pagelimit
            ) {
              setProductListLoadingBottom(true);
              getProductList(`?page=1&limit=`, 'bottom');
            }
          }}
          // scrollEventThrottle={400}
        >
          {ProductCategoryList()}
          {ProductCategoryListLoader()}
        </ScrollView>
      </View>

      <BottomSheet isVisible={bottomSheet}>
        <View
          style={{
            width: '100%',
            flex: 1,
            // justifyContent: 'center',
            alignItems: 'center',
            height: 170,
            padding: '3%',
            backgroundColor: 'rgb(255, 255, 255)',
          }}>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => {
              setBottomSheet(false);
              navigation.navigate('AddProduct');
            }}>
            <Text style={styles.bottomMenuText}>Create New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => {
              setBottomSheet(false);
              navigation.navigate('AddCategory');
            }}>
            <Text style={styles.bottomMenuText}>Create New Category</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottonMenu}
            onPress={() => setBottomSheet(false)}>
            <Text style={styles.bottomMenuText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  bottonMenu: {
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    padding: 3,
    color: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'rgb(235, 235, 235)',
    borderBottomWidth: 1,
  },
  bottomMenuText: {
    fontSize: 16,
    letterSpacing: 1,
    fontFamily: 'Arial',
  },

  categoryStyle: {
    marginTop: 10,
    paddingLeft: 10,
    width: '98%',
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',

    // alignItems: 'center'
  },
  productStyle: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingLeft: 10,
    width: '98%',
    height: 90,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'black',
  },
});
