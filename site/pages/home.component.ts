import { Component } from '@angular/core';
import {SocketService} from "../services/socket.service";
import {Player} from "../entities/player";

@Component({
    selector: 'home',
    template: `
        <div class="terrain">
            <player *ngIf="ownPlayer" [player]="ownPlayer"></player>
            <guest-player *ngFor="let oPlayer of guestsList" [player]="oPlayer"></guest-player>
        </div>
    `
})
export class HomeComponent{
    private ownPlayer:Player;
    private guestsList:Player[] = [];
    private guestsIds = {};

    constructor(private socketService:SocketService){
        //Player list received
        this.socketService.getOnInitPlayers().subscribe(
            res => {
                for(let playerId in res.list){
                    let oPlayerData = res.list[playerId];
                    let oGuest = new Player(playerId,oPlayerData.color,'', null);
                    oGuest.setDir(oPlayerData.pos.x, oPlayerData.pos.y, oPlayerData.pos.dir);

                    this.guestsList.push(oGuest);
                    this.guestsIds[playerId] = oGuest;
                }
                this.ownPlayer = new Player('me', res['yourColor'], '', this.socketService);
            }
        );
        //Player movements
        this.socketService.getPlayersMoves().subscribe(
            msg => {
                this.guestsIds[msg.id].setDir(msg.pos.x, msg.pos.y, msg.pos.dir)
            }
        );
        //New Player Joined
        this.socketService.getPlayersJoined().subscribe(
            newPlayer => {
                let oGuest = new Player(newPlayer.id, newPlayer.color, '', null);
                oGuest.setDir(newPlayer.pos.x, newPlayer.pos.y, newPlayer.pos.dir);

                this.guestsList.push(oGuest);
                this.guestsIds[newPlayer.id] = oGuest;
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
}