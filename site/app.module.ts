import { NgModule }         from '@angular/core';
import { BrowserModule }    from '@angular/platform-browser';
//import { HttpModule }       from '@angular/http';
import { RouterModule }     from '@angular/router';

import { AppComponent }     from './pages/app.component';
import {HomeComponent} from "./pages/home.component";
import {PlayerComponent} from "./components/player.component";
import {SocketService} from "./services/socket.service";


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
    declarations: [ AppComponent, HomeComponent, PlayerComponent],
    bootstrap:    [ AppComponent ],
    providers: [SocketService]
})
export class AppModule {}