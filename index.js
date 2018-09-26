/** @format */

import {Navigation} from 'react-native-navigation';
import Login from './src/components/Login';
import Feed from './src/components/Feed';
import {name as appName} from './app.json';

Navigation.registerComponent('Login', () => Login);
Navigation.registerComponent('Feed', () => Feed);

Navigation.startSingleScreenApp({
    screen:{
        screen: 'Login',
        title: 'Login',
    }
})
