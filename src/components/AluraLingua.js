import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default class AluraLingua extends Component {

    render(){

        return(
            <View>
                <TouchableOpacity title='Aprenda Inglês'>
                    <Text>Aprenda Inglês</Text>
                </TouchableOpacity>
                <Image source={require('../../resources/img/aluraLingua.jpg')}/>
            </View>
        );
    }
}