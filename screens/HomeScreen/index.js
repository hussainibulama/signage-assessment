import {useState, useEffect, useCallback, useRef} from 'react';
import {Text, View, Image, StatusBar, ActivityIndicator} from 'react-native';
import {downloadFile, getUrlExtension} from '../../utilities/helpers';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {
  storeCacheLocalUrls,
  getCacheLocalUrlLists,
} from '../../utilities/storage';
import http from '../../utilities/http';
import {Video} from 'expo-av';
import styles from './style';

const HomeScreen = ({
  navigation,
  initialData = [],
  activeSequence = 0,
  isSearching = false,
  isError = false,
}) => {
  const video = useRef(null);
  const [displayItem, setDisplayItem] = useState(initialData); // this stores the entire list
  const [activeKey, setActiveKey] = useState(activeSequence); // this tells the current display list
  const [search, setSearch] = useState(isSearching); // this is used for first time when downloading files
  const [error, setError] = useState(isError); // this when an error occur while downloading data

  const saveToLocal = async (data) => {
    // function to help us save the file and return the path as fileUrl
    let ext = await getUrlExtension(data?.url);
    const {uri} = await downloadFile(data?.url, ext)?.downloadAsync();
    return {fileURL: uri};
  };

  const getDataFromEndpoint = useCallback(async () => {
    // function that does retrieve the data from the http service
    try {
      setSearch(true);
      // retrieve data from http;
      const resp = await http.get();
      let responseData = resp?.data?.record?.items;

      //this does download files and generate a new path for them.
      const downloadedVideos = await Promise.all(
        responseData.map(async (item) => {
          let result = await saveToLocal(item);
          item.fileURL = result.fileURL;
          return item;
        }),
      );
      // save the new generated array to mount the component
      setDisplayItem(downloadedVideos);
      setSearch(false);
      // store the generated data for offline use
      storeCacheLocalUrls(downloadedVideos);
    } catch (error) {
      setError(true);
      setSearch(false);
    }
  }, []);

  const getLocalStorageFiles = async () => {
    // This fucnction checks if data already exist in storage
    const localData = await getCacheLocalUrlLists();
    if (localData) {
      setDisplayItem(localData);
    } else {
      // otherwise it download fresh one
      getDataFromEndpoint();
    }
  };

  const nextItem = () => {
    //this function decides the sequential listing of data
    if (activeKey === displayItem.length - 1) {
      setActiveKey(0);
    } else {
      setActiveKey(activeKey + 1);
    }
  };
  const onVideoEnd = (status) => {
    // this function helps for videos to decide the next item on screen
    if (status) {
      nextItem();
    }
  };
  const FIVE_SECONDS = 5000;
  useEffect(() => {
    if (displayItem.length === 0) {
      //no point on sending http request if data already exist
      getLocalStorageFiles();
    }
    if (displayItem[activeKey]?.type === 'image') {
      // this handles the clock ticking of the next item and clearing it after
      const intervalId = setTimeout(() => {
        nextItem();
      }, FIVE_SECONDS);
      return () => clearTimeout(intervalId);
    }
  }, [displayItem, activeKey]);
  return (
    <View testID='view-container' style={styles.container}>
      <StatusBar hidden testID='status-bar' />
      {search && (
        //we should show indicators for user experience while loading data
        <View style={styles.loaderMessage}>
          <ActivityIndicator
            animating={true}
            color='#0089AF'
            size='small'
            testID='indicator-id'
            style={styles.activityIndicator}
          />
          <Text testID='loader-text' style={styles.welcomeText}>
            Loading Contents....
          </Text>
        </View>
      )}
      {error && (
        // we should also show indicator if an error occur
        <View style={styles.loaderMessage}>
          <Text testID='errorText' style={styles.welcomeText}>
            Something went wrong please try again
          </Text>
        </View>
      )}
      {displayItem[activeKey]?.type === 'image' && (
        //this displays either image or video as per the file type
        <>
          <View style={styles.circleTimer}>
            <CountdownCircleTimer
              isPlaying
              key={activeKey + 1}
              duration={5}
              testID='countTimer'
              size={50}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[7, 5, 2, 0]}
            ></CountdownCircleTimer>
          </View>

          <Image
            testID='image-id'
            style={styles.imageSize}
            source={{
              uri: displayItem[activeKey]?.fileURL,
            }}
          />
        </>
      )}
      {displayItem[activeKey]?.type === 'video' && (
        <Video
          testID='video-id'
          style={styles.imageSize}
          ref={video}
          source={{
            uri: displayItem[activeKey]?.fileURL,
          }}
          resizeMode='cover'
          shouldPlay
          onPlaybackStatusUpdate={(status) => onVideoEnd(status.didJustFinish)}
        />
      )}
    </View>
  );
};
export default HomeScreen;
