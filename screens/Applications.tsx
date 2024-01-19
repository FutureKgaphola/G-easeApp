import {useState, useContext, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,Alert
} from 'react-native';
import storage from "@react-native-firebase/storage";
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button, Card} from 'react-native-paper';
import {AppContext} from '../AppManager/Manager';
import {getData} from '../localstorage/storage';
import Icon from 'react-native-vector-icons/Zocial';
import firestore from '@react-native-firebase/firestore';
import { searchdelete } from '../methods/Search_n_delete';

const Applications = ({navigation}: {navigation: any}) => {
  const account = async () => {
    var persitentData = await getData();
  };
  const [payments, setPayments] = useState<FirestoreData[]>([]);
  account();
  const {currentData, currentVisitorId} =
    useContext(AppContext);

    interface FirestoreData {
      id: string;
      Authorizer: string;
      Date: string;
    }

    useEffect(()=>{
      const subscriber = firestore()
      .collection('paymentsDates')
      .onSnapshot(onResult, onError);
    //return () => subscriber();
    },[]);

    function onError(error: any) {
      Alert.alert('Firebase error', String(error));
    }

    
    function onResult(QuerySnapshot: any){
      const fetchedData: FirestoreData[] = [];
      QuerySnapshot.forEach((documentSnapshot: any) => {
        console.log(documentSnapshot?.id);
        fetchedData.push({
          id:String(documentSnapshot?.id),
          Authorizer: String(documentSnapshot.data()?.Authorizer),
          Date: String(documentSnapshot.data()?.Date),
        }) 
      })
      setPayments(fetchedData);
    }
  

  const DownloadUrApplication = () => {
    Alert.alert("Notification",'Would you like to download your personal documents shared to GrantEase or withdraw your application ?',
    [
      {
        text: 'download',
        onPress: () => {
          firestore()
          .collection('Applications')
          .where('userId', '==', currentVisitorId.trim())
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size == 1) {
              querySnapshot.forEach(documentSnapshot => {
                const fileUrl = documentSnapshot.data().filelink;
                const Hrfile= documentSnapshot.data().Hrfile;
                if(fileUrl.includes("http")){
                  Linking.openURL(fileUrl)
                  .catch(err => console.error('Error opening external link:', err))
                }
                // if(Hrfile.includes("http")){
                //   Linking.openURL(Hrfile)
                //   .catch(err => console.error('Error opening external link:', err))
                // }
    
              });
            }
          });

        }
        ,
        style: 'cancel',
      },
      {text: 'withdraw', onPress: () => {
        withdrawApplication();

      }},

      {text: 'not now', onPress: () => {}},
    ]);

    const withdrawApplication = () => {
      firestore()
        .collection('Applications')
        .where('userId', '==', currentVisitorId.trim())
        .get()
        .then(querySnapshot => {
          if (querySnapshot.size == 1) {
            querySnapshot.forEach(documentSnapshot => {
              let Hrfile = documentSnapshot.data()?.Hrfile;
              let HrfileName = documentSnapshot.data()?.HrfileName;
              let fileName=documentSnapshot.data()?.fileName;
              let filelink=documentSnapshot.data()?.filelink;
              var docId=currentData?.applicationId;
              // if (Hrfile.length>0 || filelink.includes('http')) {
              //   storage()
              //     .ref('/Applications/' + HrfileName[0])
              //     .delete()
              //     .then(() => {
  
              //       if (Hrfile.length>0) {
              //         firestore()
              //           .collection('Applications')
              //           .doc(docId)
              //           .delete()
              //           .then(() => {
              //             firestore()
              //               .collection('users')
              //               .doc(currentVisitorId)
              //               .update({
              //                 applied: 'no application',
              //                 medcertificate: 'not applicable',
              //                 medical: 'not approved',
              //                 illness: 'not applicable',
              //                 applicationId:'',
                              
              //               });
              //             Alert.alert(
              //               'Application Withdrawal',
              //               'You have withdrawn your application from the GrantEase Hr team',
              //             );
                          
              //           })
              //           .catch(err => {
              //             Alert.alert(
              //               'Withdrawal error',
              //               'Something went wrong : ' + String(err),
              //             );
              //           });
              //       } 
              //     })
              //     .catch(err => {
              //       Alert.alert('Withdrawal error', String(err));
              //     });

              //     //search and remove appointment if exist
              //     try {
              //       searchdelete("Apointments","patientId",currentVisitorId,"==");
              //     } catch (error) {
              //       console.log("searchdelete error: ",String(error));
              //     }
              // } 
              if(Hrfile.length>0 ){
                Alert.alert(
                  'Withdrawal denial',
                  'Application withdrawal at this stage is not permitted. contact administrator',
                );
                return;
              }else{
                if (filelink.includes('http') && fileName !== '') {
                  storage()
                    .ref('/Applications/' + fileName)
                    .delete()
                    .then(() => {
    
                      if (filelink.includes('http')) {
                        firestore()
                          .collection('Applications')
                          .doc(docId)
                          .delete()
                          .then(() => {
                            firestore()
                              .collection('users')
                              .doc(currentVisitorId)
                              .update({
                                applied: 'no application',
                                medcertificate: 'not applicable',
                                medical: 'not approved',
                                illness: 'not applicable',
                                applicationId:'',
                                finance:'not approved'
                                
                              });
                              
                            Alert.alert(
                              'Application Withdrawal',
                              'You have withdrawn your application from our Receiving desk team',
                            );
                          })
                          .catch(err => {
                            Alert.alert(
                              'Withdrawal error',
                              'Something went wrong : ' + String(err),
                            );
                          });
                      } 
                    })
                    .catch(err => {
                      Alert.alert('Withdrawal error', String(err));
                    });
  
                    //search and remove appointment if exist
                    try {
                      searchdelete("Apointments","patientId",currentVisitorId,"==");
                    } catch (error) {
                      console.log("searchdelete error: ",String(error));
                    }
                } 
              }

            });
          }
        });
    };
    
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        <Button
          icon={() => (
            <MaterialIcons name="upload-file" size={24} color="#FFBD11" />
          )}
          rippleColor={'#FFBD11'}
          textColor="black"
          style={{borderColor: '#FFBD11'}}
          mode="elevated"
          onPress={() => {
            navigation.navigate('ApplicationDetails');
          }}>
          Apply for grant
        </Button>
      </View>

      <Card style={{margin: 7, overflow: 'hidden'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={{color: 'black', fontWeight: '700', marginLeft: 5}}>
              Beneficiary : {currentData?.Name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 3,
                alignItems: 'center',
                marginLeft: 5,
              }}>
              <Text>Medical conditon :</Text>
              <Text>{currentData?.illness}</Text>
              
            </View>
            <Text style={{marginLeft: 5}}>
              Financial Status : {currentData?.finance}
            </Text>
            <Text style={{marginLeft: 5}}>
              Medical Report : {currentData?.medical}
            </Text>
            {currentData?.applied == 'external medical letter submitted' ||
            currentData?.applied == 'final application processing' ? (
              <TouchableOpacity onPress={() => DownloadUrApplication()}>
                <Text
                  style={{
                    marginLeft: 5,
                    color: 'green',
                    textDecorationLine: 'underline',
                  }}>
                  {currentData?.applied}
                </Text>
              </TouchableOpacity>
              
            ) : null}
          </View>
          <View>
            <Image
              style={{
                width: 70,
                height: 70,
                borderRadius: 100,
                objectFit: 'contain',
                margin: 10,
              }}
              source={
                currentData?.signmethod == 'google'
                  ? {uri: currentData?.profimage}
                  : require('../assets/money.png')
              }
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <Button
            onPress={() =>
              Linking.openURL(
                'mailto:support@sassa.com?subject=Disability grant equiry',
              )
            }
            icon={() => <Icon name="email" size={24} color="white" />}
            buttonColor="#FFBD11"
            elevation={5}
            style={{margin: 5}}
            textColor="white"
            rippleColor={'white'}
            mode="elevated">
            enquire
          </Button>
        </View>
      </Card>

      <Text style={{color: 'black', marginTop: 10}}>Payment dates</Text>
      
        <ScrollView style={{marginBottom:15}} showsVerticalScrollIndicator={false}>
          {currentData?.finance == 'approved' &&
          currentData?.medical == 'approved'
            ? payments.map(item => (
                <Card
                  key={item.id}
                  style={{
                    overflow: 'hidden',
                    borderColor: 'black',
                    borderWidth: 1,
                    marginTop: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: 5,
                    }}>
                    <Fontisto name="date" size={24} color="black" />
                    <Text style={styles.txtP}>{item?.Date}</Text>
                  </View>
                </Card>
              ))
            : null}
        </ScrollView>
      
    </View>
  );
};

export default Applications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    padding: 5,
  },

  ScrollCont: {
    width: '98%',
  },

  HPD: {
    right: '30%',
    fontSize: 19,
    fontWeight: 'bold',
  },
  Pcont: {
    backgroundColor: '#EBF5F0',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  txtP: {
    fontWeight: 'bold',
    fontSize: 15,
    margin: '4%',
    color: '#FFBD11',
  },
});
