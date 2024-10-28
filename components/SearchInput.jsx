import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import {icons} from '../constants'
import { router, usePathname } from 'expo-router'

export default function SearchInput() {
  const pathname = usePathname();
  const [query, setQuery] = useState('')
  return (
      <View className="border-2 border-gray-400 h-16 w-full px-4 bg-white rounded-2xl focus:border-secondary items-center flex-row -space-x-48">
        <TextInput
            className="flex-1 mt-0.5 text-black text-base font-pregular"
            value={query}
            placeholder="Search for a video topic"
            placeholderTextColor='#CDCDE0'
            onChangeText={(e) => setQuery(e)}
        />
        <TouchableOpacity 
        
          onPress={() => 
            {
              if (!query) {
                return Alert.alert('Missing Query', "Please input something to search results")
              }

              if (pathname.startsWith('/search')) router.setParams({query})
              else router.push(`/search/${query}`)
            }
              
          }>
            <Image source={icons.search} 
                   className="w-5 h-5" 
                   resizeMode='contain'/>

        </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({})