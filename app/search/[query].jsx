import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import {  searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query])
  // console.log(posts)
  return (
    <SafeAreaView className="bg-primary h-full">
      {/* list of elements */}
      <FlatList 
        data={posts}
        // data = {[]}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}

        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-400">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-secondary-200">
              {query}
            </Text> 

          {/* <View className="mt-1.5">
            <Image 
              source={images.logoSmall}
              className="w-9 h-10"
              resizeMode='contain'/>
          </View> */}

            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
            </View>

            {/* <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos 
              </Text>

              <Trending posts={ posts ?? []}/>
            </View> */}
          </View>

        )}
        
        // What happens when the list is empty
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found!"
            subtitle="No videos found for this search query"
          />
        )}

      /> 
    </SafeAreaView>
  )
}

export default Search