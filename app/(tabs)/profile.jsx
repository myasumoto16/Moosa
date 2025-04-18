import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmptyState from '../../components/EmptyState'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  console.log('user in profile: ', user)
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));
  console.log('accountId in profile: ' + user?.$id)
  const logout = async () => {
    await signOut();
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in')
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      {/* list of elements */}
      <FlatList 

        ListHeaderComponent={() => (
            <View className="w-full justify-center items-center mt-6 mb12 px-4">
              <TouchableOpacity 
                className='w-full items-end mb-10'
                onPress={logout}
                >
                <Image source={icons.logout} 
                resizeMode='contain' className='w-6 h-6'/>
              </TouchableOpacity>

              <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                <Image source={{uri: user?.avatar}} className="w-[90%] h-[90%] rounded-lg" resizeMode='cover'/>
              </View>

              <InfoBox 
                title={user?.username}
                containerStyles='mt-5'
                titleStyles='text-lg'/>

              <View className="mt-5 flex-row">
                <InfoBox 
                  title={posts.length || 0}
                  subtitle="Posts"
                  containerStyles='mt-5'
                  titleStyles='text-xl'
                />

                <InfoBox 
                  title="1.2k"
                  subtitle="Followers"
                  containerStyles='mt-5'
                  titleStyles='text-xl'
                />
              </View>
            </View>
        )}
        
        data={posts}
        // data = {[]}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
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

export default Profile