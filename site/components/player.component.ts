import {Component, Input} from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'player',
    template: `
        <div class="player" (window:keydown)="move($event)"
            [style.top]="player.getX()"
            [style.left]="player.getY()"
            [ngClass]="[player.getDir(), player.getColor()]"></div>
    `
})
export class PlayerComponent {
    @Input() player:Player;

    constructor(){}

    move(event){
        if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
            this.player.move(event.key);
        }
    }
}