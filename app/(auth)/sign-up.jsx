import { View, Text, Image, SafeAreaView,ScrollView } from 'react-native'
import React, {useState} from 'react'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import {Link} from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'; // Import your global context hook

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setIsLoggedIn } = useGlobalContext(); // Destructure setUser and setIsLoggedIn from global context

  const submit = async () => {
    if (!form.username || !form.email || !form.password) 
    {
      Alert.alert('Error', 'Please fill in all the fields')
    }
    setIsSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username)
      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center px-4 my-6 min-h-[80vh]">
          <Image source={images.logo} resizeMode='contain' className='w-[115px] h-[35px]'/>

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Sign up for Moosa</Text>

          <FormField 
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ... form, username: e})}
            otherStyles="mt-7"
            keyboard-type="username"
          />

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ... form, email: e})}
            otherStyles="mt-7"
            keyboard-type="email-address"
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ... form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton 
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Already Registered?
            </Text>
            <Link href='/sign-in' className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp