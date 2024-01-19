
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Native from "react-native";
import ConnectwithUs from '../components/ConnectwithUs';
import { AnimatedFAB, Card, Snackbar, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { View } from 'react-native';
import { Image } from 'react-native';

const Feed = () => {
  const scrollViewRef =useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };
  return (

    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}
       ref={scrollViewRef}>
      <ConnectwithUs />
      <View
        style={{ flexDirection: 'row', justifyContent: 'center' }}
      >
        <Native.Text style={{ fontSize: 25, fontFamily: 'Itim-Regular', color: '#FFBD11' }}>Like ❤️ to </Native.Text>
        <Native.Text style={{ fontSize: 20, fontFamily: 'Itim-Regular' }}>know more <Native.Text style={{ fontSize: 25, fontFamily: 'Itim-Regular', color: '#FFBD11' }}>about</Native.Text> us</Native.Text>

      </View>
      <Native.Text style={{ alignSelf: 'center' }}>Connect with us...</Native.Text>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 5 }}>
        <Card>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              padding: 5,
              justifyContent: "center",
              backgroundColor: "#FAF9F6",
              alignItems: 'center'
            }}
          >
            <Ionicons name="logo-twitter" size={24} color="black" />
            <Native.Text>@GrantEase</Native.Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              padding: 5,
              justifyContent: "center",
              backgroundColor: "#FAF9F6",
              alignItems: 'center'
            }}
          >
            <MaterialIcons name="facebook" size={24} color="black" />
            <Native.Text>GrantEase</Native.Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              padding: 5,
              justifyContent: "center",
              backgroundColor: "#FAF9F6",
              alignItems: 'center'
            }}
          >
            <Ionicons name="logo-linkedin" size={24} color="black" />
            <Native.Text>GrantEase</Native.Text>
          </TouchableOpacity>
        </Card>


      </View>
      <Card style={{ margin: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/grantlogo.png')} style={{ width: 30, height: 30 }} />
          <Native.Text style={{ color: 'black' }}>Our Story...</Native.Text>
        </View>
        <Native.Text style={{ fontFamily: 'Itim-Regular' }}>
          Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of
          type and scrambled it to make a type specimen book. It
          has survived not only five centuries, but also the leap
          into electronic typesetting, remaining essentially unchanged.</Native.Text>
      </Card>

      <Card
      style={{ margin: 10, padding: 10 }}
      >
        <Card.Content>
          <Text variant="titleLarge">Mission</Text>
        </Card.Content>
        <Card.Cover source={require('../assets/mission.jpg')}/>
        <Card.Content>
          <Text variant="bodyMedium">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
        </Card.Content>
      </Card>
      <Card
      style={{ margin: 10, padding: 10 }}
      >
        <Card.Content>
          <Text variant="titleLarge">Vission</Text>
        </Card.Content>
        <Card.Cover source={require('../assets/vission.jpg')} />
        <Card.Content>
          <Text variant="bodyMedium">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
        </Card.Content>
      </Card>
      <Card
      style={{ margin: 10, padding: 10 }}
      >
        <Card.Content>
          <Text variant="titleLarge">Values</Text>
        </Card.Content>
        <Card.Cover source={require('../assets/value.jpg')} />
        <Card.Content>
          <Text variant="bodyMedium">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Text>
        </Card.Content>
      </Card>
      
      </ScrollView>
      <AnimatedFAB
        rippleColor={'white'}
        icon={() => (<Feather name="chevrons-up" size={24} color="black" />)}
        label={'Label'}
        extended={false}
        onPress={() => {
          scrollToTop();
        }}
        visible={true}
        animateFrom={'right'}
        iconMode={'static'}
        style={[styles.fabStyle]}
      />
    </SafeAreaView>
  );
}

export default Feed;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
    backgroundColor: '#FFBD11'
  },
});