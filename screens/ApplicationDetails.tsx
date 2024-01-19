import { useEffect, useState, useContext } from 'react';
import {
  Text,
  View,
  Alert, PermissionsAndroid, Platform, TouchableOpacity, ScrollView
} from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from "@react-native-firebase/storage";
import DocumentPicker from 'react-native-document-picker';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, TextInput,Snackbar } from 'react-native-paper';
import { AppContext } from '../AppManager/Manager';
import Finance from '../components/Finance';
import uuid from 'react-native-uuid';
import { isValidSAIDNumber } from '../validator/SAid';

const ApplicationDetails = ({ navigation }: { navigation: any }) => {
  const {currentData, currentVisitorName, currentVisitorId } = useContext(AppContext);
  const [fileName, setFileName] = useState('');
  const [fileUri, setfileUri] = useState('');
  const SaID=currentData?.IDno;
  const [startup, setupload] = useState('');
  const [Totalup, setTotalup] = useState('');
  const [IsApproved,setIsApproved]=useState(false);
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  

  useEffect(() => {
    requestPermission();
    getStatusApproval();
  }, []);

  const refreshPage=()=>{
    getStatusApproval();
  }
  const getStatusApproval=()=>{
    firestore()
    .collection('users')
    .where('userId', '==', currentVisitorId.trim()).get()
    .then(querySnapshot => {
      if (querySnapshot.size==1) { 
        console.log(querySnapshot.size)
        querySnapshot.forEach(documentSnapshot => {
          if(documentSnapshot.data()?.medical=="approved"){
            setIsApproved(true);
          }else{
            setIsApproved(false);
          }
        })
      }
    })
  }

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        // On Android, request the necessary permissions before picking a document
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Storage permissions granted');
        } else {
          console.warn('Storage permissions denied');
        }
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
    }
  };
  const selectDoc = async () => {
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc],
        copyTo: 'cachesDirectory'
      });
      setFileName(String(doc.name));
      setfileUri(String(doc.fileCopyUri));

    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        setFileName('');
        setfileUri('');
        Alert.alert('Unexpected error', String(error));
      }
    }
  }
  function validateSAID(idNumber: any) {
    // Check if the ID number matches the format
    const idRegex = /^[0-9]{13}$/;
    if (!idRegex.test(idNumber)) {
      Alert.alert('SA ID Error', 'Please enter a valid SA ID');
      return false;
    }

    // Extract the date components from the ID number
    const year = parseInt(idNumber.substr(0, 2), 10);
    const month = parseInt(idNumber.substr(2, 2), 10);
    const day = parseInt(idNumber.substr(4, 2), 10);

    // Check if the date is valid
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      Alert.alert('SA ID Error', 'Please enter a valid SA ID');
      return false;
    }

    // Validate the checksum
    const checksum = parseInt(idNumber.substr(10, 1), 10);
    const calculatedChecksum = calculateChecksum(idNumber);
    return true;
  }

  function calculateChecksum(idNumber: any) {
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let total = 0;

    for (let i = 0; i < weights.length; i++) {
      let digit = parseInt(idNumber.charAt(i), 10) * weights[i];
      total += digit > 9 ? digit - 9 : digit;
    }

    return (10 - (total % 10)) % 10;
  }
  const upload = () => {
    const isValid = isValidSAIDNumber(SaID);
    if (isValid && fileUri != '') {
      var specialId=uuid.v4();
      //console.log(specialId);
      try {
        firestore()
          .collection('Applications')
          .where('userId', '==', currentVisitorId.trim()).get()
          .then(querySnapshot => {
            if (querySnapshot.size==1) { 
              Alert.alert('Application exist', 'We already received an application for this account.');
            } else if(querySnapshot.size==0) {
              const reference = storage().ref(("/Applications/" + String(specialId+fileName)));
              const task = reference.putFile(fileUri);
              task.on('state_changed', taskSnapshot => {
                setupload(String(taskSnapshot.bytesTransferred))
                setTotalup(String(taskSnapshot.totalBytes));
              });
    
              task.then(async () => {
                
                const url = await storage().ref(("/Applications/" + String(specialId+fileName))).getDownloadURL();
                firestore()
                  .collection('Applications')
                  .add({
                    name: currentVisitorName,
                    said: SaID,
                    filelink: url,
                    fileName: String(specialId+fileName), //array
                    userId: currentVisitorId,
                    applyDate:new Date().toLocaleDateString(),
                    Hrfile:[],
                    HrfileName:[],
                    medReport:'no file',
                    medReportName:'no file',
                    profileimage:currentData?.profimage,
                    doctorName:'none',
                    doctorId:'none',
                    email:currentData?.Email
                  })
                  .then((resp) => {
                    //update my application status to submitted
                    firestore()
                    .collection('users')
                    .doc(currentVisitorId)
                    .update({
                      applied: 'external medical letter submitted',
                      applicationId:resp.id
                    }).catch(err=>console.log(String(err)))
                    setupload('');
                    setTotalup('');
                    setFileName('');
                    Alert.alert('Succesful', 'You have uploaded your details to our Application receive Desk.\n A doctor will be assigned to you once your details are reviewed.');
                  }).catch((err) => {
    
                    setupload('');
                    setTotalup('');
                    console.log(err)
                  });
    
              }).catch((err) => { console.log(err) });
            }

          });

      } catch (error) {
        setupload('');
        setTotalup('');
        console.log(error)
      }
    } else {
      if (fileUri == '') {
        Alert.alert('Notification', 'Please select a file to upload');
      }

    }
  }

  return (
    <ScrollView style={{ margin: 10, gap: 5 }}>
      <View style={{ flexDirection: 'row' }}>
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
          style={{ borderColor: '#FFBD11', backgroundColor: '#FFBD11' }}
          mode="elevated"
          onPress={() => {
            navigation.navigate('Applications');
          }}>
          Back
        </Button>
        <TouchableOpacity onPress={()=>refreshPage()} style={{marginLeft:10,alignSelf:'center'}}><Ionicons name="refresh" size={24} color="black" /></TouchableOpacity>
      </View>

      {
        IsApproved==false ? 
        <>
        <Text>Take note of you SA ID number as recorded with us. if you think this is wrong please go update you profile before attempting a submittion.</Text>
        <Text>{SaID}</Text>

      <View style={{ flexDirection: 'row' }}>
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
          style={{ borderColor: '#FFBD11', backgroundColor: '#FFBD11' }}
          mode="elevated"
          onPress={() => selectDoc()}>
          Attach medical letter
        </Button>

      </View>
      <Text>{fileName}</Text>
      <View style={{ flexDirection: 'row', marginTop: 30 }}>
        <Button
          icon={() => (
            <MaterialCommunityIcons
              name="sticker-check"
              size={24}
              color="black"
            />
          )}
          rippleColor={'white'}
          textColor="black"
          style={{ borderColor: '#FFBD11' }}
          mode="outlined"
          onPress={() => {
            if (SaID.length == 13 && fileName !== '') {
              Alert.alert(
                'Confirnation',
                `Your Details are about to be captured as follows:\n Name: ${currentVisitorName}\nID no: ${SaID}\nHospital Medical certificate: ${fileName}`,
                [
                  {
                    text: 'Ok',
                    onPress: () => upload(),
                  },
                  {
                    text: 'Cancel',
                    onPress: () => { },
                  },
                ],
              );
            } else {
              Alert.alert('Form error', 'Please make sure you have submitted a valid SA ID number. you may update this in you profile tab or screen');
            }

          }}>
          accept & send
        </Button>
      </View>
        </>
        :<Finance/>  
      }
      {startup != '' && <View style={{ marginLeft: 10 }}><Text>uploading {startup}kb of {Totalup}kb</Text>
        <ActivityIndicator animating={true} color={MD2Colors.orangeA200} /></View>}
        <Snackbar
      duration={2000}
        visible={visible}
        onDismiss={onDismissSnackBar}
        >
        Refreshing...
      </Snackbar>
    </ScrollView>
  );
};

export default ApplicationDetails;
