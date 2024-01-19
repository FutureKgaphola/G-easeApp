import React from 'react';
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {TextInput, Button, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Zocial';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { isValidSAIDNumber } from '../validator/SAid';

const Register = ({navigation}: {navigation: any}) => {
  const [email, setemail] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [secure, setsecure] = React.useState(true);
  const [name, setName] = React.useState('');
  const [SAID, setID] = React.useState('');
  const [loading,setloading]=React.useState(false);

  const sigup = () => {
    if(isValidSAIDNumber(SAID.trim())){

      if(email.trim()!=='' && name!=="" && password!==""){
        setloading(true);
    
        auth()
          .createUserWithEmailAndPassword(email.trim(), password)
          .then((res) => {
            firestore()
              .collection('users').doc(res.user.uid)
              .set({
                Email: email.trim(),
                IDno: SAID,
                Name: name,
                applied: 'no application',
                certificateUrl: 'not applicable',
                finance: 'not approved',
                illness: 'not applicable',
                medcertificate: 'not applicable',
                medical: 'not approved',
                profimage: 'no image',
                signmethod: 'email and password',
                userId:res.user.uid,
                applicationId:""
              })
              .then(() => {
                setloading(false);
                Alert.alert('Notification', 'Successful registration', [
                  {text: 'OK', onPress: () => {
                    navigation.navigate('Login')
                  }},
                ]);
              });
          })
          .catch(error => {
            setloading(false);
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert("Firebase error",'That email address is already in use!');
            }
            if (error.code === 'auth/invalid-email') {
              Alert.alert("Firebase error",'That email address is invalid!');
            }
    
            Alert.alert("Firebase error",String(error));
          });
  
      }else{
        setloading(false);
        Alert.alert('Form error',"Please fill in the form");
      }

    }else{
      Alert.alert(
        'Invalid SA ID',
        'You SA Id is not correct',
      );
    }

  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Image
          style={{width: '100%', height: 300, objectFit: 'scale-down',marginTop:10}}
          source={require('../assets/grantlogo.png')}
        />
        <Text style={{marginLeft: 20,color:'black',fontSize:15}}>Setup for an account with us...</Text>

        <Card style={{margin: 10, padding: 10}}>
          <TextInput
            mode="outlined"
            label="Enter email"
            inputMode="email"
            onChangeText={text => setemail(text)}
            placeholder="Enter email"
            placeholderTextColor={'#C7C7C7'}
            left={
              <TextInput.Icon
                icon={() => <Icon name="email" size={24} color="black" />}
              />
            }
          />
          <TextInput
            mode="outlined"
            label="Enter password"
            onChangeText={text => setpassword(text)}
            placeholder="Enter password"
            placeholderTextColor={'#C7C7C7'}
            secureTextEntry={secure}
            right={
              <TextInput.Icon
                icon={() =>
                  secure ? (
                    <Octicons
                      onPress={() =>
                        secure ? setsecure(false) : setsecure(true)
                      }
                      name="eye-closed"
                      size={24}
                      color="black"
                    />
                  ) : (
                    <Octicons
                      onPress={() =>
                        secure ? setsecure(false) : setsecure(true)
                      }
                      name="eye"
                      size={24}
                      color="black"
                    />
                  )
                }
              />
            }
          />
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

          <Button
          loading={loading}
          disabled={loading? true : false}
            icon={() => <AntDesign name="check" size={24} color="white" />}
            mode="contained"
            rippleColor={'white'}
            style={{marginTop: 20, backgroundColor: '#FFBD11'}}
            onPress={() => sigup()}>
            Register
          </Button>

          <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10}}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{color: '#FFBD11'}}>Login</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Register;
