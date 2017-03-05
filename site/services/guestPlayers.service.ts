import { Injectable } from '@angular/core';
import { Player } from "../entities/player";
import 'rxjs/add/operator/toPromise';
import { SocketService } from "./socket.service";


@Injectable()
export class GuestPlayersService {
    private guestsList:Player[] = [];
    private guestsIds = {};

    constructor(private socketService:SocketService){
        console.info("CONSTRUCT GUEST PLAYERS SERVICE");
        //Player list received

        this.socketService.getGuestChanges().subscribe(res => {
            this.parseGuestChange(res.action, res.data);
        });

        /*
        //New Player Joined
        this.socketService.getPlayersJoined().subscribe(
            newPlayer => {
                let oGuest = new Player(newPlayer['id'], newPlayer['color'], '', null);
                oGuest.setDir(newPlayer['pos'].x, newPlayer['pos'].y, newPlayer['pos'].dir);

                this.guestsList.push(oGuest);
                this.guestsIds[newPlayer['id']] = oGuest;
            }
        );
        //Player disconnected
        this.socketService.getPlayersDisconected().subscribe(
            uuid => {
                for(let i=0;i<this.guestsList.length;i++){
                    if(this.guestsList[i].getId() == uuid){
                        this.guestsList.splice(i, 1);
                        break;
                    }
                }
                delete(this.guestsIds[uuid]);
            }
        );
        this.socketService.getPlayerEnter().subscribe(newPlayer => {
            let oGuest = new Player(newPlayer['id'], newPlayer['color'], '', null);
            oGuest.setDir(newPlayer['pos'].x, newPlayer['pos'].y, newPlayer['pos'].dir);

            this.guestsList.push(oGuest);
            this.guestsIds[newPlayer['id']] = oGuest;
        });
        this.socketService.getPlayerLeave().subscribe(res => {
            for(let i=0;i<this.guestsList.length;i++){
                if(this.guestsList[i].getId() == res.id){
                    this.guestsList.splice(i, 1);
                    break;
                }
            }
            delete(this.guestsIds[res.id]);
        });*/
    }

    getGuestPlayers(){
        return this.guestsList;
    }

    changingRoom(){
        for(let sGuestId in this.guestsIds){
            delete(this.guestsIds[sGuestId]);
        }
        this.guestsList.length = 0;
    }

    parseGuestChange(action:string,data:any){
        if(action == 'current-players'){
            this.addFirstUsers(data.list);
        }
        else if(action == 'moved'){
            this.movePlayer(data.id, data.pos);
        }
        else if(action == 'joined'){
            let oPlayer = new Player(data.id, data.color, '', null);
            oPlayer.setDir(data.pos.x, data.pos.y, data.pos.dir);
            this.addPlayer(oPlayer);
        }
        else if(action == 'disconnect'){
            this.removePlayer(data);
        }
        else if(action == 'leave-room'){
            this.removePlayer(data.id);
        }
        else if(action == 'enter-room'){
            let oPlayer = new Player(data.id, data.color, '', null);
            oPlayer.setDir(data.pos.x, data.pos.y, data.pos.dir);
            this.addPlayer(oPlayer);
        }
    }



    private addFirstUsers(guestList){
        for(let playerId in guestList){
            let oPlayerData = guestList[playerId];
            let oGuest = new Player(playerId,oPlayerData.color,'', null);
            oGuest.setDir(oPlayerData.pos.x, oPlayerData.pos.y, oPlayerData.pos.dir);

            this.guestsList.push(oGuest);
            this.guestsIds[playerId] = oGuest;
        }
    }

    private movePlayer(id, pos){
        if(this.guestsIds.hasOwnProperty(id)){
            this.guestsIds[id].setDir(pos.x, pos.y, pos.dir)
        }
        else{
            console.error('Trying to move non existant player');
        }
    }

    private addPlayer(guest:Player){
        this.guestsList.push(guest);
        this.guestsIds[guest.getId()] = guest;
    }

    private removePlayer(uuid:string){
        for(let i=0;i<this.guestsList.length;i++){
            if(this.guestsList[i].getId() == uuid){
                this.guestsList.splice(i, 1);
                break;
            }
        }
        if(this.guestsIds.hasOwnProperty(uuid)){
            delete(this.guestsIds[uuid]);
        }
        else{
            console.error('Trying to remove non existant player');
        }
    }
}