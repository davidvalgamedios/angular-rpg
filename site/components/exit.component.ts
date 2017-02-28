import {Component, Input} from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'exit',
    template: `
        <div class="exit" 
            [style.top]="exCfg.posX*50+'px'"
            [style.left]="exCfg.posY*50+'px'"
            [ngClass]="exCfg.dir">
        </div>
    `
})
export class ExitComponent {
    @Input() exCfg:any;

    constructor(){}
}