import { View, Text, Button, Image, TouchableOpacity, Platform} from 'react-native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { client } from '../../Constants/KindConfig';
import { AuthContext } from '../../Constants/AuthContext'
import { db } from '../../firebaseConfig'
import {ref, onValue} from 'firebase/database';
import {getFirestore, setDoc, doc } from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';
import { firedb } from '../../firebaseConfig';
// import { getDatabase, ref, onValue } from "firebase/database";
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// const db = getDatabase();
// const starCountRef = ref(db, 'devicelocations/' + '/deviceId' )
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   updateStarCount(postElement, data);
// });

import { collection, addDoc } from "firebase/firestore"; 





// Add a new document with a generated id.
const addField = async () =>{
 

  try {
    const docRef = await addDoc(collection(firedb, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
//   const firestore = getFirestore();
//    await setDoc(doc(firestore, "users", "user_id"), {
//     name: "Tokyo",
//     country: "Japan"
// });


}


export default function ProfileScreen() {

  const navigation = useNavigation();

  const [fetchData, setfetchData] = useState([]);

  useEffect(() => {
    const starcountRef = ref(db, 'devicelocations/');
    onValue(starcountRef, (snapshot) => {
      const data = snapshot.val();
      const newPosts = Object.keys(data).map((key) => ({
            id:key,
            ...data[key],
      }))
      console.log(data);
      setfetchData(newPosts);
      console.log(newPosts);
    })
  }, [])

  const { auth, setAuth } = useContext(AuthContext);

  const handleLogout = async () => {
    const loggedout = await client.logout();
    if (loggedout) {
       console.log(auth);
      // auth = false;
      setAuth(false);
      console.log("Logout success")
      // User was logged out
    }
  }



  const [userDetail, setUserDetail] = useState();

  useEffect(() => {
    getUserDetails();

  }, [])

  const getUserDetails = async () => {
    const user = await client.getUserDetails();
    setUserDetail(user);
  }



  return (
   <View style={{marginTop:30}}>
    <View style={{ marginBottom:20,display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
      <Image source={{ uri: userDetail?.picture }}
        style={{ width: 45, height: 45, borderRadius: 99 }}
      />
      <View>
        <Text style={{ fontSize: 18 }}>Welcome</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Hello {userDetail?.given_name}</Text>
      </View>

    </View>
    {/* </View> */}
    <View style={{marginBottom:50 ,padding:20, paddingLeft:20, paddingBottom:150, backgroundColor:"#e8e1fd"}}>
    <TouchableOpacity onPress={()=> navigation.navigate('profile')}>
        <Text style={{fontSize:22, marginBottom:20}}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{fontSize:22, marginBottom:20}}>Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{fontSize:22, marginBottom:20}}>GeoFences</Text>
      </TouchableOpacity>
   
    </View>

    {/* <View >
     {
       fetchData.map((item) => {
         return (
           <View key={item.id} style={{marginBottom:15}}>
             <Text>DeviceID: {item.id}</Text>
             <Text>Body: {item.longitude}</Text>
             <Text>Title: {item.latitude}</Text>
           </View>
         )
       })
     }
      </View> */}
      <TouchableOpacity onPress={handleLogout}>
       <Text style={{fontSize:20, marginHorizontal:100, borderWidth:1, padding:10,paddingLeft:25, width:130}}>Logout</Text>  
    </TouchableOpacity>  
    {/* <View>
     <Button title="send Data"  onPress={addField}/>
    </View> */}

    {/* <Button title="LogOut" onPress={handleLogout} /> */}
    




    </View>

  )
}





