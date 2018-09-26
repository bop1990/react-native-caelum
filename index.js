/** @format */

import {Navigation} from 'react-native-navigation';
import Login from './src/components/Login';
import Feed from './src/components/Feed';
import { AsyncStorage } from 'react-native';

import {name as appName} from './app.json';
import AluraLingua from './src/components/AluraLingua';

Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Feed', () => Feed);
Navigation.registerComponent('AluraLingua', () => AluraLingua);

AsyncStorage.getItem('token')
    .then(token =>{
        if(token){
            return {
                screen: 'Feed',
                title: appName,
            };
        }

        return {
            screen: 'Login',
            title: 'Login',
        };
    })
    .then(screen => Navigation.startSingleScreenApp({screen}));
