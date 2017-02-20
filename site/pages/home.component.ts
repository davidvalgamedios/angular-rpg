import { Component } from '@angular/core';
import {SocketService} from "../services/socket.service";

@Component({
    selector: 'home',
    template: `
        <div class="terrain">
            <player></player>
        </div>
    `
})
export class HomeComponent {

    constructor(private socket:SocketService){
    }

}