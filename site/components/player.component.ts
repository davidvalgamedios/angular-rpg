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
            [ngClass]="[player.getDir(), player.getColor()]">
            <div class="swordC" [ngClass]="{'atk':isAttacking,'swing':swingSword}">
                <div></div>
            </div>    
        </div>
    `
})
export class PlayerComponent {
    @Input() player:Player;
    private intervalObj:any|null = null;
    private movingDir:string|null;

    private isAttacking:boolean;
    private swingSword:boolean;

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

        if(event.key === ' '){
            this.isAttacking = true;
            setTimeout(()=>{this.isAttacking=false}, 225);
            setTimeout(()=>{
                this.swingSword = true;
                setTimeout(()=>{this.swingSword = false;}, 225);
            }, 10);
            this.player.attack();
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