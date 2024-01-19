import {
  Alert,
  Image,
  BackHandler,
  View,
} from 'react-native';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { storeData, storeSignInMethod } from '../localstorage/storage';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
// GoogleSignin.configure({
// webClientId:
//   '534881027218-0k23t5grdmpdpeq9hl6nm7sdopuqnu1q.apps.googleusercontent.com',
// });
const Exit = ({navigation}: {navigation: any}) => {

const Sign_Out = () => {
  try {
    Alert.alert('Exist/Sigout', 'Is sad to see you leave, will you be back very soon?', [
      {
        text: 'Back very soon',
        onPress: () => {
          BackHandler.exitApp();
          
        },
      },
      {
        text: 'No, sign me out',
        onPress: async() => {
          // GoogleSignin.signOut().then(()=>{
          //   storeData('');
          //   storeSignInMethod('');
          //   navigation.navigate('Login');
          // }).catch(err=>{
          //   Alert.alert('Sign out error',String(err));
          // });

            storeData('');
            storeSignInMethod('');
            navigation.navigate('Login');
          
        },
        style: 'cancel',
      },
      {
        text: 'Sorry, ignore',
        onPress: () => {
          navigation.navigate('Home');
        },
      }

    ]);
    
  } catch (error) {
    console.error(error);
  }
};
  return ( 
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <Image style={{width:300,height:300}} source={require('../assets/bye.png')}/>
      <Button
        icon={() => (
          <Ionicons
            name="chevron-back-circle-outline"
            color="white"
            size={24}
          />
        )}
        rippleColor={'white'}
        textColor="white"
        style={{borderColor: '#FFBD11', backgroundColor: '#FFBD11',marginTop:5}}
        mode="elevated"
        onPress={() => {
          Sign_Out();
        }}>
        exit
      </Button>
    </View>
   );
}

export default Exit;