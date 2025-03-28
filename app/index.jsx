import { StatusBar } from 'expo-status-bar';
import { Image, ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Stack } from 'expo-router/stack';
import {SafeAreaView} from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import {useGlobalContext} from '../context/GlobalProvider';

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  if (!isLoading && isLoggedIn) return <Redirect href="/home"/>
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View className="w-full justify-center items-center px-4 min-h-[85vh]">
          <Image 
            source={images.logo}
            className="w-[195px] h-[84px]"
            resizeMode="contain"
          />

          <Image 
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
 
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Dicover Endless Cuteness with {' '}
              <Text className="text-third">Moosa</Text>
            </Text>
            <Image 
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-3/4"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-secondary-200 mt-7 text-center" >Where creativity meets cuteness: embark on a journey of limitless exploration with Moosa</Text>
          <CustomButton 
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#FFFEE0' style='light'/>
    </SafeAreaView>
  );
}

