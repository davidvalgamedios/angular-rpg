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
    private playersMovesObs:Observable<string>;
    private newPlayersObs:Observable<string>;
    private disconnectPlayerObs:Observable<string>;
    private onInitPlayersObs:Observable<string>;
    private ownPlayerInfoObs:Observable<string>;
    //Observables

    private socket:any;


    constructor(){
        console.info("CONSTRUCT SOCKET SERVICE");
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

        this.onInitPlayersObs = new Observable((observer:any) => {
            this.socket.on('current-players', (list:any) => {
                observer.next(list);
                observer.complete();
            });
        });

        this.ownPlayerInfoObs = new Observable((observer:any) => {
            this.socket.on('own-player-info', (list:any) => {
                observer.next(list);
                observer.complete();
            });
        });

        this.playersMovesObs = new Observable((observer:any) => {
           this.socket.on('player-moved', (data:any) => {
               observer.next(data);
           });
        });
        this.newPlayersObs = new Observable((observer:any) => {
            this.socket.on('player-joined', (data:any) => {
                observer.next(data);
            });
        });
        this.disconnectPlayerObs = new Observable((observer:any) => {
            this.socket.on('player-disconnect', (data:any) => {
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
    getOwnPlayerInfo(){
        return this.ownPlayerInfoObs;
    }

    send(action:string, msg:any){
        this.socket.emit(action, msg);
    }

}