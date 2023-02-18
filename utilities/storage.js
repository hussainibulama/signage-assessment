import AsyncStorage from '@react-native-async-storage/async-storage';

// it should cache the downloded file links on system storage
export async function storeCacheLocalUrls(data) {
  await AsyncStorage.setItem('key_test000', JSON.stringify(data));
}

//it should get cache array of data
export async function getCacheLocalUrlLists() {
  const list = await AsyncStorage.getItem('key_test000');
  if (list !== null) {
    const parsedList = JSON.parse(list);
    return parsedList;
  } else {
    return null;
  }
}
