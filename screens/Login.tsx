import '../ignoreWarnings';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
/*import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '534881027218-0k23t5grdmpdpeq9hl6nm7sdopuqnu1q.apps.googleusercontent.com',
});*/
import Icon from 'react-native-vector-icons/Zocial';
import Octicons from 'react-native-vector-icons/Octicons';
import {Button, Card, TextInput, Switch} from 'react-native-paper';
import {getData, storeData, storeSignInMethod} from '../localstorage/storage';
import {AppContext} from '../AppManager/Manager';
import firestore from '@react-native-firebase/firestore';

const Login = ({navigation}: {navigation: any}) => {
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);
  const [isdisabled, setdisabled] = React.useState(false);
  const [isdisplay, setdisplay] = React.useState('flex');

  const [email, setemail] = React.useState('');
  const [password, setpassword] = React.useState('');
  const [isloggingIn, setloggingIn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [secure, setsecure] = React.useState(true);
  const {
    currentVisitorName,
    SetcurrentVisitorName,
    currentVisitorId,
    SetcurrentVisitorId,
  } = React.useContext(AppContext);

  const Reset = (dis: boolean, anim: boolean) => {
    setdisabled(dis);
    setAnimate(anim);
    if (dis === false && anim === false) {
      setdisplay('flex');
    } else if (dis === true && anim === true) {
      setdisplay('none');
    }
  };
  React.useEffect(() => {
    getData().then((resp: any) => {
      if (resp !== null && resp !== undefined && resp !== '') {
        SetcurrentVisitorId(resp.user?.uid);
        navigation.navigate('Home');
      }
    });
    return () => {};
  }, []);

  const loginEmailPassword = async () => {
    try {
      if (email && password) {
        setloggingIn(true);
        setdisabled(true);
        const resp = await auth().signInWithEmailAndPassword(
          email.trim().toLocaleLowerCase(),
          password,
        );
        if (resp) {
          if (isSwitchOn === true) {
            storeSignInMethod('email and password');
            storeData(resp);
          } else {
            storeData(null);
            storeSignInMethod(null);
          }
          setdisabled(false);
          setloggingIn(false);
          SetcurrentVisitorId(resp.user?.uid);
          setemail('');
          setpassword('');
          navigation.navigate('Home');
        }
      } else {
        setloggingIn(false);
      }
    } catch (error) {
      setdisabled(false);
      setloggingIn(false);
      Alert.alert('Error', String(error));
    }
  };

  // async function onGoogleButtonPress(navigation: any) {
  //   // Check if your device supports Google Play
  //   try {
  //     Reset(true, true);

  //     await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  //     // Get the users ID token
  //     const {idToken} = await GoogleSignin.signIn();

  //     // Create a Google credential with the token
  //     const googleCredential = await auth.GoogleAuthProvider.credential(
  //       idToken,
  //     );

  //     // Sign-in the user with the credential
  //     const res = await auth().signInWithCredential(googleCredential);
  //     if (res) {
  //       Reset(false, false);
  //       setdisplay('block');
  //       storeSignInMethod('google');

  //       //check if exits first
  //       firestore()
  //         .collection('users')
  //         .where('userId', '==', res.user.uid.trim())
  //         .get()
  //         .then(querySnapshot => {
  //           if (querySnapshot.size == 0) {
  //             const data = {
  //               Email: res.user.email,
  //               IDno: 'not set',
  //               Name: res.user.displayName,
  //               applied: 'not submitted',
  //               certificateUrl: 'not applicable',
  //               finance: 'not approved',
  //               illness: 'not applicable',
  //               medcertificate: 'not applicable',
  //               medical: 'not approved',
  //               profimage: res.user.photoURL,
  //               signmethod: 'google',
  //               userId: res.user.uid,
  //               applicationId:""
  //             };
  //             firestore()
  //               .collection('users')
  //               .doc(res.user.uid)
  //               .set(data)
  //               .then(() => {
  //                 storeData(res);
  //                 SetcurrentVisitorId(res.user.uid);
  //                 setemail('');
  //                 setpassword('');
  //                 navigation.navigate('Home');
  //               })
  //               .catch((error: any) => {
  //                 setemail('');
  //                 setpassword('');
  //                 Alert.alert('firestore error', String(error));
  //               });
  //           } else {
  //             storeData(res);
  //             SetcurrentVisitorId(res.user.uid);
  //             setemail('');
  //             setpassword('');
  //             navigation.navigate('Home');
  //           }
  //         });
  //     }
  //   } catch (error: any) {
  //     Reset(false, false);

  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //       console.log(
  //         'user cancelled the login flow.',
  //         'StatusCode:' + String(error.code),
  //       );
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //       console.log(error.code);
  //       Alert.alert('Action in progress', 'Sign in is in progress already');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //       console.log(error.code);
  //       Alert.alert(
  //         'PlayStore error',
  //         'play services not available or outdated',
  //       );
  //     } else {
  //       Reset(false, false);
  //       // some other error happened
  //       console.log(error);
  //       if (
  //         String(error).includes('interrupted connection or unreachable host')
  //       ) {
  //         Alert.alert('Error', String(error), [
  //           {
  //             text: 'Try again',
  //             onPress: () => onGoogleButtonPress(navigation),
  //           },
  //           {
  //             text: 'Cancel',
  //             onPress: () => {},
  //             style: 'cancel',
  //           },
  //         ]);
  //       } else {
  //         Alert.alert('Error', String(error));
  //       }
  //     }
  //   }
  // }
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <Image
          style={{width: '100%', height: 300, objectFit: 'scale-down',marginTop:10}}
          source={require('../assets/grantlogo.png')}
        />
        <Text style={styles.catchyText}>Good To See</Text>
        <Text style={styles.catchyText}>you Back</Text>
        <Card style={{padding: 10, backgroundColor: '#FFF', margin: 10}}>
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
          <TextInput
            mode="outlined"
            label="Enter password"
            onChangeText={text => setpassword(text)}
            placeholder="Enter password"
            value={password}
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
          <TouchableOpacity
            onPress={() => navigation.navigate('Forgotpassword')}>
            <Text
              style={{
                alignSelf: 'flex-end',
                fontFamily: 'Itim-Regular',
                fontSize: 20,
                color: 'black',
                marginTop: 7,
              }}>
              Forgot password
            </Text>
          </TouchableOpacity>

          <Button
            textColor="#fff"
            style={{
              borderRadius: 8,
              backgroundColor: '#FFBD11',
              marginTop: 5,
              display: isdisplay == 'none' ? 'none' : 'flex',
            }}
            mode="elevated"
            loading={isloggingIn}
            disabled={isloggingIn ? true : false}
            onPress={() => loginEmailPassword()}>
            Login
          </Button>

          {/* <TouchableOpacity
            onPress={() => onGoogleButtonPress(navigation)}
            style={{
              flexDirection: 'row',
              marginTop: 5,
              alignItems: 'center',
              backgroundColor: '#F6F5F2',
              borderRadius: 8,
              elevation: 6,
            }}>
            <GoogleSigninButton
              style={{flex: 1}}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Light}
              disabled={isdisabled}
            />
          </TouchableOpacity> */}
          <ActivityIndicator animating={animate} color={MD2Colors.orangeA200} />
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text>Remember me </Text>
            <Switch
              thumbColor={'#FFBD11'}
              color="#FFBD11"
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
        </Card>
        <View style={{flexDirection: 'row', marginTop: 5, marginLeft: 10}}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#FFBD11'}}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  catchyText: {
    fontSize: 28,
    fontFamily: 'Itim-Regular',
    color: 'black',
    textShadowColor: '#DCDCDC',
    textShadowRadius: 4,
    marginLeft: 10,
  },
});
