import * as io from 'socket.io-client';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class SocketService {
    private socketUrl = '/';
    private myUuid:string;

    //Observables
    private playersMovesObs;
    private newPlayersObs;
    private disconnectPlayerObs;
    private onInitPlayersObs;
    //Observables

    private socket;


    constructor(){
        let savedUuid = localStorage.getItem('savedUuid');
        if(savedUuid){
            this.myUuid = savedUuid;
        }
        else{
            this.myUuid = UUID.UUID();
            localStorage.setItem('savedUuid', this.myUuid);
        }

        this.socket = io(this.socketUrl);

        this.socket.emit('identify-me', this.myUuid);

        this.onInitPlayersObs = new Observable(observer => {
            this.socket.on('current-players', (list) => {
                observer.next(list);
            });
        });

        this.playersMovesObs = new Observable(observer => {
           this.socket.on('player-moved', (data) => {
               observer.next(data);
           });
        });
        this.newPlayersObs = new Observable(observer => {
            this.socket.on('player-joined', (data) => {
                observer.next(data);
            });
        });
        this.disconnectPlayerObs = new Observable(observer => {
            this.socket.on('player-disconnect', (data) => {
                observer.next(data);
            });
        })
    }

    getPlayersMoves(){
        return this.playersMovesObs;
    }
    getPlayersJoined(){
        return this.newPlayersObs;
    }
    getPlayersDisconected(){
        return this.disconnectPlayerObs;
    }
    getOnInitPlayers(){
        return this.onInitPlayersObs;
    }

    send(action:string, msg:any){
        this.socket.emit(action, msg);
    }

}