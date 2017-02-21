import { Component, Input } from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'guest-player',
    template: `
        <div class="player"
            [style.top]="player.getX()"
            [style.left]="player.getY()"
            [ngClass]="[player.getDir(), player.getColor()]"></div>
    `
})
export class GuestPlayerComponent {
    @Input() player:Player;

    constructor(){}
}