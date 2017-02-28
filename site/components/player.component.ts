import {Component, Input} from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'player',
    template: `
        <div class="player" 
        (window:keydown)="isKeyPress($event)"
        (window:keyup)="setKeyDown()"
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
    @Input() terrainCfg:any;

    private intervalObj:any|null = null;
    private movingDir:string|null;
    private isAttacking:boolean;
    private swingSword:boolean;

    constructor(){}

    isKeyPress(event:any){
        if(this.intervalObj == null){//With this is avoided multiple calls
            if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
                if(event.key != this.movingDir){
                    this.setKeyDown();
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
    }

    setKeyDown(){
        this.movingDir = null;
        clearInterval(this.intervalObj);
        this.intervalObj = null;
    }

    sendMovement(){
        if(!this.player.isMoving && this.canIGo(this.movingDir)){
            let nextX = this.player.posX+(this.movingDir=='s'?1:(this.movingDir=='w'?-1:0));
            let nextY = this.player.posY+(this.movingDir=='d'?1:(this.movingDir=='a'?-1:0));
            let roomExit = this.willBeExit(nextX, nextY);
            if(roomExit != null){
                console.log("EXITING");
            }
            this.player.setPlayerDir(nextX, nextY, this.movingDir);
        }
    }

    canIGo(dir:string):boolean{
        if(dir == 'w'){
            return this.player.posX>0;
        }
        else if(dir == 's'){
            return this.player.posX<this.terrainCfg.sizeH;
        }
        else if(dir == 'a'){
            return this.player.posY>0;
        }
        else if(dir == 'd'){
            return this.player.posY<this.terrainCfg.sizeW;
        }
        else return false;
    }

    willBeExit(x:number, y:number){
        for(let exit of this.terrainCfg.exits){
            if(exit.x == x && exit.y == y){
                return exit.goTo;
            }
        }
        return null;
    }
}