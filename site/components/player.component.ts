import {Component, Input} from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'player',
    template: `
        <div class="player" 
        (window:keydown)="isKeyPress($event)"
        (window:keyup)="isKeyDown()"
            [style.top]="player.getX()"
            [style.left]="player.getY()"
            [ngClass]="[player.getDir(), player.getColor()]"></div>
    `
})
export class PlayerComponent {
    @Input() player:Player;
    private intervalObj:any|null = null;
    private movingDir:string|null;

    constructor(){}

    isKeyPress(event:any){
        if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
            if(event.key != this.movingDir){
                this.isKeyDown();
                this.movingDir = event.key;
            }
            if(!this.intervalObj){
                this.sendMovement();
                this.intervalObj = setInterval(() => {this.sendMovement()}, 25);
            }
        }
    }

    isKeyDown(){
        this.movingDir = null;
        clearInterval(this.intervalObj);
        this.intervalObj = null;
    }

    sendMovement(){
        this.player.move(this.movingDir);
    }
}