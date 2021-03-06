import { AsyncStorage } from 'react-native';

const uri = 'https://instalura-api.herokuapp.com/api';

export default class InstaluraFetchService{

    static get(recurso){
        const url = uri + recurso;

        return AsyncStorage.getItem('token')
            .then(token => {
                return{
                    headers: new Headers({
                        'X-AUTH-TOKEN': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(resposta => {
                if(resposta.ok)
                    return resposta.json();
                
                throw new Error('erro ao carregar a pagina.');
            });
            
    }

    static post(recurso, dados){
        const url = uri + recurso;

        return AsyncStorage.getItem('token')
            .then(token => {
                return{
                    method: 'POST',
                    body: JSON.stringify({
                        texto: dados
                    }),
                    headers: new Headers({
                        'Content-type': 'application/json',
                        'X-AUTH-TOKEN': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(resposta => resposta.json());
    }


    // static makeRequest(recurso, method='GET', dados){
    //     const url = uri + recurso;
        
    //     if(dados === '')
    //         dados={};

    //     AsyncStorage.getItem('token')
    //         .then(token => {
    //             return{
    //                 method: method,
    //                 body: JSON.stringify({
    //                     texto: dados
    //                 }),
    //                 headers: new Headers({
    //                     'Content-type': 'application/json',
    //                     'X-AUTH-TOKEN': token
    //                 })
    //             }
    //         })
    //         .then(requestInfo => fetch(url, requestInfo))
    //         .then(resposta => resposta.json()); 

    // }

}