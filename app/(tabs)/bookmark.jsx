import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import EmptyState from '../../components/EmptyState'
import {  getSavedPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useFocusEffect } from '@react-navigation/native';


const Bookmark = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(() => getSavedPosts(user.$id));

    // Refetch posts every time the page is focused
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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
            <Text className='text-2xl text-secondary-200 font-psemibold'>
              Saved Posts
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput />
            </View>
          </View>

        )}
        
        // What happens when the list is empty
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found!"
            subtitle="No saved videos"
          />
        )}

      /> 
    </SafeAreaView>
  )
}

export default Bookmark