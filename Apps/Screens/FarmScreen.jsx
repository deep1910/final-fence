import { View, Text, TextInput ,Image, Button, TouchableOpacity} from 'react-native'
import React, {useState, useEffect} from 'react'
import MapView, {Marker,Circle,  Polygon,PROVIDER_GOOGLE} from 'react-native-maps'
import * as Location from 'expo-location';
import * as turf from '@turf/turf';
// import {Ionicons} from '@expo/vector-icons'
import {ref, onValue} from 'firebase/database'
import { db } from '../../firebaseConfig';
import { collection, addDoc, setDoc,doc, getDocs, getDoc, getDocsFromCache } from "firebase/firestore"; 
import { firedb } from '../../firebaseConfig';
// let areacolor = "rgba(100, 200, 200, 0.5)";
// import InstructionComponent from '../Components/InstructionComponent';
import { Picker } from '@react-native-picker/picker';
import {Ionicons} from '@expo/vector-icons'
import { client } from '../../Constants/KindConfig';


export default function FarmScreen({route}) {
  //  console.log(route.params);
   const {selectedValue} = route.params;
  //  console.log(selectedValue);
   console.log(JSON.stringify(selectedValue))
   const [coordinates , setCoordinates] = useState([]); 
   const [currentLocation, setCurrentLocation] = useState({latitude: 20.77940, longitude:76.67873});
  //  const [currentLocation, setCurrentLocation] = useState({});
   const [area, setArea] = useState(0);
   const [areacolor, setAreacolor] = useState("rgba(100, 200, 200, 0.5)");
   
   const [fetchData, setfetchData] = useState([]);

   const [ status ,setStatus] = useState("");
   

   const [maptype, setMaptype] = useState('hybrid');

  //  const [longpress, setLongpress] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);


  const userdetail = client.getUserDetails();


   useEffect(() => {
     const starcountRef = ref(db, 'devicelocations/');
     onValue(starcountRef, (snapshot) => {
       const data = snapshot.val();
       const newPosts = Object.keys(data).map((key) => ({
             id:key,
             ...data[key],
       }))
      //  console.log(data);
       setfetchData(newPosts);
      //  console.log(newPosts);
      //  console.log(newPosts[0].id);
      //  console.log(newPosts[0].latitude);
     })
   }, [])
 
let tempdata;

useEffect(() => {
  async function fetchData() {
      
     const docRef  = doc(firedb,"users",  (await userdetail).given_name, "fields", selectedValue)
     const docSnap = await getDoc(docRef)

     if (docSnap.exists()) {
      tempdata = docSnap.data()
      getdetail(tempdata)

      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
     
      // const querySnapshot = await getDocs(collection(firedb,"users", (await userdetail).given_name, "userinfo"));
 
      // let tempdata ;
      // querySnapshot.forEach((doc) => {
          // tempdata.push(doc.data())
          // tempdata = doc.data()
          // console.log(tempdata);
          // getdetail(tempdata)
          // setName(tempdata.name)
          // setEmail(tempdata.email)
          // setGender(tempdata.gender)
          // setMobile(tempdata.mobile)
      //     console.log("Gello");
      //   console.log(doc.id);
      // console.log(data);
      //   setData([...data,doc.id])
      //   console.log(data); // This will log the name of each document
      // });

      console.log(tempdata)
      // tempdata.forEach((eachdata)=>{
      //     setData([...data,eachdata])
      //     data.push(eachdata)
      // })

      // console.log(data);



  }
  fetchData()

}, [])



async function getdetail(tempdata){
     
   
  if(tempdata != undefined){
    setArea(tempdata.area)
    setCoordinates(tempdata.coordinates)
  //  setName(tempdata.name)
  //  setEmail(tempdata.email)
  //  setGender(tempdata.gender)
  //  setMobile(tempdata.mobile)

}}

  // console.log("Deep loaded success" + fetchData);

  // useEffect(() => {
    
  //   // if(maptype != "hybsrid"){
  //   //   console.log(maptype);
  //   // }
  //   // // set
  //   if(maptype === 'hybrid'){
  //     setMaptype('hybrid');
  //   }else if(maptype === 'standard'){
  //     setMaptype('standard');
  //   }else if(maptype === 'satellite'){
  //     setMaptype('satellite');
  //   }
  // }, [maptype])
// useEffect(()=>{
//    if(coordinates.length === 0){
//        setLongpress(false)

//    }else{
//         setLongpress(true)
    
//    }
// })


  
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      // console.log(location);
      setCurrentLocation({latitude:location.coords.latitude, longitude:location.coords.longitude});
    })();

    if(coordinates.length === 4){

      if (point_in_polygon(fetchData[0], coordinates)) {
         setStatus("Car is inside the polygon");
    } else {
         setStatus("Car is outside the polygon");
    }
   
  }



  }, [currentLocation]);

  function point_in_polygon(point, polygon) {
    const num_vertices = polygon.length;
    const x = point.latitude;
    const y = point.longitude;
    let inside = false;
 
    let p1 = polygon[0];
    let p2;
 
    for (let i = 1; i <= num_vertices; i++) {
        p2 = polygon[i % num_vertices];
 
        if (y > Math.min(p1.longitude, p2.longitude)) {
            if (y <= Math.max(p1.longitude, p2.longitude)) {
                if (x <= Math.max(p1.latitude, p2.latitude)) {
                    const x_intersection = ((y - p1.longitude) * (p2.latitude - p1.latitude)) / (p2.longitude - p1.longitude) + p1.latitude;
 
                    if (p1.latitude === p2.latitude || x <= x_intersection) {
                        inside = !inside;
                    }
                }
            }
        }
 
        p1 = p2;
    }
 
    return inside;
}



  useEffect(()=>{
    if(coordinates.length === 4){
      // console.log(coordinates);
      const coordinatesArray = coordinates.map(coord => [coord.latitude, coord.longitude]);
      // console.log(coordinatesArray);
      coordinatesArray.push(coordinatesArray[0]);
      const polygon = turf.polygon([coordinatesArray]);
      // console.log(polygon);
      const calculatedArea = turf.area(polygon);
      // console.log(calculatedArea)
      setArea(calculatedArea);
    }

  }, [coordinates, areacolor])




  const saveBoundary = async(coordinates) => { 
    console.log(coordinates);
    // setCoordinates(coordinates);
     setAreacolor("rgba(139, 226,139, 0.8)");


    if(selectedValue != ""){

     const userRef = collection(firedb, "users", (await userdetail).given_name, "fields");

      try {

         
        await setDoc(doc(userRef, selectedValue ),{
             fieldname: selectedValue,
             coordinates:coordinates,
             area:area
          
           
        })
        // const docRef = await addDoc(collection(firedb, "users", (await userdetail).given_name, "fields"), {
        //   // first: "Ada",
        //   // last: "Lovelace",
        //    // born: 1815
        //    area:0,
        //   coordinates: coordinates,
  
        // });
        console.log("Document written with ID: ", userRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }



    }

   
  }


  const Reset = () =>{
    setCoordinates([])
    setArea(0)
    setStatus("")

  }

  return (

    <View style={{flex:1, marginTop:40}}>
        {/* <Text style={{fontSize:20, paddingLeft:20}}>Map your Field</Text> */}
       {/* <TextInput placeholder="Enter your Location" style={{ padding:20,marginTop: 20,width:'100%',height:60, borderWidth:2, fontSize:20}}/> */}
       
       <MapView
        userInterfaceStyle='dark'
        // mapType='hybrid'
        mapType='standard'
        style={{ flex: 1, 
            height:80,
        }}
        showsCompass={true}
        maxZoomLevel={20}
        // minZoomLevel={10}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        initialRegion={{
          latitude: 20.77940,
          longitude: 76.67873,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}


        onLongPress={(e) => {
          const { latitude, longitude } = e.nativeEvent.coordinate;
          
          // Only add a new coordinate if there are less than 4
          if (coordinates.length < 4) {
            setCoordinates([
              ...coordinates,
              { latitude, longitude },
            ]);
          }
        }}
      >
       
        
       
         {currentLocation && (
        <Marker
          coordinate={currentLocation}
          title="My Location"
        />
      )}

     { fetchData.length != 0  &&
      <Marker
      coordinate={{latitude:fetchData[0].latitude , longitude:fetchData[0].longitude}}
      >
         {/* <Image source={require("../../assets/favicon.png")} style={{width:35, height:35}}/> */}
         <Ionicons name="car-outline" size={40} color="yellow" style={{width:35, height:35}}></Ionicons>


      </Marker>
      
       }
      
       

{coordinates.map((coordinate, index) => (
      
        <Circle
        key={index}
        center={coordinate}
        radius={7} // radius in meters
        strokeWidth={1}
        strokeColor={'#1a66ff'}
        fillColor={'yellow'}
      />
      ))}
      {coordinates.length === 4 && (
        <Polygon
          coordinates={coordinates}
          fillColor={areacolor}
          strokeColor="rgba(0, 0, 0, 1)"
          strokeWidth={2}
        />
      )}
     
 

  
      </MapView>
     
 {isOverlayVisible && (
     <View style={{position:"absolute", top:0,left: 0, // Position it at the left of the parent View
     right: 0, // Stretch it to the right of the parent View
     bottom: 0, // Stretch it to the bottom of the parent View
     justifyContent: 'center', // Center the content vertically
     alignItems: 'center'
     
     }}> 
     <Image
      //  source={{uri: 'https://th.bing.com/th/id/OIP.G0TZQE-WfrNupua_JJeB6QHaFj?rs=1&pid=ImgDetMain'}}
      source={require('../../assets/longpress.png')}
       style={{
        borderRadius:40,
         width: '75%',
         height: '23%',
         position: 'absolute',
         opacity: 0.8,
        //  top: '25%',
        //  left: '25%',
       }}
     />
     
     <TouchableOpacity
       onPress={() => setIsOverlayVisible(false)}
       style={{
         position: 'absolute',
         alignItems:'center',
          top: 260,
          right:70
        //  justifyContent:'center'
        }}
     >
       <Text style={{fontSize: 30, color:"white"}}>X</Text>
     </TouchableOpacity>
     </View>
    )} 
{/* <View style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'center', justifyContent:'space-evenly'}}> */}
  {/* <Text style={{width:120}}>Map Type: </Text> */}
{/* <Picker
  selectedValue={maptype}
  style={{height: 50, width: 150}}
  onValueChange={(itemValue, itemIndex) => {
    console.log(maptype);
    setMaptype(itemValue)
    console.log(maptype);
    }}
>
  <Picker.Item label="Hybrid" value="hybrid" />
  <Picker.Item label="Standard" value="standard" />
  <Picker.Item label="Satellite" value="satellite" />

</Picker> */}
{/* </View> */}
      {status != "" && <View style={{position:'absolute', top:80, backgroundColor:'pink', left:20}}><Text style={{ fontSize: 19 }}>{status}</Text></View>}
      {area!=0 && 
         <View style={{width:'fit-content' ,padding:5 , height:30, position:'absolute', backgroundColor:'pink', opacity:0.9, top:40, left:20 }}>
             <Text style={{fontSize:19}}>Area: {(area * 0.00024711).toFixed(2)} acres</Text>
         </View>}
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-evenly', padding:8, alignItems:'center'}}>
      {areacolor === "rgba(139, 226,139, 0.8)" ? 
      <TouchableOpacity style={{height:35, width:100,paddingLeft:5,borderRadius:10, backgroundColor:'skyblue'}}>
             <Text style={{fontSize:24}} >Confirm</Text>
       </TouchableOpacity> :  
       <TouchableOpacity style={{height:30, width:'60%',height:35, backgroundColor:'skyblue', paddingLeft:15, borderRadius:10}} onPress={()=>saveBoundary(coordinates)} >
             <Text style={{fontSize:24}} >Save Boundary</Text>
        </TouchableOpacity>
       
         
          } 
          <TouchableOpacity style={{backgroundColor:'skyblue',paddingLeft:15,height:35, borderRadius:10,width:90}} onPress={()=>{Reset()}}>
          <Text style={{fontSize:24}}>Reset</Text>
        </TouchableOpacity>
        </View>

      
     
    </View>
  )
}
