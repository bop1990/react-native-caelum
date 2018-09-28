import React, { Component } from 'react';
import { AsyncStorage, Button, Dimensions, FlatList, StyleSheet, ScrollView } from 'react-native';
import Post from './Post';
import InstaluraFetchService from './../services/InstaluraFetchService';
import Notificacao from '../api/Notificacao';
import HeaderUsuario from './HeaderUsuario';

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
         // this.apiFetch();

        let uri = '/fotos';

        if(this.props.usuario)
            uri = `/public/fotos/${this.props.usuario}`;

        InstaluraFetchService.get('/fotos')
            .then(json => this.setState({fotos: json}))
            .catch(e => Notificacao.exibe('','Opsss... algo deu errado'));
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

        InstaluraFetchService.post(`/fotos/${idFoto}/like`);
            

    }

    adicionaComentario = (idFoto, valorComentario, inputComentario) =>{
        if(valorComentario === '')
            return;

        const foto = this.buscaPorId(this.state.fotos, idFoto);

        InstaluraFetchService.post(`/fotos/${idFoto}/comment`, valorComentario)
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
    }

    buscaPorId(fotos, idFoto){
        return fotos.find(foto => foto.id === idFoto);
    }

    atualizaFotos(fotos, fotoAtualizada){
        return fotos.map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada: foto);
    }

    verPerfilUsuario = (idFoto) => {
        const foto = this.buscaPorId(this.state.fotos, idFoto);
        this.props.navigator.push({
            screen: 'Feed',
            title: foto.loginUsuario,
            backButtonTitle: '',
            passProps:{
                usuario: foto.loginUsuario,
                fotoDePerfil: foto.urlPerfil,
                posts: this.state.fotos.length
            }
        })
    }

    exibeHeader(){
        if(this.props.usuario)
            return <HeaderUsuario {...this.props} />;
    }

    render(){

        return(
            <ScrollView>
                <Button title='Logout'
                    onPress={()=> {
                        AsyncStorage.removeItem('token');
                        AsyncStorage.removeItem('usuario');
                        this.props.navigator.resetTo({
                            screen: 'Login',
                            title: 'Login'
                        });
                    }}
                />
                <Button title='Modal'
                    onPress={()=> {
                        this.props.navigator.showModal({
                            screen: 'AluraLingua',
                            title: 'AluraLingua'
                        })
                    }}
                />
                {this.exibeHeader()}
                <FlatList style={styles.container}
                    keyExtractor={item => String(item.id)}
                    data={this.state.fotos}
                    renderItem={ ({item}) => 
                    <Post foto={item} likeCallback={this.like}
                        comentarioCallback={this.adicionaComentario}
                        verPerfilCallback={this.verPerfilUsuario}
                    />
                    }
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20
    },
});