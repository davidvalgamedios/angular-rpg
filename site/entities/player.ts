import {SocketService} from "../services/socket.service";
export class Player{
    private uuid:string;
    private posX:number = 0;
    private posY:number = 0;
    private terrain:string;
    private dir:string = 's';
    private isMoving:boolean = false;
    private color:string;


    constructor(uuid:string, color:string, terrain:string, private socketService:SocketService){
        this.uuid = uuid;
        this.color = color;
        this.terrain = terrain;
    }

    //Getters
    getX():string{
        return this.posX*50+'px';
    }
    getY():string{
        return this.posY*50+'px';
    }
    getDir():string{
        return this.dir;
    }
    getColor():string{
        return this.color;
    }
    getId():string{
        return this.uuid;
    }

    move(dir:string):void{
        if(!this.isMoving && this.canGo(dir)){
            this.dir = dir;
            if(dir == 'w'){
                this.posX--;
            }
            else if(dir == 's'){
                this.posX++;
            }
            else if(dir == 'a'){
                this.posY--;
            }
            else if(dir == 'd'){
                this.posY++;
            }
            this.isMoving = true;
            if(this.socketService != null){
                this.socketService.send('moved', {x: this.posX, y: this.posY, dir: dir});
            }

            setTimeout(() => {
                this.isMoving = false;
            }, 250)
        }
    }

    setDir(x:number, y:number, dir:string):void{
        this.posX = x;
        this.posY = y;
        this.dir = dir;
    }


    //private
    canGo(dir:string):boolean{
        if(dir == 'w'){
            return this.posX>0;
        }
        else if(dir == 's'){
            return this.posX<9;
        }
        else if(dir == 'a'){
            return this.posY>0;
        }
        else if(dir == 'd'){
            return this.posY<9;
        }
        else return false;
    }
}