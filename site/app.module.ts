import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';

import { AppComponent }     from './pages/app.component';
import { TerrainComponent } from "./pages/terrain.component";
import { PlayerComponent } from "./components/player.component";
import { SocketService } from "./services/socket.service";
import { GuestPlayerComponent } from "./components/guest-player.component";
import { TerrainsService } from "./services/terrains.service";
import { GuestPlayersService } from "./services/guestPlayers.service";
import { ExitComponent } from "./components/exit.component";


@NgModule({
    imports: [
        BrowserModule,
        //FormsModule,
        HttpModule,
        RouterModule.forRoot([
            {
                path: 'room/:terrainId',
                component: TerrainComponent
            },
            {
                path: '',
                component: TerrainComponent
            }
        ])
    ],
    declarations: [ AppComponent, TerrainComponent, PlayerComponent, GuestPlayerComponent, ExitComponent],
    bootstrap:    [ AppComponent ],
    providers: [ SocketService, TerrainsService, GuestPlayersService ]
})
export class AppModule {}