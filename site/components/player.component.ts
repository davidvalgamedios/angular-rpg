import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Player } from "../entities/player";

@Component({
    selector: 'player',
    template: `
        <div class="player" 
        (window:keydown)="isKeyPress($event)"
        (window:keyup)="setKeyUp()"
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
    @Output() playerActions: EventEmitter<any> = new EventEmitter<any>();

    private intervalObj:any|null = null;
    private isMoving:boolean = false;
    private movingDir:string|null;

    private isAttacking:boolean;
    private swingSword:boolean;

    constructor(){}

    isKeyPress(event:any){
        if(!this.isMoving || event.key != this.movingDir){
            if(event.key == 'w' || event.key == 'a' || event.key == 's' || event.key == 'd'){
                if(event.key != this.movingDir){
                    this.movingDir = event.key;
                }
                if(this.intervalObj === null){
                    this.sendMovement();
                    this.intervalObj = setInterval(() => {this.sendMovement()}, 250);
                }
                this.isMoving = true;
            }
            else if(event.key === ' '){
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

    setKeyUp(){
        this.isMoving = false;
        this.movingDir = null;
        clearInterval(this.intervalObj);
        this.intervalObj = null;
    }

    sendMovement(){
        let nextX = this.player.posX+(this.movingDir=='s'?1:(this.movingDir=='w'?-1:0));
        let nextY = this.player.posY+(this.movingDir=='d'?1:(this.movingDir=='a'?-1:0));
        let roomExit = this.willBeExit(this.movingDir);
        if(roomExit != null){
            this.playerActions.emit({
                action: 'changeRoom',
                to: roomExit.goTo.id
            });
            this.player.setDir(roomExit.goTo.x, roomExit.goTo.y, roomExit.dir);
        }

        else if(this.canIGo(this.movingDir)){
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

    willBeExit(dir:string){
        console.log("test");
        for(let exit of this.terrainCfg.exits){
            if(exit.x == this.player.posX && exit.y == this.player.posY && exit.dir == dir){
                return exit;
            }
        }
        return null;
    }
}