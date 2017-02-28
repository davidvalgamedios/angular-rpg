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
        this.socketService.getOnInitPlayers().subscribe(
            res => {
                for(let playerId in res['list']){
                    let oPlayerData = res['list'][playerId];
                    let oGuest = new Player(playerId,oPlayerData.color,'', null);
                    oGuest.setDir(oPlayerData.pos.x, oPlayerData.pos.y, oPlayerData.pos.dir);

                    this.guestsList.push(oGuest);
                    this.guestsIds[playerId] = oGuest;
                }
                //this.ownPlayer = new Player('me', res['yourColor'], '', this.socketService);
            }
        );
        //Player movements
        this.socketService.getPlayersMoves().subscribe(
            msg => {
                this.guestsIds[msg['id']].setDir(msg['pos'].x, msg['pos'].y, msg['pos'].dir)
            }
        );
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
    }

    getGuestPlayers(){
        return this.guestsList;
    }
}