import { Component } from '@angular/core';
import {Player} from "../entities/player";
import {SocketService} from "../services/socket.service";

@Component({
    selector: 'player',
    template: `
        <div class="player" (window:keydown)="move($event)"
            [style.top]="player.getX()"
            [style.left]="player.getY()"
            [ngClass]="player.getDir()"></div>
    `
})
export class PlayerComponent {
    private player:Player;

    constructor(private socketService:SocketService){
        this.player = new Player('', '', socketService);
    }

    move(event){
        if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
            this.player.move(event.key);
        }
    }
}