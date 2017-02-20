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
    private colors = ['red', 'blue', 'yellow', 'purple'];

    constructor(private socketService:SocketService){
        this.socketService.getPlayersMoves().subscribe(
            msg => {
                this.guestsIds[msg.id].setDir(msg.pos.x, msg.pos.y, msg.pos.dir)
            }
        );
        this.socketService.getPlayersJoined().subscribe(
            msg => {
                let oGuest = new Player(this.getColor(), '', null);
                this.guestsList.push(oGuest);
                this.guestsIds[msg] = oGuest;
            }
        );
        this.socketService.getPlayersDisconected().subscribe(
            msg => {
                this.guestsList = []; // TODO: Change to delete only one. Need to store ID
                delete(this.guestsIds[msg]);
            }
        );
        this.socketService.getOnInitPlayers().subscribe(
            list => {
                for(let sId of list){
                    let oGuest = new Player(this.getColor(), '', null);
                    this.guestsList.push(oGuest);
                    this.guestsIds[sId] = oGuest;
                }
            }
        );
    }


    private getColor(){
        return this.colors[(this.guestsList.length)];
    }
}