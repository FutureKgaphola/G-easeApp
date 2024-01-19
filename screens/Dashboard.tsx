
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,Keyboard,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-native-paper";
import Banner from "../components/Banner";
import { PaperProvider } from 'react-native-paper';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Updates from "./Updates";
import Applications from "./Applications";
import Canceled from "./Canceled";
import ApplicationDetails from "./ApplicationDetails";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const options = { title: "", headerShown: false };
export default function Dashboard({navigation}: {navigation: any}) {
  const [AppointMode,setAppointMode]=useState<any>({
    mode:'outlined',
    buttoncolor:'white'
  });
  const [ApplicMode,setApplicMode]=useState<any>({
    mode:'elevated',
    buttoncolor:'#FFBD11'
  }
);

  const navigationSelector=(choice:string)=>{
    if(choice=='Appointments'){
      navigation.navigate('Updates');
      setAppointMode({
        mode:'outlined',
        buttoncolor:'white',
        textcolor:"#FFBD11"
      });
      setApplicMode({
        mode:'elevated',
        buttoncolor:'#FFBD11',
        textcolor:"white"
      });
    }else{
      navigation.navigate('Applications');
      setApplicMode({
        mode:'outlined',
        buttoncolor:'white',
        textcolor:"#FFBD11"
      });
      setAppointMode({
        mode:'elevated',
        buttoncolor:'#FFBD11',
        textcolor:"white"
      });
    }
    
  }

  useEffect(()=>{
    setAppointMode({
      mode:'outlined',
      buttoncolor:'white',
      textcolor:"#FFBD11"
    });
    setApplicMode({
      mode:'elevated',
      buttoncolor:'#FFBD11',
      textcolor:"white"
    });
    navigation.navigate('Updates');
  },[]);
  
  return (
    <View style={styles.container}>

      <Banner/>

      <Card style={styles.BCont}>
        <View style={{ flexDirection: 'row',gap:3,width:'100%' }}>
        <Button style={{width:'50%',borderColor:'#FFBD11'}} icon={() => (<Ionicons name="create" size={24} color={AppointMode.textcolor}/>)}
              buttonColor={AppointMode.buttoncolor}
              elevation={5}
              textColor={AppointMode.textcolor}
              mode={AppointMode.mode} onPress={() => navigationSelector('Appointments')}>
              Appointments
            </Button>
            <Button style={{width:'50%',borderColor:'#FFBD11'}} icon={() => (<Ionicons name="create" size={24} color={ApplicMode.textcolor} />)}
              buttonColor={ApplicMode.buttoncolor}
              textColor={ApplicMode.textcolor}
              mode={ApplicMode.mode} onPress={() =>  navigationSelector('Applications')}>
              Application
            </Button>
          {/*
          <ScrollView horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ margin: 2, gap: 5, overflow: "hidden" }}>
            <Button icon={() => (<Ionicons name="create" size={24} color="white" />)}
              buttonColor="#FFBD11"
              elevation={5}
              textColor="white"
              mode="elevated" onPress={() => navigation.navigate('Updates')}>
              Updates
            </Button>
            <Button icon={() => (<Ionicons name="create" size={24} color="white" />)}
              buttonColor="#FFBD11"
              textColor="white"
              mode="elevated" onPress={() => navigation.navigate('Applications')}>
              Application
            </Button>
            <Button icon={() => (<Ionicons name="create" size={24} color="white" />)}
              buttonColor="#FFBD11"
              textColor="white"
              mode="elevated" onPress={() => navigation.navigate('Canceled')}>
              Canceled
            </Button>
          </ScrollView>*/}
        </View>
      </Card>

      <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <PaperProvider>
      <Stack.Navigator initialRouteName="Updates">
      <Stack.Screen name="Updates" component={Updates} options={options}/>
        <Stack.Screen name="Applications" component={Applications} options={options}/>
        <Stack.Screen name="Canceled" component={Canceled} options={options}/>
        <Stack.Screen name="ApplicationDetails" component={ApplicationDetails} options={options}/>
      </Stack.Navigator>
      </PaperProvider>
      </TouchableWithoutFeedback>
    </View>
  );
}

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
    color: 'black'
  },

  itemC: {
    fontSize: 13,
    fontWeight: "bold",
    bottom: "20%",
    left: "10%",
    color: "#726C6C",
  },

  ItemC2: {
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemT: {
    fontSize: 15,
    color: "#FFBD11",
    fontWeight: "bold"
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
