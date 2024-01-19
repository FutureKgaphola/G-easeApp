import React, { useContext, useEffect } from 'react';
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Text, Alert
} from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';
import auth from '@react-native-firebase/auth';
import { AppContext } from '../AppManager/Manager';
import { isValidSAIDNumber } from '../validator/SAid';

const Profile = () => {
  const { currentData, currentVisitorId } =
    useContext(AppContext);
  const appLogo = "https://firebasestorage.googleapis.com/v0/b/sassa-c2b7f.appspot.com/o/applogo%2Flogo.png?alt=media&token=ace541a0-bc77-42a4-a6c0-3fc7c0c53460";
  const [name, setName] = React.useState(currentData?.Name);
  const [SAID, setID] = React.useState(currentData?.IDno);
  const [loading, setloading] = React.useState(false);
  useEffect(() => {
    setName(currentData?.Name);
    setID(currentData?.IDno);
  }, []);

  const Submit = () => {

    if (name !== "" && SAID !== "") {
      const isValid = isValidSAIDNumber(SAID);
      if(isValid){
        firestore()
        .collection('users')
        .doc(currentVisitorId)
        .update({
          Name: name.trim(),
          IDno: SAID.trim()
        });
      Alert.alert(
        'Account updated',
        'You have succesfully updated your account',
      );
      }else{
        Alert.alert(
          'Invalid SA ID',
          'You SA Id is not correct',
        );
      }
      
    }
  }

 

  
  // Example usage


  
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
        <Image
          style={{ width: 100, height: 100, objectFit: 'contain', marginTop: 10, alignSelf: 'center', borderRadius: 100 }}
          source={{ uri: currentData?.profimage.includes('http') ? currentData?.profimage : appLogo }}
        />
        <Text style={{ alignSelf: 'center' }}>Want to change something?</Text>
        <Text style={{ alignSelf: 'center' }}>Update your account details below</Text>

        <Card style={{ margin: 10, padding: 10 }}>
          <TextInput
            mode="outlined"
            label="Enter Name"
            inputMode="text"
            placeholder="Enter Name"
            onChangeText={text => setName(text)}
            value={name}
            placeholderTextColor={'#C7C7C7'}
            left={
              <TextInput.Icon
                icon={() => (
                  <FontAwesome5 name="user-circle" size={24} color="black" />
                )}
              />
            }
          />
          <TextInput
            mode="outlined"
            label="Enter SA ID."
            inputMode="numeric"
            onChangeText={text => setID(text)}
            value={SAID}
            maxLength={13}
            placeholder="Enter SA ID."
            placeholderTextColor={'#C7C7C7'}
            left={
              <TextInput.Icon
                icon={() => <Octicons name="number" size={24} color="black" />}
              />
            }
          />
          <Button onPress={() => Submit()}
            icon={() => <AntDesign name="check" size={24} color="white" />}
            mode="contained"
            rippleColor={'white'}
            style={{ marginTop: 20, backgroundColor: '#FFBD11' }}>
            Update
          </Button>
        </Card>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

export default Profile;