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
                    x: 0,
                    y: 4,
                    goTo: 'dungeon'
                },
                {
                    dir: 'r',
                    x: 4,
                    y: 9,
                    goTo: 'dungeon2'
                }
            ]
        }
    };

    constructor(){
        console.info("CONSTRUCT TERRAIN SERVICE");
    }

    getTerrain(terrainId:string){
        if(this.terrains.hasOwnProperty(terrainId)){
            return this.terrains[terrainId];
        }
        else{
            //console.info("Terrain not found");
            return this.terrains.main;
        }
    }
}