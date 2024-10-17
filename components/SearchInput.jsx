import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import {icons} from '../constants'

export default function SearchInput({title, value, placeholder, handleChangeText, otherStyles, ...props}) {
    const [showPassword, setShowPassword] = useState(false)
  return (
      <View className="border-2 border-black-100 h-16 w-full px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row -space-x-48">
        <TextInput
            className="flex-1 mt-0.5 text-white text-base font-pregular"
            value={value}
            placeholder="Search for a video topic"
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title==='Password' && !showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={icons.search} 
                   className="w-5 h-5" 
                   resizeMode='contain'/>

        </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({})