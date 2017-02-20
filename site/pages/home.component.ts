import { Component } from '@angular/core';
import {SocketService} from "../services/socket.service";
import {Player} from "../entities/player";

@Component({
    selector: 'home',
    template: `
        <div class="terrain">
            <player></player>
            <guest-player *ngFor="let oPlayer of guestsList" [player]="oPlayer"></guest-player>
        </div>
    `
})
export class HomeComponent {
    private guestsList:Player[] = [];
    private guestsIds = {};

    constructor(private socketService:SocketService){
        this.socketService.getPlayersMoves().subscribe(
            msg => {
                this.guestsIds[msg.id].setDir(msg.pos.x, msg.pos.y, msg.pos.dir)
            }
        );
        this.socketService.getPlayersJoined().subscribe(
            msg => {
                let oGuest = new Player('red', '', null);
                this.guestsList.push(oGuest);
                this.guestsIds[msg] = oGuest;
            }
        );
        this.socketService.getPlayersDisconected().subscribe(
            msg => {
                this.guestsList = [];
                delete(this.guestsIds[msg]);
            }
        );
        this.socketService.getOnInitPlayers().subscribe(
            list => {
                for(let sId of list){
                    let oGuest = new Player('red', '', null);
                    this.guestsList.push(oGuest);
                    this.guestsIds[sId] = oGuest;
                }
            }
        );
    }

}