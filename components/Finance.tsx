import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import {ActivityIndicator, MD2Colors,Snackbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {AppContext} from '../AppManager/Manager';
import uuid from 'react-native-uuid';

const Finance = () => {
  const {currentVisitorId} = useContext(AppContext);

  const [fileform, setFileForm] = useState('');
  const [fileIdno, setFileIdno] = useState('');
  const [fileRes, setFileRes] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const [startup, setupload] = useState('');
  const [Totalup, setTotalup] = useState('');
  const [isDisabled, setDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const onDismissSnackBar = () => setVisible(false);
  var docId: string;

  const [M_visible, setM_Visible] = useState(false);

  const showModal = () => setM_Visible(true);
  const hideModal = () => setM_Visible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  

  const PickAllowed=async(picked:string)=>{
    try {
      const doc = await DocumentPicker.pickSingle({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
        ],
        copyTo: 'cachesDirectory',
      });

      if(picked=="saId"){
        setFileIdno(String(doc.name));
        setSelectedDocuments(prevArray => [...prevArray,String(doc.fileCopyUri)])
        // if(allfileUri[0]==undefined){
          
        //   allfileUri[0]=String(doc.fileCopyUri);
        //   console.log('picked: '+allfileUri[0])
          
        // }
        // if(allfileUri[0]!==undefined){
        //   if(allfileUri[0]!==String(doc.fileCopyUri)){
        //     allfileUri[0]=String(doc.fileCopyUri);
        //   }
        // }

      }else if(picked=="residence"){
        setFileRes(String(doc.name));
        setSelectedDocuments(prevArray => [...prevArray,String(doc.fileCopyUri)])
        // if(allfileUri[1]==undefined){
          
        //   allfileUri[1]=String(doc.fileCopyUri);
        //   console.log('picked: '+allfileUri[1]);
        // }
        // if(allfileUri[1]!==undefined){
        //   if(allfileUri[1]!==String(doc.fileCopyUri)){
        //     allfileUri[1]=String(doc.fileCopyUri);
        //   }
        // }
      }
      else if(picked=="form"){
        setFileForm(String(doc.name));
        setSelectedDocuments(prevArray => [...prevArray,String(doc.fileCopyUri)])
        // if(allfileUri[2]==undefined){
          
        //   allfileUri[2]=String(doc.fileCopyUri);
        //   console.log('picked: '+allfileUri[2]);
        //   console.log(allfileUri.length+' max len')
        // }
        // if(allfileUri[2]!==undefined){
        //   if(allfileUri[2]!==String(doc.fileCopyUri)){
        //     allfileUri[2]=String(doc.fileCopyUri);
        //   }
        // }
      }
      
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        setSelectedDocuments([]);
        Alert.alert('Unexpected error', String(error));
      }
    }
  }

  const upload = () => {
    if (selectedDocuments[0] !== undefined && selectedDocuments[1] !== undefined && selectedDocuments[2] !== undefined) {
      firestore()
        .collection('Applications')
        .where('userId', '==', currentVisitorId.trim())
        .get()
        .then(querySnapshot => {
          if (querySnapshot.size == 1) {
            querySnapshot.forEach(documentSnapshot => {
              docId = documentSnapshot.id;
              let Hrfile=[];
              Hrfile = documentSnapshot.data()?.Hrfile;

              if (Hrfile.length>0) {
                Alert.alert(
                  'Application exist',
                  'We already received an application for this account.',[{
                    text:'ok',
                    onPress:() =>{
                      setupload('');
                      setTotalup('');
                      setSelectedDocuments([]);
                      setFileIdno('');
                      setFileRes('');
                      setFileForm('');
                      
                    }
                    
                  }]
                );
              } else {
                
                let urlArray:any[];
                urlArray=[];
                let fileName:any[];
                fileName=[];
                fileName.push(fileIdno);
                fileName.push(fileRes);
                fileName.push(fileform);

                let NewFileNames:any[];
                NewFileNames=[];
                showModal();
                for (let index = 0; index < selectedDocuments.length; index++){
                  
                  let specialId=uuid.v4();
                  const reference = storage().ref('/Applications/' + String(specialId+fileName[index]));
                  NewFileNames.push(String(specialId+fileName[index]));
                  const task = reference.putFile(selectedDocuments[index]);
                  task.on('state_changed', taskSnapshot => {
                    console.log(
                      `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                    );
                    setupload(String(taskSnapshot.bytesTransferred));
                    setTotalup(String(taskSnapshot.totalBytes));
                  });

                  task.then(async () => {
                    const url = await storage()
                      .ref('/Applications/' + String(specialId+fileName[index]))
                      .getDownloadURL();
                      urlArray.push(url);
                      if(urlArray.length==3){
                        firestore()
                      .collection('users')
                      .doc(currentVisitorId)
                      .update({
                        applied: 'final application processing',
                        medcertificate: url,
                      })
                      .then(() => {
                        firestore()
                          .collection('Applications')
                          .doc(docId)
                          .update({
                            Hrfile: urlArray,
                            HrfileName: NewFileNames,
                          })
                          .then(() => {
                            setupload('');
                            setTotalup('');
                            NewFileNames=[];
                            setSelectedDocuments([]);
                            fileName=[];
                            setFileIdno('');
                            setFileRes('');
                            setFileForm('');
                            urlArray=[];
                            setDisabled(false);
                            hideModal();
                            Alert.alert(
                              'Succesful',
                              'Thank you for you submission. once our Team receives and reviews your document you will start to receive funds and payment dates on the app.',
                            );
                          });
  
                        setDisabled(false);
                      })
                      .catch(err => { hideModal();
                        console.log(String(err));
                      });
                      }
                    
                  });
              }
              }
            });
          }
        });
    } else {
      if (selectedDocuments.length<1) {
        Alert.alert('Notification', 'Please select files to upload');
      }
    }
  };

  const selectDoc = async (picked:string) => {
    firestore()
      .collection('users')
      .where('userId', '==', currentVisitorId.trim())
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(documentSnapshot => {
          let medcertificate = documentSnapshot.data()?.medcertificate;
          if (medcertificate.includes('https')) {
            PickAllowed(picked);
          } else {
            Alert.alert('Missing document', 'No medical letter found. you dont have the sassa medical letter/medical report yet from our internal doctors.');
          }
        });
      });
    
  };
  const getLetter = () => {
    firestore()
      .collection('users')
      .where('userId', '==', currentVisitorId.trim())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          let medcertificate = documentSnapshot.data()?.medcertificate;
          if (medcertificate.includes('https')) {
            Linking.openURL(medcertificate).catch(err =>
              console.error('Error opening external link:', err),
            );
          } else {
            Alert.alert('Missing document', 'No medical letter found');
          }
        });
      });
  };

 
  const getform = () => {
    const formUrl =
      'https://firebasestorage.googleapis.com/v0/b/sassa-c2b7f.appspot.com/o/MedicalAssessmentReferralForm.pdf?alt=media&token=cad67df0-138f-4efa-a556-f4eba1022726';
    Linking.openURL(formUrl)
      .then(() => console.log('Opened external link successfully'))
      .catch(err => console.error('Error opening external link:', err));
  };

  return (
    <ScrollView style={{padding: 5}} showsVerticalScrollIndicator={false}>
      <Text>
        {
          '1. Attach your certified ID\n 2. Attach your proof of residence. \n 3. Download the Disability grant form, fill and sign it then upload it\n 4. Click Accept & submit'
        }
      </Text>
      <Portal>
        <Modal visible={M_visible} dismissable={false}  contentContainerStyle={containerStyle}>
        <ActivityIndicator animating={true} color={MD2Colors.orangeA400} />
        <Text style={{alignSelf:'center'}}>Uploading...</Text>
        </Modal>
      </Portal>

      <TouchableOpacity
        style={{marginTop: 6, marginBottom: 6}}
        onPress={() => getLetter()}>
        <Text style={{color: 'green', textDecorationLine: 'underline'}}>
          Download your sassa medical letter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 6, marginBottom: 6}}
        onPress={() => getform()}>
        <Text style={{color: 'green', textDecorationLine: 'underline'}}>
          Download Disablity grant form
        </Text>
      </TouchableOpacity>

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
        style={{borderColor: '#FFBD11', backgroundColor: '#FFBD11',marginBottom:5}}
        mode="elevated"
        onPress={() => selectDoc("saId")}>
        Attach your ID
      </Button>
      <Text>{fileIdno}</Text>
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
        style={{borderColor: '#FFBD11', backgroundColor: '#FFBD11',marginBottom:5}}
        mode="elevated"
        onPress={() => selectDoc("residence")}>
        Attach your Proof of Resident
      </Button>
      <Text>{fileRes}</Text>
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
        style={{borderColor: '#FFBD11', backgroundColor: '#FFBD11',marginBottom:5}}
        mode="elevated"
        onPress={() => selectDoc("form")}>
        Attach your application form
      </Button>
      <Text>{fileform}</Text>

      <Button
        icon={() => (
          <Ionicons
            name="chevron-back-circle-outline"
            color="black"
            size={24}
          />
        )}
        rippleColor={'#FFBD11'}
        textColor="black"
        style={{borderColor: '#FFBD11'}}
        mode="outlined"
        onPress={() => upload()}>
        Accept & submit
      </Button>

      {startup != '' && (
        <View style={{marginLeft: 10}}>
          <Text>
            uploading {startup}kb of {Totalup}kb
          </Text>
          <ActivityIndicator animating={true} color={MD2Colors.orangeA200} />
        </View>
      )}
      <Snackbar
      duration={2000}
        visible={visible}
        onDismiss={onDismissSnackBar}
        >
        No application found
      </Snackbar>
    </ScrollView>
  );
};

export default Finance;
