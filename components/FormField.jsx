import { StyleSheet, Text, TextInput, View, Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import {icons} from '../constants'

export default function FormField({title, value, placeholder, handleChangeText, otherStyles, ...props}) {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className="space-y-2">
      <Text className="text-base text-gray-100 font-medium">{title}</Text>
      <View className="border-2 bg-secondary-100 h-16 w-full px-4 bg-white rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
            className="flex-1 text-black font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor='#7b7b8b'
            onChangeText={handleChangeText}
            secureTextEntry={title==='Password' && !showPassword}
        />
        {title=='Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode='contain'/>

            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})