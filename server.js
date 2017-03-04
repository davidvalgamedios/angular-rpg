const express  = require('express');
const app      = express();
const port = (process.env.PORT || 5000);
const http = require('http');
const bodyParser   = require('body-parser');
const env = process.argv[2]=='-prod'?'prod':'dev';
const compression = require('compression');

var server = http.createServer(app);

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/Boilerplate');

var io = require('socket.io').listen(server);


if(env == 'prod'){
    app.use(compression());
}
else{
    app.use("/node_modules", express.static(__dirname + '/node_modules'));
}

// routes ======================================================================
app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/dist'));
app.use(bodyParser()); // get information from html forms

app.use("/build", express.static(__dirname + '/build'));


app.get(['/', '/room/*'], function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});


let oRooms = {};
/*
    main: {
        players: {}
    }
*/

//let oPlayers = {};
/*
{
    id: '550e8400-e29b-41d4-a716-446655440000'
    color: 'green',
    pos: {
        x: 1,
        y: 2,
        dir: 's'
    },
    room: 'dungeon',
    skt: Socket()
}

*/
let oPlayersSockets = {};

let colorList = ['green', 'red', 'blue', 'yellow', 'purple'];
function getColor(){
    let index = Math.floor(Math.random()* 6);

    return colorList[index];
}

io.on('connection', function (socket) {
    let myUuid = null;
    let actualRoom = null;
    let playerData = null;

    socket.on('identify-me', function(data){
        myUuid = data.myId;
        actualRoom = getRoomData(actualRoom);

        playerData = {
            id: myUuid,
            color: getColor(),
            pos: {
                x: 0,
                y: 0,
                dir: 's'
            }
        };

        for(let sPlayerId in actualRoom.players){
            oPlayersSockets[sPlayerId].emit('player-joined', playerData);
        }

        socket.emit('current-players', {list: actualRoom.players});
        socket.emit('own-player-info', {yourColor: playerData.color});

        actualRoom.players[myUuid] = playerData;
        oPlayersSockets[myUuid] = socket;
    });

    socket.on('disconnect', function(){
        if(actualRoom){
            delete(actualRoom.players[myUuid]);
        }
        delete(oPlayersSockets[myUuid]);

        for(let sPlayerId in oPlayersSockets){
            oPlayersSockets[sPlayerId].emit('player-disconnect', myUuid);
        }
    });

    socket.on('moved', function(pos){
        if(actualRoom.players.hasOwnProperty(myUuid)){
            actualRoom.players[myUuid].pos = pos;
        }
        for(let sPlayerId in actualRoom.players){
            if(actualRoom.players[sPlayerId].id != myUuid){
                oPlayersSockets[sPlayerId].emit('player-moved', {
                    id: myUuid,
                    pos: pos
                });
            }
        }
    });

    socket.on('roomChanged', function(data){
        if(actualRoom){
            delete(actualRoom.players[myUuid]);

            for(let sPlayerId in actualRoom.players){
                oPlayersSockets[sPlayerId].emit('player-leave-room', {
                    id: myUuid
                });
            }
        }
        actualRoom = getRoomData(data.id);
        for(let sPlayerId in actualRoom.players){
            oPlayersSockets[sPlayerId].emit('player-enter-room', playerData);
        }
        actualRoom.players[myUuid] = playerData;
    });
});

server.listen(port);
console.log("Listening on: "+port);



function getRoomData(sRoomId){
    if(!oRooms.hasOwnProperty(sRoomId)){
        oRooms[sRoomId] = {
            players: {}
        }
    }
    return oRooms[sRoomId];
}