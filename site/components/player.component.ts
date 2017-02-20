import { Component } from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'player',
    template: `
        <div class="player" (window:keydown)="move($event)"
            [style.top]="player.getX()"
            [style.left]="player.getY()"></div>
    `
})
export class PlayerComponent {
    private player:Player;

    constructor(){
        this.player = new Player("asd");
    }

    move(event){
        if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
            this.player.move(event.key);
        }
    }
}