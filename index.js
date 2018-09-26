/** @format */

import {Navigation} from 'react-native-navigation';
import Login from './src/components/Login';
import Feed from './src/components/Feed';
import { AsyncStorage } from 'react-native';

import {name as appName} from './app.json';

Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Feed', () => Feed);

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
