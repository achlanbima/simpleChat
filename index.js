/**
 * @format
 */

import { Navigation } from "react-native-navigation";
import App from './App';
import {registerScreen} from './src/register'
import {AsyncStorage} from 'react-native'

registerScreen();
Navigation.registerComponent(`navigation.playground.WelcomeScreen`, () => App);

getStore = async () => {
  const token = await AsyncStorage.getItem('@token')
  if(token==null){
    Navigation.setRoot({
      root: {
        component: {
          name: "login"
        }
      }
    });
  }else{
    Navigation.setRoot({
      root: {
        component: {
          name: "main"
        }
      }
    });
  }
}
Navigation.events().registerAppLaunchedListener(() => {
  getStore();
});