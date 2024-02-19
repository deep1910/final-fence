import React, { useState, useEffect } from "react";
import { View, Text,Image,TouchableOpacity, TextInput} from 'react-native'
// import { TextInput } from "react-native-web";
// import { useNavigation } from '@react-navigation/native';
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import { firedb } from "../../firebaseConfig";
import {Ionicons} from 'react-native-vector-icons';
import { client } from '../../Constants/KindConfig';


const userdetail = client.getUserDetails();


export default function Profile() {
    const[ name , setName] = useState("");
    const[ email , setEmail] = useState("");
    const[ gender, setGender] = useState("");
    const [mobile, setMobile] = useState("");
  
    // const [data, setData] = useState([]);
   let tempdata;

   async function getdetail(tempdata){
     
   
   if(tempdata != undefined){
    setName(tempdata.name)
    setEmail(tempdata.email)
    setGender(tempdata.gender)
    setMobile(tempdata.mobile)

 }
   }
    useEffect(() => {
        async function fetchData() {
            
        
            const querySnapshot = await getDocs(collection(firedb,"users", (await userdetail).given_name, "userinfo"));
       
            // let tempdata ;
            querySnapshot.forEach((doc) => {
                // tempdata.push(doc.data())
                tempdata = doc.data()
                getdetail(tempdata)
                // setName(tempdata.name)
                // setEmail(tempdata.email)
                // setGender(tempdata.gender)
                // setMobile(tempdata.mobile)
            //     console.log("Gello");
            //   console.log(doc.id);
            // console.log(data);
            //   setData([...data,doc.id])
            //   console.log(data); // This will log the name of each document
            });

            console.log(tempdata)
            // tempdata.forEach((eachdata)=>{
            //     setData([...data,eachdata])
            //     data.push(eachdata)
            // })

            // console.log(data);

   

        }
        fetchData()
   
}, [])




    const addField = async () => {
        console.log('Data');
        // setAddFieldvalue(true);
        // if (dataelement != "") {
            // setData([...data, dataelement])
            // return
            // const citiesRef = collection(firedb, "cities");
            // console.log('Data');
            const userRef = collection(firedb, "users", (await userdetail).given_name, "userinfo");
        
            try {
                // const userRef = await addDoc(collection(firedb, "users", (await userdetail).given_name, "fields"), {
                //     fieldname: dataelement
                // });
                
                 
               await setDoc(doc(userRef, "info"),{
                    name: name,
                    email: email,
                    gender: gender,
                    mobile: mobile
               })
            //    data.push(dataelement)

                console.log("Document written with ID: ", userRef.id);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

            // console.log(data);
       
        // setDataelement("")
        // setModalVisible(false)

    }

    return (
        <View >
            {/* <TextInput/> */}
            <Text style={{fontSize:24, margin:20, marginTop:40}}>Account Information</Text> 
            <View style={{backgroundColor:'white'}}>
            <Ionicons name="person" size={100} color="grey" style={{backgroundColor:'#C6C7C6', marginTop:10, width:150, height:150, justifyContent:'center',borderWidth:7,marginHorizontal:100,marginBottom:30, borderRadius:100, alignItems:'center', padding:20, paddingLeft:25,borderColor:'white' }}/>
            <Ionicons name="camera-outline" size={30} color="blue" style={{position:'absolute', top:110,right:110, backgroundColor:'white',padding:2,borderRadius:100}}/>
            <View>
          
                <TextInput value={name} onChangeText={(text)=> setName(text)} style={{borderWidth:1 ,width:'90%',height:45,marginHorizontal:20,borderRadius:10,paddingLeft:15, backgroundColor:'#C6C5C5', marginBottom:15}} placeholder="Full Name"/>
                <TextInput  value={email} onChangeText={(text)=> setEmail(text)} style={{borderWidth:1 ,width:'90%',height:45,marginHorizontal:20,borderRadius:10,paddingLeft:15, backgroundColor:'#C6C5C5', marginBottom:15}} placeholder="Email"/>
                <TextInput  value={gender} onChangeText={(text)=> setGender(text)}  style={{borderWidth:1 ,width:'90%',height:45,marginHorizontal:20,borderRadius:10,paddingLeft:15, backgroundColor:'#C6C5C5', marginBottom:15}} placeholder="Gender"/>
                <TextInput  value={mobile} onChangeText={(text)=> setMobile(text)} style={{borderWidth:1 ,width:'90%',height:45,marginHorizontal:20,borderRadius:10,paddingLeft:15, backgroundColor:'#C6C5C5', marginBottom:15}} placeholder="Mobile Number"/>

          
            </View>
            <TouchableOpacity onPress={() =>addField()}>
            <Text style={{fontSize:24, margin:20, marginTop:40, borderWidth:1, width:80,borderRadius:10, padding:10}}>Save</Text>
            </TouchableOpacity>
           
            </View>
           
        </View>
    )
}