import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class TerrainsService {
    private terrains:any = {
        main: {
            sizeW: 10,
            sizeH: 10,
            background: 'grass.jpg',
            exits: [
                {
                    posX: 0,
                    posY: 4,
                    dest: 'dungeon'
                },
                {
                    posX: 4,
                    posY: 9,
                    dest: 'dungeon2'
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