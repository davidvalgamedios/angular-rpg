export class Player{
    private posX:number = 3;
    private posY:number = 5;
    private terrain;
    private dir = 'd';
    private isMoving = false;


    constructor(terrain){
        this.terrain = terrain;
    }

    //Getters
    getX(){
        return this.posX*50+'px';
    }
    getY(){
        return this.posY*50+'px';
    }

    move(dir){
        if(!this.isMoving && this.canGo(dir)){
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

            setTimeout(() => {
                this.isMoving = false;
            }, 250)
        }
    }


    //private
    canGo(dir){
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