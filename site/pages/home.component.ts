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
    private playersMovesObs;
    private newPlayersObs;
    private disconnectPlayerObs;

    private guestsList:Player[] = [];
    private guestsIds = {};

    constructor(private socketService:SocketService){
        this.playersMovesObs = this.socketService.getPlayersMoves().subscribe(
            msg => {
                this.guestsIds[msg.id].move(msg.dir)
            }
        );

        this.newPlayersObs = this.socketService.getPlayersJoined().subscribe(
            msg => {
                let oGuest = new Player('red', '');
                this.guestsList.push(oGuest);
                this.guestsIds[msg] = oGuest;
            }
        );
        this.disconnectPlayerObs = this.socketService.getPlayersDisconected().subscribe(
            msg => {
                this.guestsList = [];
                delete(this.guestsIds[msg]);
            }
        );
    }

}