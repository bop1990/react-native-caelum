import React, { Component } from 'react';
import { AsyncStorage, Button, Dimensions, FlatList, StyleSheet, View } from 'react-native';
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
        const foto = this.buscaPorId(this.state.fotos, idFoto);

        AsyncStorage.getItem('usuario')
            .then(usuarioLogado => {
                let novaLista = [];

                if (!foto.likeada) {
                    novaLista = [...foto.likers,
                    { login: usuarioLogado }];
                } else {
                    novaLista = foto.likers.filter(liker => {
                        return liker.login !== usuarioLogado;
                    });
                }

                return novaLista;
            })
            .then(novaLista => {
                const fotoAtualizada = {
                    ...foto,
                    likeada: !foto.likeada,
                    likers: novaLista
                }
                
                const fotos = this.atualizaFotos(this.state.fotos, fotoAtualizada);
                this.setState({fotos});
            });

        const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;

        AsyncStorage.getItem('token')
            .then(token => {
                return{
                    method: 'POST',
                    headers: new Headers({
                        'X-AUTH-TOKEN': token
                    })
                }
            })
            .then(requestInfo => fetch(uri, requestInfo));
    }

    adicionaComentario = (idFoto, valorComentario, inputComentario) =>{
        if(valorComentario === '')
            return;

        const foto = this.buscaPorId(this.state.fotos, idFoto);

        const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/comment`;

        AsyncStorage.getItem('token')
            .then(token => {
                return{
                    method: 'POST',
                    body: JSON.stringify({
                        texto: valorComentario
                    }),
                    headers: new Headers({
                        'Content-type': 'application/json',
                        'X-AUTH-TOKEN': token
                    })
                }
            })
            .then(requestInfo => fetch(uri, requestInfo))
            .then(resposta => resposta.json())
            .then(comentario => [...foto.comentarios, comentario])
            .then(novaLista => {
                const fotoAtualizada = {
                    ...foto,
                    comentarios: novaLista,
                }

                const fotos = this.atualizaFotos(this.state.fotos, fotoAtualizada);
                this.setState({fotos});
        
                inputComentario.clear();
            })

        // const novaLista = [...foto.comentarios,{
        //     id: valorComentario,
        //     login: 'meuUsuario',
        //     texto: valorComentario
        // }];
       
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