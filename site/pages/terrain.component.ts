import { Component, OnInit } from '@angular/core';
import { Player } from "../entities/player";
import { ActivatedRoute, Params }   from '@angular/router';
import { TerrainsService } from "../services/terrains.service";
import { GuestPlayersService } from "../services/guestPlayers.service";
import { SocketService } from "../services/socket.service";

@Component({
    selector: 'home',
    template: `
        <div class="referencePoint" *ngIf="ownPlayer !== null">
            <div class="terrain"
                [style.background-image]="'url(/dist/img/backgrounds/'+terrainConfig.background+')'"
                [style.width]="(terrainConfig.sizeW+1)*50+'px'"
                [style.height]="(terrainConfig.sizeH+1)*50+'px'"
                [style.bottom]="ownPlayer.getX()"
                [style.right]="ownPlayer.getY()">
                <exit *ngFor="let oExit of terrainConfig.exits"
                    [exCfg]="oExit"
                ></exit>
                <guest-player *ngFor="let oPlayer of guestsList" [player]="oPlayer"></guest-player>
            </div>
            <player (playerActions)="parseAction($event)" *ngIf="ownPlayer" [player]="ownPlayer" [terrainCfg]="terrainConfig"></player>
        </div>
    `
})
export class TerrainComponent implements OnInit{
    ownPlayer:Player = null;
    guestsList:Player[] = [];

    terrainConfig:any;

    constructor(private route: ActivatedRoute,
                private terrainService:TerrainsService,
                private guestPlayersService:GuestPlayersService,
                private socketService:SocketService){
        this.guestsList = guestPlayersService.getGuestPlayers();

        this.socketService.getOwnPlayerInfo().subscribe(
            res => {
                this.ownPlayer = new Player('me', res['yourColor'], '', this.socketService);
            }
        );
    }

    ngOnInit(): void{
        this.route.params.forEach((params: Params) => {
            let terrainId = params['terrainId'];
            this.terrainConfig = this.terrainService.getTerrain(terrainId);
        });
    }

    parseAction(action:any){
        this.terrainConfig = this.terrainService.getTerrain(action.to);
    }
}