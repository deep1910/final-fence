import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import MapmyfarmScreen from '../Screens/MapmyfarmScreen';
import HomeScreen from '../Screens/HomeScreen';
import Profile from  '../Screens/Profile';
 const Stack = createStackNavigator();


export default function HomeNavigation() {

    return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="otherScreen" component={MapmyfarmScreen} />
        {/* <Stack.Screen name="profile" component={Profile} /> */}
     </Stack.Navigator>
  )
}