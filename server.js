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


app.get('/', function(req, res) {
    res.render('index.ejs', {
        env: env
    });
});


/*
{
    id: '550e8400-e29b-41d4-a716-446655440000'
    color: 'green',
    pos: {
        x: 1,
        y: 2,
        dir: 's'
    },
    skt: Socket()
}

*/
let oPlayers = {};
let oPlayersSockets = {};

let colorList = ['green', 'red', 'blue', 'yellow', 'purple'];
function getColor(){
    let remaining = JSON.parse(JSON.stringify(colorList));

    for(let sPlayerId in oPlayers){
        let nIndex = remaining.indexOf(oPlayers[sPlayerId].color);
        if(nIndex != -1){
            remaining.splice(nIndex, 1);
        }
    }

    if(remaining.length > 0){
        return remaining[0];
    }
    return '';
}

io.on('connection', function (socket) {
    let myUuid = null;

    socket.on('identify-me', function(playerUuid){
        myUuid = playerUuid;

        let oNewPlayerData = {
            id: myUuid,
            color: getColor(),
            pos: {
                x: 0,
                y: 0,
                dir: 's'
            }
        };

        for(let sPlayerId in oPlayers){
            oPlayersSockets[sPlayerId].emit('player-joined', oNewPlayerData);
        }

        socket.emit('current-players', {list: oPlayers, yourColor: oNewPlayerData.color});

        oPlayers[myUuid] = oNewPlayerData;
        oPlayersSockets[myUuid] = socket;
    });

    socket.on('disconnect', function(){
        delete(oPlayers[myUuid]);
        delete(oPlayersSockets[myUuid]);

        for(let sPlayerId in oPlayersSockets){
            oPlayersSockets[sPlayerId].emit('player-disconnect', myUuid);
        }
    });

    socket.on('moved', function(pos){
        for(let sPlayerId in oPlayers){
            if(oPlayers[sPlayerId].id != myUuid){
                oPlayersSockets[sPlayerId].emit('player-moved', {
                    id: myUuid,
                    pos: pos
                });
            }
            /*else{
                oPlayers[sPlayerId].pos = pos;
            }*/
        }
    });

    /*setTimeout(() => {
        socket.emit('player-moved', 'HOLA');
    }, 1000);*/
});

server.listen(port);
console.log("Listening on: "+port);