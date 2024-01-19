import React, { useEffect } from 'react';
import { Card } from "react-native-paper";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,Alert,TouchableOpacity
  } from "react-native";
import { AppContext } from '../AppManager/Manager';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Canceled = () => {
  var nurse="https://firebasestorage.googleapis.com/v0/b/sassa-c2b7f.appspot.com/o/stethoscope.png?alt=media&token=824748c9-89c0-4b16-9fe4-4e0b6e25c63a";
  
  const {currentVisitorId} = React.useContext(AppContext);
  const [appointmentId, SetAppointid] = React.useState('');
  interface FirestoreData {
    id: string;
    dateapoint: string;
    timebooked: string;
    doctor: string;
    doctorId: string;
    doctorImage: string;
    iscancelled: string;
    patientId: string;
    patientName: string;
    resheduleStatus: string;
    sheduleRequestDate: string;
    specialization: string;
    binValue:string;
  }
  const [appointments, setAppointments] = React.useState<FirestoreData[]>([]);
  function onResult(QuerySnapshot: any) {
    const fetchedData: FirestoreData[] = [];
    QuerySnapshot.forEach((documentSnapshot: any) => {
      if (
        documentSnapshot.data()?.iscancelled == 'yes' &&
        documentSnapshot.data()?.patientId == currentVisitorId && 
        (documentSnapshot.data()?.bin).includes(currentVisitorId)==false
      ) {
        fetchedData.push({
          id: String(documentSnapshot?.id),
          doctor: String(documentSnapshot.data()?.doctor),
          dateapoint: String(documentSnapshot.data()?.dateapoint),
          timebooked:String(documentSnapshot.data()?.timebooked),
          doctorId: String(documentSnapshot.data()?.doctorId),
          doctorImage: String(documentSnapshot.data()?.doctorImage),
          iscancelled: String(documentSnapshot.data()?.iscancelled),
          patientId: String(documentSnapshot.data()?.patientId),
          patientName: String(documentSnapshot.data()?.patientName),
          resheduleStatus: String(documentSnapshot.data()?.resheduleStatus),
          sheduleRequestDate: String(documentSnapshot.data()?.sheduleRequestDate),
          specialization: String(documentSnapshot.data()?.specialization),
          binValue:String(documentSnapshot.data()?.bin)
        });
      }
      setAppointments(fetchedData);
    });
  }

  function onError(error: any) {
    Alert.alert('Firebase error', String(error));
  }

  const handleDelete=(id:string,binValue:string)=>{
    Alert.alert('Deleting','You are about to delete this item',[
      {text:'Yes delete',onPress:()=>{
        firestore()
              .collection('Apointments')
              .doc(id)
              .update({
                bin: binValue+currentVisitorId,
              })
              .catch(err => console.log(String(err)));
      }},
      {
        text:'no', onPress:()=>{}
      }
    ]);
  }

  useEffect(() => {
    const subscriber = firestore()
      .collection('Apointments')
      .onSnapshot(onResult, onError);
    return () => subscriber();
  }, []);
    return ( 
        <FlatList
        showsVerticalScrollIndicator={false}
          style={{ marginBottom: 10,marginLeft:7,marginRight:7, backgroundColor: '00FFFFFF' }}
          data={appointments}
          renderItem={({ item }) => (
            <Card key={item.id} style={{ marginTop: 10, backgroundColor: '#FAFAFD' }}>
              <Image style={styles.imageIN} source={{uri: String(item?.doctorImage).includes('http') ? String(item?.doctorImage) : String(nurse) }} />
              <TouchableOpacity onPress={()=>handleDelete(item.id,item.binValue)}>
              <MaterialCommunityIcons name="delete-empty" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.itemN}>{item?.doctor}</Text>
  
              <Text style={styles.itemC}>{item?.specialization}</Text>
  
              <Card style={{ backgroundColor: '#FAFAFD', margin: 5 }}>
                <View style={styles.ItemC2}>
                  <View style={{ flexDirection: 'row', margin: 5, justifyContent: "center", gap: 5 }}>
                    <Ionicons
                      name="time-outline"
                      color="#FFBD11"
                      size={24}
                    />
                    <Text style={styles.itemT}>
  
                      {item?.timebooked}
                    </Text>
  
                  </View>
  
                  <View style={{ flexDirection: 'row', margin: 5, justifyContent: "center", gap: 5 }}>
                    <Ionicons name="calendar-outline" color="#FFBD11" size={20} />
                    <Text style={styles.itemT}>
  
                      {item?.dateapoint}
                    </Text>
  
                  </View>
  
  
                </View>
              </Card>
            </Card>
          )}
        />
     );
}
 
export default Canceled;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F3F2ED",
      gap: 5
    },
  
    BCont: {
      backgroundColor: '#F6F6F9',
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      margin: 3
    },
  
    BTxt: {
      color: "#FFFFFF",
      alignSelf: "center",
      bottom: 25,
      left: 15,
      fontWeight: "600",
      fontSize: 13,
    },
    BTxt2: {
      color: "#FFFFFF",
      alignSelf: "center",
      bottom: 25,
      left: 15,
      fontWeight: "600",
      fontSize: 13,
    },
    BTxt3: {
      color: "#FFFFFF",
      alignSelf: "center",
      bottom: 25,
      left: 10,
      fontWeight: "600",
      fontSize: 13,
    },
    Bupdates: {
      backgroundColor: "#FFBD11",
      width: 103,
      height: 31,
      borderRadius: 15,
    },
  
    BApp: {
      backgroundColor: "#FFBD11",
      width: 103,
      height: 31,
      borderRadius: 15,
      marginHorizontal: "2%",
    },
    BCancel: {
      backgroundColor: "#FFBD11",
      width: 122,
      height: 31,
      borderRadius: 15,
    },
  
    ScrollCont: {
      padding: 3,
      backgroundColor: 'white'
    },
  
    arrCont: {
      backgroundColor: "#FAFAFD",
      width: "100%",
      height: 165,
      borderRadius: 15,
      marginVertical: "2%",
    },
    imageIN: {
      width: 45,
      height: 49,
      borderRadius: 66,
      left: "83%",
      top: "7%",
      backgroundColor: "white",
    },
  
    itemN: {
      fontSize: 15,
      fontWeight: "bold",
      bottom: "20%",
      left: "10%",
      color: 'black',
      textDecorationLine:'line-through'
    },
  
    itemC: {
      fontSize: 13,
      fontWeight: "bold",
      bottom: "20%",
      left: "10%",
      color: "#726C6C",
      textDecorationLine:'line-through'
    },
  
    ItemC2: {
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemT: {
      fontSize: 15,
      color: "#FFBD11",
      fontWeight: "bold",
      textDecorationLine:'line-through'
    },
  
    btnC2: {
      backgroundColor: "#FFBD11",
      width: 130,
      height: 33.5,
      bottom: "26%",
      borderRadius: 15,
      left: "55%",
    },
  
    addtxt: {
      bottom: "85%",
      left: "35%",
      color: "white",
      fontSize: 15,
      fontWeight: "bold",
    },
  
    BtnC: {
      backgroundColor: "#FBF8F8",
      width: 130,
      height: 33.5,
      bottom: "5%",
      borderRadius: 15,
      left: "5%",
      borderColor: "#FFBD11",
      borderWidth: 2,
    },
  
    CancelTxt: {
      bottom: "85%",
      left: "40%",
      fontSize: 15,
      fontWeight: "bold",
    },
  });