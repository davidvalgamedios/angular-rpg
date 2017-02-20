import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
//import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';

import { AppComponent }     from './pages/app.component';
import {HomeComponent} from "./pages/home.component";
import {PlayerComponent} from "./components/player.component";
import {SocketService} from "./services/socket.service";
import {GuestPlayerComponent} from "./components/guest-player.component";


@NgModule({
    imports: [
        BrowserModule,
        //FormsModule,
        //HttpModule,
        RouterModule.forRoot([
            {
                path: '',
                component: HomeComponent
            }
        ])
    ],
    declarations: [ AppComponent, HomeComponent, PlayerComponent, GuestPlayerComponent],
    bootstrap:    [ AppComponent ],
    providers: [SocketService]
})
export class AppModule {}