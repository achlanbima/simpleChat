import {Navigation} from 'react-native-navigation'

export function registerScreen(){
  Navigation.registerComponent(`login`, () => require('./screens/Login').default);
  Navigation.registerComponent(`main`, () => require('./screens/Main').default);
}