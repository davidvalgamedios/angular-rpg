import {Component, Input} from '@angular/core';
import {Player} from "../entities/player";

@Component({
    selector: 'exit',
    template: `
        <div class="exit" 
            [style.top]="exCfg.x*50+'px'"
            [style.left]="exCfg.y*50+'px'"
            [ngClass]="exCfg.dir">
        </div>
    `
})
export class ExitComponent {
    @Input() exCfg:any;

    constructor(){}
}