import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TerrainsService {
    private terrains:any = {
        main: {
            sizeW: 9,
            sizeH: 9,
            background: 'grass.jpg',
            exits: [
                {
                    dir: 'u',
                    posX: 0,
                    posY: 4,
                    goTo: 'dungeon'
                },
                {
                    dir: 'r',
                    posX: 4,
                    posY: 9,
                    goTo: 'dungeon2'
                }
            ]
        }
    };

    constructor(){
    }

    getTerrain(terrainId:string){
        if(this.terrains.hasOwnProperty(terrainId)){
            return this.terrains[terrainId];
        }
        else{
            console.info("Terrain not found");
            return this.terrains.main;
        }
    }
}