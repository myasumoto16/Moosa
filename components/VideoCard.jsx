import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons } from '../constants'
import { ResizeMode, Video } from 'expo-av'
import useAppwrite from '../lib/useAppwrite'
import { addLike, isVideoLikedByUser, removeLike, updateLike } from '../lib/appwrite'
import { useGlobalContext } from '../context/GlobalProvider'

const VideoCard = ({ video: {$id, title, thumbnail, video, users: {username, avatar}} }) => {
    const { user } = useGlobalContext();
    const[playing, setPlaying] = useState(false)
    const [liked, setLiked] = useState(async () => await isVideoLikedByUser(user.$id, $id));
    const [likesId, setlikesId] = useState(null)

    // console.log(user.$id, $id)

    useEffect(() => {
        const checkIfLiked = async () => {
            try {
                const [likedStatus, likesDocId] = await isVideoLikedByUser(user.$id, $id);
                // console.log('likedStatus: ', likedStatus)
                setLiked(likedStatus);
                setlikesId(likesDocId)
            } catch (error) {
                console.log('Error checking like status:', error);
            }
        };

        checkIfLiked();
    }, [user.$id, $id]);

    const handleLikeToggle = async () => {
        // Here you could implement logic to toggle the like state
        // e.g., add or remove a like from the likes table
        
        if (liked) {
            removeLike(likesId)
            setlikesId(null)
        }
        else {
            const newLikesId = addLike($id, user.$id)
            setlikesId(newLikesId)
        }
        setLiked(!liked); // This is just for UI state. Update the database as needed.
    };
    // console.log(liked)

    return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image source={{uri: avatar}} 
                         className="w-full h-full rounded-lg"
                         resizeMode= 'cover'/>
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="font-psemibold text-sm text-black" numberOfLines={1}>{title}</Text>
                    <Text className="text-xs text-gray-500 font-pregular" numberOfLines={1}> {username}</Text>
                </View>
            </View>

            <TouchableOpacity className="pt-2" onPress={handleLikeToggle}>
                <Image source={liked ? (icons.pawFilled) : (icons.pawEmpty)} className="w-7 h-7" resizeMode='contain' />
            </TouchableOpacity>
        </View>

        {playing? (
            <View className="w-full h-60 mt-3 overflow-hidden">
                    <Video 
                        source={{ uri: video }} 
                        style={{ width: '100%', height: '100%' }} // Maintain size consistency
                        resizeMode={ResizeMode.CONTAIN} 
                        useNativeControls 
                        shouldPlay 
                        onPlaybackStatusUpdate={(status) => {
                            if (status.didJustFinish) {
                                setPlaying(false);
                            }
                        }} 
                    />
                </View>
        ) : (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPlaying(true)}
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
            >
                <Image source={{uri: thumbnail}}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode='cover'
                    />
                <Image source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode='contain'
                />
            </TouchableOpacity>
        )}
        
      
    </View>
  )
}

export default VideoCard