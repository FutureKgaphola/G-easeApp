
import { registerRootComponent } from 'expo';
import {AppProvider} from './AppManager/Manager';
import App from './App';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
const AppContainerView = () => {
  return ( 
    <PaperProvider>
    
    <AppProvider>
    <App />
  </AppProvider>

  </PaperProvider>
   );
}
 
registerRootComponent(AppContainerView);