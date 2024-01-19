import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value:any) => {
    try {
      if (value!==null) {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('my-key', jsonValue);
      }
    } catch (e) {
      // saving error
      console.log('Async storage saving error');
    }
  };

  export const storeSignInMethod = async (value:any) => {
    try {
      if (value!==null) {
        await AsyncStorage.setItem('method', value);
      }
    } catch (e) {
      // saving error
      console.log("saving method error");
    }
  };
  export const getstoreSignInMethod = async () => {
    try {
      const value = await AsyncStorage.getItem('method');
      if (value !== '' || value !== null) {
        // value previously stored
        return value;
      }else{
        return;
      }
    } catch (e) {
      // error reading value
      console.log("error reading method stored");
    }
  };

export const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('my-key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value   
      console.log('Async storage reading error');
      return;
    }
  };