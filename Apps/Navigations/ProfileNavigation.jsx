import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
// import MapmyfarmScreen from '../Screens/MapmyfarmScreen';
// import HomeScreen from '../Screens/HomeScreen';
import Profile from  '../Screens/Profile';
import ProfileScreen from '../Screens/ProfileScreen';
 const Stack = createStackNavigator();


export default function ProfileNavigation() {

    return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name="account" component={ProfileScreen} />
        <Stack.Screen name="profile" component={Profile} />
        {/* <Stack.Screen name="profile" component={Profile} /> */}
     </Stack.Navigator>
  )
}