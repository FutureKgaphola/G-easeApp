import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, Alert, FlatList, Dimensions, Linking, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Card, Button, Avatar, Portal, Modal, Chip } from 'react-native-paper';
//import DateTimePicker from 'react-native-modal-datetime-picker';
import { AppContext } from '../AppManager/Manager';
import storage from "@react-native-firebase/storage";
//import Carousel from 'react-native-snap-carousel';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const Updates = () => {

  const [data, setfeeds] = React.useState<FeedsData[]>([]);
  interface FeedsData {
    id: string;
    title: string;
    tumbnail: string;
    msg: string;
    url: string;
  }
  var nurse = "https://firebasestorage.googleapis.com/v0/b/sassa-c2b7f.appspot.com/o/nurse.png?alt=media&token=b68ce278-88cb-4d84-bc5f-fc5b71660437";

  const renderItem = ({ item }: { item: any }) => (
    <View style={{ margin: 10 }}>
      <Card>
        <MaterialIcons name="rss-feed" size={19} color="black" />
        <Card.Title title={item?.title} />
        <Card.Content>
          <Text>{item?.msg}</Text>
        </Card.Content>
        <Card.Cover resizeMode='contain' source={{ uri: item?.tumbnail }} />
        <Card.Actions>
          <Button onPress={() => {
            Linking.openURL(item.url).catch((err) => {
              Alert.alert('Browser error', String(err));
            })
          }}
            rippleColor={'#FFBD11'}
            style={{ borderColor: '#FFBD11' }}
            textColor='#FFBD11'
          >read more</Button>
          <Button onPress={() => {
            Linking.openURL(
              `whatsapp://send?text=${item.url}`
            ).catch((err) => {
              Alert.alert('Sharring error', String(err));
            })
          }} rippleColor='white' style={{ backgroundColor: '#FFBD11' }}>share</Button>
        </Card.Actions>
      </Card>
    </View>
  );
  const { currentVisitorId } = React.useContext(AppContext);
  //const [isvisible, SetVisible] = React.useState(false);


  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20 };



  const videoRef = React.useRef(null);
  var DateTime = '';
  const [doctor, setSelectedDoctor] = React.useState('');
  const [doctor_id, setSelectedDoctor_id] = React.useState('');
  const [appointmentId, SetAppointid] = useState('');
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
    addrs:string;
  }
  interface doctorData {
    id: string;
    firstD: string;
    secondD: string;
    
  }
  const [appointments, setAppointments] = React.useState<FirestoreData[]>([]);
  function onResult(QuerySnapshot: any) {
    const fetchedData: FirestoreData[] = [];
    QuerySnapshot.forEach((documentSnapshot: any) => {
      if (
        documentSnapshot.data()?.iscancelled == 'no' &&
        documentSnapshot.data()?.patientId == currentVisitorId
      ) {
        fetchedData.push({
          id: String(documentSnapshot?.id),
          doctor: String(documentSnapshot.data()?.doctor),
          dateapoint: String(documentSnapshot.data()?.dateapoint),
          timebooked: String(documentSnapshot.data()?.timebooked),
          doctorId: String(documentSnapshot.data()?.doctorId),
          doctorImage: String(documentSnapshot.data()?.doctorImage),
          iscancelled: String(documentSnapshot.data()?.iscancelled),
          patientId: String(documentSnapshot.data()?.patientId),
          patientName: String(documentSnapshot.data()?.patientName),
          resheduleStatus: String(documentSnapshot.data()?.resheduleStatus),
          sheduleRequestDate: String(
            documentSnapshot.data()?.sheduleRequestDate,
          ),
          specialization: String(documentSnapshot.data()?.specialization),
          addrs:String(documentSnapshot.data()?.addrs)
        });
      }
      setAppointments(fetchedData);
    });
  }

  function onError(error: any) {
    Alert.alert('Firebase error', String(error));
  }
  const onFeedResult = (QuerySnapshot: any) => {
    const fetchedData: FeedsData[] = [];
    QuerySnapshot.forEach((documentSnapshot: any) => {
      fetchedData.push(
        {
          id: String(documentSnapshot?.id),
          title: String(documentSnapshot.data()?.title),
          tumbnail: String(documentSnapshot.data()?.tumbnail),
          msg: String(documentSnapshot.data()?.msg),
          url: String(documentSnapshot.data()?.url)
        }
      )

    })
    setfeeds(fetchedData);
  }
  const [doctors, setDoctors] = React.useState<doctorData[]>([]);
  // const onDctrResult=(QuerySnapshot: any)=>{
  //   const fetchedData: doctorData[] = [];
  //   QuerySnapshot.forEach((documentSnapshot: any) => {
  //     fetchedData.push(
  //       {
  //         id:String(documentSnapshot?.id),
  //         firstD:String(documentSnapshot.data()?.firstD),
  //         secondD:String(documentSnapshot.data()?.secondD),
  //       }
  //     )
  //   })
  //   setDoctors(fetchedData);
  // }
  const onFeedError = (error: any) => {
    Alert.alert('Firebase error', String(error));
  }

  // const onDctrError=(error: any)=>{
  //   Alert.alert('Firebase error', String(error));
  // }

  useEffect(() => {
    const subscriber = firestore()
      .collection('Apointments')
      .onSnapshot(onResult, onError);

    const feed = firestore()
      .collection('Feeds')
      .onSnapshot(onFeedResult, onFeedError);


    // const doctrs = firestore()
    // .collection('Doctors')
    // .onSnapshot(onDctrResult, onDctrError);

    return () => subscriber();
  }, []);


  const GetDateAvailable = (d_id: string) => {
    const fetchedData: doctorData[] = [];
    firestore()
      .collection('Doctors')
      .get().then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id == d_id) {
            fetchedData.push(
              {
                id: String(documentSnapshot?.id),
                firstD: String(documentSnapshot.data()?.firstD),
                secondD: String(documentSnapshot.data()?.secondD),
              }
            )
          }
        })
        setDoctors(fetchedData);
      })
  }



  // const handlePicker = (datetime: string) => {
  //   SetVisible(false);
  //   DateTime = datetime;
  //   confirmDialog();
  // };
  // const showPicker = () => {
  //   SetVisible(true);
  // };
  // const hidePicker = () => {
  //   SetVisible(false);
  // };
  const confirmDialog = () => {
    Alert.alert(
      'Confirmation',
      `You are about to request a rechedule with Doctor ${doctor}.\n Reschedule to ${DateTime}`,
      [
        {
          text: 'accept',
          onPress: () => {
            firestore()
              .collection('Apointments')
              .doc(appointmentId)
              .update({
                resheduleStatus: 'Requesting reshedule',
                sheduleRequestDate: String(DateTime),
              })
              .catch(err => console.log(String(err)));
          },
        },
        { text: 'no, cancel', onPress: () => { } },
      ],
    );
  };

  const cancelAppointment = (id: string) => {
    Alert.alert(
      'Cancelation',
      'You are about to cancel this appointment and you application will also be withdrawn from our medical team. Are you sure ?',
      [
        {
          text: 'yes',
          onPress: () => {
            firestore()
              .collection('Apointments')
              .doc(id)
              .update({
                iscancelled: 'yes',
              })
              .catch(err => console.log(String(err)));

            //remove application

            firestore()
              .collection('Applications')
              .where('userId', '==', currentVisitorId.trim())
              .get()
              .then(querySnapshot => {
                if (querySnapshot.size == 1) {
                  //remove this document
                  querySnapshot.forEach(documentSnapshot => {
                    let filename = documentSnapshot.data()?.fileName;
                    let docId = documentSnapshot.id;
                    //remove media file then remove this document fron firestore database
                    storage().ref(("/Applications/" + filename)).delete().then(() => {
                      /// delete this document reference
                      firestore()
                        .collection('Applications')
                        .doc(docId)
                        .delete().then(() => {
                          firestore()
                            .collection('users')
                            .doc(currentVisitorId)
                            .update({
                              applied: 'no application',
                            }).catch(err => console.log(String(err)))
                        })
                    }).catch(err => { console.log(err) })

                  });
                }
              });
          },
        },
        { text: 'no', onPress: () => { } },
      ],
    );
  };

  const updateAppointment = (ds: string) => {
    firestore()
      .collection('Apointments')
      .doc(appointmentId)
      .update({
        dateapoint: ds,


      }).then(() => {
        Alert.alert('Updated', "Date changed succesfull");
      }).catch((err: any) => {
        Alert.alert(String(err));
      })
  }

  return (
    <ScrollView>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Available dates.</Text>
          {doctors.map((item) => (
            <View key={item.id} style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
              <Chip style={{ backgroundColor: '#FFBD11' }} icon={() => (<EvilIcons name="clock" size={24} color="black" />)} onPress={() => updateAppointment(item.firstD)}>{item.firstD}</Chip>
              <Chip style={{ backgroundColor: '#FFBD11' }} icon={() => (<EvilIcons name="clock" size={24} color="black" />)} onPress={() => updateAppointment(item.secondD)}>{item.secondD}</Chip>
            </View>
          ))}

        </Modal>
      </Portal>
      {
        appointments.length == 0 && <Text style={{ margin: 5 }}>No appointments (doctor appointment will reflect here above the feeds once assigned)</Text>
      }

      {/* <DateTimePicker
        isVisible={isvisible}
        onConfirm={d => handlePicker(d.toLocaleDateString())}
        onCancel={() => hidePicker()}
        mode={'date'}
        is24Hour={false}
      /> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{
          marginBottom: 7,
          marginLeft: 7,
          marginRight: 7,
          backgroundColor: '00FFFFFF',
        }}
        data={appointments}
        renderItem={({ item }) => (
          <Card
            key={item?.id}
            style={{ marginTop: 10, backgroundColor: '#FAFAFD' }}>
            <Image style={styles.imageIN} source={{ uri: String(item?.doctorImage).includes('http') ? String(item?.doctorImage) : String(nurse) }} />
            <Text style={styles.itemN}>{item?.doctor}</Text>

            <Text style={styles.itemC}>{item?.specialization}</Text>
            <Text style={styles.itemC}>"location:" {item?.addrs}</Text>

            <Card style={{ backgroundColor: '#FAFAFD', margin: 5 }}>
              <View style={styles.ItemC2}>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 5,
                    justifyContent: 'center',
                    gap: 5,
                  }}>
                  <Ionicons name="time-outline" color="#FFBD11" size={24} />
                  <Text style={styles.itemT}>{item?.timebooked}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    margin: 5,
                    justifyContent: 'center',
                    gap: 5,
                  }}>
                  <Ionicons name="calendar-outline" color="#FFBD11" size={20} />
                  <Text style={styles.itemT}>{item?.dateapoint}</Text>
                </View>
              </View>
            </Card>

            {item.resheduleStatus == 'not set' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 5,
                }}>
                {/* <Button
                  icon={() => (
                    <Ionicons name="close-outline" color="black" size={24} />
                  )}
                  rippleColor={'#FFBD11'}
                  textColor="black"
                  style={{ borderColor: '#FFBD11' }}
                  mode="outlined"
                  onPress={() => cancelAppointment(item.id)}>
                  Cancel
                </Button> */}
                <Button
                  icon={() => (
                    <Ionicons name="create" color="white" size={24} />
                  )}
                  rippleColor={'#FFBD11'}
                  textColor="white"
                  style={{ borderColor: '#FFBD11', backgroundColor: '#FFBD11' }}
                  mode="outlined"
                  onPress={() => {
                    setSelectedDoctor(item.doctor);
                    setSelectedDoctor_id(item.doctorId);
                    GetDateAvailable(item.doctorId);
                    showModal();
                    SetAppointid(item.id);
                  }}>
                  Reschedule
                </Button>
              </View>
            ) : null}

            {item.resheduleStatus !== 'not set' ? (
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: '700',
                  color: 'green',
                  margin: 5,
                }}>
                {item.resheduleStatus}
              </Text>
            ) : null}
          </Card>
        )}
      />
      {/* <Carousel
        data={data}
        renderItem={renderItem}
        sliderWidth={Dimensions.get('window').width - 20}
        itemWidth={300}
        autoplay={true}
        autoplayInterval={5000}
        loop={true}
      /> */}

      <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={data}
      renderItem={renderItem}
      />


    </ScrollView>
  );
};

export default Updates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F2ED',
    gap: 5,
  },
  video: {
    width: "100%",
    height: "100%",
    marginBottom: 10
  },
  BCont: {
    backgroundColor: '#F6F6F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    margin: 3,
  },

  BTxt: {
    color: '#FFFFFF',
    alignSelf: 'center',
    bottom: 25,
    left: 15,
    fontWeight: '600',
    fontSize: 13,
  },
  BTxt2: {
    color: '#FFFFFF',
    alignSelf: 'center',
    bottom: 25,
    left: 15,
    fontWeight: '600',
    fontSize: 13,
  },
  BTxt3: {
    color: '#FFFFFF',
    alignSelf: 'center',
    bottom: 25,
    left: 10,
    fontWeight: '600',
    fontSize: 13,
  },
  Bupdates: {
    backgroundColor: '#FFBD11',
    width: 103,
    height: 31,
    borderRadius: 15,
  },

  BApp: {
    backgroundColor: '#FFBD11',
    width: 103,
    height: 31,
    borderRadius: 15,
    marginHorizontal: '2%',
  },
  BCancel: {
    backgroundColor: '#FFBD11',
    width: 122,
    height: 31,
    borderRadius: 15,
  },

  ScrollCont: {
    padding: 3,
    backgroundColor: 'white',
  },

  arrCont: {
    backgroundColor: '#FAFAFD',
    width: '100%',
    height: 165,
    borderRadius: 15,
    marginVertical: '2%',
  },
  imageIN: {
    width: 45,
    height: 49,
    borderRadius: 66,
    left: '83%',
    top: '7%',
    backgroundColor: 'white',
  },

  itemN: {
    fontSize: 15,
    fontWeight: 'bold',
    bottom: '20%',
    left: '10%',
    color: 'black',
  },

  itemC: {
    fontSize: 13,
    fontWeight: 'bold',
    bottom: '20%',
    left: '10%',
    color: '#726C6C',
  },

  ItemC2: {
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemT: {
    fontSize: 15,
    color: '#FFBD11',
    fontWeight: 'bold',
  },

  btnC2: {
    backgroundColor: '#FFBD11',
    width: 130,
    height: 33.5,
    bottom: '26%',
    borderRadius: 15,
    left: '55%',
  },

  addtxt: {
    bottom: '85%',
    left: '35%',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

  BtnC: {
    backgroundColor: '#FBF8F8',
    width: 130,
    height: 33.5,
    bottom: '5%',
    borderRadius: 15,
    left: '5%',
    borderColor: '#FFBD11',
    borderWidth: 2,
  },

  CancelTxt: {
    bottom: '85%',
    left: '40%',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
