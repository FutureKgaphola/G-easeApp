import React from 'react';
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  Text,Alert
} from 'react-native';
import {TextInput, Button, Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Zocial';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import auth from '@react-native-firebase/auth';

const Forgotpassword = () => {
  const [email, setemail] = React.useState('');
  const [loading, setloading] = React.useState(false);

  const checkSigniMethod=()=>{
    if(email!=='')
    {
      setloading(true);
      firestore()
            .collection('users')
            .where('Email', '==', email.trim()).where('signmethod', '==', 'google').get()
            .then(querySnapshot => {
              if (querySnapshot.size==1) {
                Alert.alert('Google SignIn Restriction', 'Your account is signned in using google as such we are not able to reset password for google accounts');
                setloading(false);
              }
              else{
                auth().sendPasswordResetEmail(email.trim().toLocaleLowerCase()).then(()=>{
                  setloading(false);
                  setemail('');
                  Alert.alert('Reset link successfull',"We have send you a reset link to the email you provide");
                }).catch((err)=>{
                  setloading(false);
                  Alert.alert('Reset link Failure',String(err));
                })
              }
            
            })
    }else{
      Alert.alert('No email provided','Please provide am email below');
    }
    
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Image
          style={{width: '100%', height: 300, objectFit: 'contain',marginTop:10}}
          source={require('../assets/grantlogo.png')}
        />
        <Text>FORGOT PASSWORD?</Text>
        <Text>Enter the email address associated with your account</Text>

        <Card style={{margin: 10, padding: 10}}>
          <TextInput
            mode="outlined"
            label="Enter email"
            inputMode="email"
            onChangeText={text => setemail(text)}
            value={email}
            placeholder="Enter email"
            placeholderTextColor={'#C7C7C7'}
            left={
              <TextInput.Icon
                icon={() => <Icon name="email" size={24} color="black" />}
              />
            }
          />
          <Button
            icon={() => <AntDesign name="check" size={24} color="white" />}
            mode="contained"
            loading={loading}
            rippleColor={'white'}
            style={{marginTop: 20, backgroundColor: '#FFBD11'}}
            onPress={() => checkSigniMethod()}>
            Sent Reset link
          </Button>
        </Card>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Forgotpassword;
