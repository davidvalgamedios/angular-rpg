import * as io from 'socket.io-client';
import { UUID } from 'angular2-uuid';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SocketService {
    private socketUrl = '/';
    private myUuid:string;

    private socket;

    constructor(){
        console.info("STARTED SERVICE");
        let savedUuid = localStorage.getItem('savedUuid');
        if(savedUuid){
            this.myUuid = savedUuid;
        }
        else{
            this.myUuid = UUID.UUID();
            localStorage.setItem('savedUuid', this.myUuid);
        }

        this.socket = io(this.socketUrl);
    }

    send(action:string, msg:string){
        this.socket.emit(action, {
            id: this.myUuid,
            msg: msg
        });
    }

}