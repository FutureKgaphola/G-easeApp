
import React from 'react';
import { StyleSheet,Image,View} from 'react-native';

const Banner = () => {
    return ( 
      <View>
        <Image style={styles.Himage} source={require('../assets/connect.png')} />
      </View>
        
     );
}
 
export default Banner;

const styles=StyleSheet.create({
    Himage: {
        width: "100%",
        height: 228,
        shadowColor: "#000",
        objectFit:'scale-down',

      }   
})

