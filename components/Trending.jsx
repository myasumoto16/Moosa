import { View, Text, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useState, useRef } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import YoutubeIframe from 'react-native-youtube-iframe'
import WebView from 'react-native-webview'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1,
  }
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  }
}

const getYouTubeVideoId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|.+\?v=)|youtu\.be\/)([^&\n?#]+)/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
}


const TrendingItem = ( {activeItem, item} ) => {
  const [play, setPlay] = useState(false);
  // const videoRef = useRef(null);

  // const handlePlayVideo = () => {
  //   setPlay(true)
  //   console.log(videoRef)
  //   videoRef.current?.playAsync();
  // }
  // console.log(item.video)
  const youtubeId = getYouTubeVideoId(item.video)
  console.log(item.video)
  // console.log(youtubeId)
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      { play ? (
          <Video 
            source={{uri: item.video}}
            className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if(status.didJustFinish){
                setPlay(false);
              }
            }}
          
          />
          // <YoutubeIframe
          //   style={{ width: '100%', height: 250 }} // Use inline styles
          //   // className="w-52 h-52 rounded-[35px] mt-3 bg-white/10"
          //   videoId={youtubeId} // The YouTube video ID
          //   play={true}
          //   onChangeState={(e) => {
          //     console.log('Video State:', e);
          //     if (e === 'ended') {
          //       setPlay(false);
          //     }
          //   }}
          // />
        //   <WebView
        //   className="w-52 h-52 rounded-[35px] mt-3 bg-white/10"
        //   onMessage={(event) => {
        //     if (event.nativeEvent.data === 'videoEnded') {
        //       setPlay(false); // Set play to false when video ends
        //     }
        //   }}
        //   javaScriptEnabled={true}
        //   source={{ uri: `https://www.youtube.com/embed/${youtubeId}?autoplay=1` }} // Use the embed URL
        // />
        ) : (
          <TouchableOpacity className="relative justify-center items-center" activeOpacity={.7}
          onPress={() => setPlay(true)}
          >
            <ImageBackground 
              source={{
                uri: item.thumbnail
              }}
              className="w-52 h-72 overflow-hidden rounded-[35px] my-5 shadow-lg shadow-black/40" resizeMode='cover'
            />

            <Image 
              source={icons.play}
              className="w-12 h-12 absolute"
              resizemode='contain'
            />

          </TouchableOpacity>
        )
      }

    </Animatable.View>
  )
}
const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[1]) // first post
  // console.log(posts)

  const viewableItemsChanged = ({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }
  return (
    <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id }
        renderItem={({item}) => (
            <TrendingItem activeItem={activeItem} item = {item}/>
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70
        }}
        contentOffset={{x: 170}}
        horizontal
    />
  )
}

export default Trending