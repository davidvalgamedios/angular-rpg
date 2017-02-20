import { Component } from '@angular/core';

@Component({
    selector: 'home',
    template: `
        <div class="terrain">
            <player></player>
        </div>
    `
})
export class HomeComponent {

    constructor(){
    }

}