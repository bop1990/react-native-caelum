import React, { Component } from 'react';
import { AsyncStorage,Dimensions, FlatList, StyleSheet,View,Button } from 'react-native';
import Post from './Post';

const width = Dimensions.get('screen').width;

export default class Feed extends Component {

    constructor(){
        super();
        this.state = {
            fotos: [],
        }
    }

    // async apiFetch(){
    //     const resposta = await fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael');
    //     const json = await resposta.json();
    //     this.setState({fotos: json});
    // }

    componentDidMount(){
        const uri = 'https://instalura-api.herokuapp.com/api/fotos';

        AsyncStorage.getItem('token')
            .then(token => {
                return{
                    headers: new Headers({
                        'X-AUTH-TOKEN': token
                    })
                }
            })
            .then(requestInfo => fetch(uri, requestInfo))
            .then(resposta => resposta.json())
            .then(json => this.setState({fotos: json}));
        
        // this.apiFetch();
    }

    like = (idFoto) => {
        let novaLista = [];

        const foto = this.buscaPorId(this.state.fotos, idFoto);

        if (!foto.likeada) {
            novaLista = [...foto.likers,
            { login: 'meuUsuario' }];
        } else {
            novaLista = foto.likers.filter(liker => {
                return liker.login !== 'meuUsuario';
            });
        }

        const fotoAtualizada = {
            ...foto,
            likeada: !foto.likeada,
            likers: novaLista
        }
        
        const fotos = this.atualizaFotos(this.state.fotos, fotoAtualizada);
        this.setState({fotos});
    }

    adicionaComentario = (idFoto, valorComentario, inputComentario) =>{
        if(valorComentario === '')
            return;

        const foto = this.buscaPorId(this.state.fotos, idFoto);

        const novaLista = [...foto.comentarios,{
            id: valorComentario,
            login: 'meuUsuario',
            texto: valorComentario
        }];

        const fotoAtualizada = {
            ...foto,
            comentarios: novaLista,
        }

        const fotos = this.atualizaFotos(this.state.fotos, fotoAtualizada);
        this.setState({fotos});

        inputComentario.clear();
    }

    buscaPorId(fotos, idFoto){
        return fotos.find(foto => foto.id === idFoto);
    }

    atualizaFotos(fotos, fotoAtualizada){
        return fotos.map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada: foto);
    }

    render(){

        return(
            <View>
                <Button title='Modal'
                    onPress={()=> {
                        this.props.navigator.showModal({
                            screen: 'AluraLingua',
                            title: 'AluraLingua'
                        })
                    }}
                />
                <FlatList style={styles.container}
                    keyExtractor={item => String(item.id)}
                    data={this.state.fotos}
                    renderItem={ ({item}) => 
                    <Post foto={item} likeCallback={this.like}
                        comentarioCallback={this.adicionaComentario}
                    />
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20
    },
});