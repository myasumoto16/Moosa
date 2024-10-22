import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { icons } from '../../constants';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View>
            <View 
                className="items-center justify-end flex-1" // Adjusted to use flex for better alignment
            >
                <Image 
                    source={icon}
                    resizeMode="contain"
                    tintColor={color}
                    className="w-6 h-6"
                />
            </View>
            <View>
                <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color }}>
                    {name}
                </Text>
            </View>
        </View>
    );
};

const TabsLayout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: "#FFA001",
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: '#232533',
                        height: 84, // Tab bar height
                        paddingBottom: 10, // Added padding to align items
                    },
                }}
            >
                <Tabs.Screen 
                    name="home" 
                    options={{
                        title: 'Home',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.home}
                                color={color}
                                name="Home"
                                focused={focused}
                            />
                        ),
                    }}
                />

                <Tabs.Screen 
                    name="bookmark" 
                    options={{
                        title: 'Bookmark',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.bookmark}
                                color={color}
                                name="Bookmark"
                                focused={focused}
                            />
                        ),
                    }}
                />

                <Tabs.Screen 
                    name="create" 
                    options={{
                        title: 'Create',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.plus}
                                color={color}
                                name="Create"
                                focused={focused}
                            />
                        ),
                    }}
                />

                <Tabs.Screen 
                    name="profile" 
                    options={{
                        title: 'Profile',
                        headerShown: false,
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                icon={icons.profile}
                                color={color}
                                name="Profile"
                                focused={focused}
                            />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
};

export default TabsLayout;
