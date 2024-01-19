import "./ignoreWarnings";
import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Login from './screens/Login';
import { AppContext } from './AppManager/Manager';
import Register from './screens/Register';
import Forgotpassword from './screens/Forgotpassword';
import { getData } from "./localstorage/storage";
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = React.useState(false);
  const { SetcurrentVisitorId } = React.useContext(AppContext);
  SplashScreen.preventAutoHideAsync();

  var initialRoute = "Login";

  useEffect(() => {

    const prepare = async () => {
      try {
        let resp = await getData();
        if (resp !== null && resp !== undefined && resp !== "") {
          SetcurrentVisitorId(resp.user?.uid);
          initialRoute = "Home";
        }
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }


  const options = { title: "", headerShown: false };
  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <StatusBar
        backgroundColor="#FFBD11"
      />
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={Login} options={options} />
        <Stack.Screen name="Home" component={Home} options={options} />
        <Stack.Screen name="Register" component={Register} options={options} />
        <Stack.Screen name="Forgotpassword" component={Forgotpassword} options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
