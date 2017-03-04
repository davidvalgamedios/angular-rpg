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
                    dir: 'a',
                    x: 4,
                    y: 0,
                    goTo: {
                        id: 'dungeon',
                        x: 5,
                        y: 7
                    }
                }
            ]
        },
        dungeon: {
            sizeW: 7,
            sizeH: 7,
            background: 'dungeon.png',
            exits: [
                {
                    dir: 'd',
                    x: 5,
                    y: 7,
                    goTo: {
                        id: 'main',
                        x: 4,
                        y: 0
                    }
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