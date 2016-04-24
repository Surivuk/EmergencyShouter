//HTTP Express Server
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);

var io = require('socket.io')(http);

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(__dirname + '/public'));

var db = new sqlite3.Database('users');

var secret_key = '1456314041';
var cookie_name = 'Nody';

// [client: operator]
var clientQue = [];

function isInsideClient(client){
    var inside = false;
    for (i = 0; i < clientQue.length; i++){
        if(clientQue[i][0] == client){
            inside = true;
            break;
        }
    }
    return inside;
};

function isInsideOperator(operator){
    var inside = false;
    for (i = 0; i < clientQue.length; i++){
        if(clientQue[i][1] == operator){
            inside = true;
            break;
        }
    }
    return inside;
};

function getOperator(client){
    var ret = undefined;
    for (i = 0; i < clientQue.length; i++){
        if(clientQue[i][0] == client){
            ret = clientQue[i][1];
            break;
        }
    }
    return ret;
};

function getClient(operator){
    var ret = undefined;
    for (i = 0; i < clientQue.length; i++){
        if(clientQue[i][1] == operator){
            ret = clientQue[i][0];
            break;
        }
    }
    return ret;
};

function toJsonMsg(type, fromID, toID, content){
    var ret = '{ "type":"' + type + '", ' +
              '"from":"' + fromID + '", ' +
              '"to":"' + toID + '",' +
              '"content":"' + content + '" }';
    return ret;
};

var login_core = function(req, res, username, password){
    return new Promise(function(resolve, reject) {

        var calDU = function (err, result) {
            if(result.count !== undefined){
                if(result.count === 1){
                    resolve({username: username, type: result.type});
                }
                else{
                    reject('bad username or password');
                }
                if(err !== null){
                    reject('bad username or password');
                }
            }
        };
    
        if (username != undefined && password != undefined){
            var sql = "SELECT COUNT(*) AS count, USER_TYPE AS type FROM Users WHERE USERNAME = ? AND PASSWORD = ?";
            db.get(sql, [username, password],  calDU);
        }
        else{
            reject('bad username or password');
        }
    });
};

function enc(input){
    var cipher = crypto.createCipher('aes192', secret_key);
    var encrypted = cipher.update(input, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

function dec(input){
    var decipher = crypto.createDecipher('aes192', secret_key);

    var encrypted = input;
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// GET REQUESTS
app.get('/', function (req, res){
    if(req.cookies.Nody != undefined){
        res.sendFile(path.join(__dirname + '/dashboard.html'));
        console.log("'/', GET request, NO cookie -> dashboard");
    }
    else{
        res.sendFile(path.join(__dirname + '/log_in.html'));
        console.log("'/', GET request, YES cookie -> log_in");
    }
});
app.get('/statistics', function (req, res){
    if(req.cookies != undefined){
        res.sendFile(path.join(__dirname + '/statistics.html'));
        console.log("'/statistics', GET request, NO cookie -> dashboard");
    }
    else{
        res.sendFile(path.join(__dirname + '/'));
        console.log("'/statistics', GET request, NO cookie -> log_in");
    }
});
app.get('/cookie', function (req, res){
    var id = req.query.id;

    var decVal = dec(id);
    console.log(decVal);
    if( decVal != ""){
        res.cookie('Nody', id);
        console.log('CREATED COOKIE');
        res.redirect('/');
    }
    else{
        console.log('WRONG ID');
        res.send('404 Not Found');
    }
});
app.get('/logout', function (req, res){
    res.clearCookie(cookie_name);
    console.log("DELETE COOKIE");
    res.redirect('/');
});
app.get('/test', function (req, res){
    clientQue.push(['Surivuk', 'c1']);
    clientQue.push(['Darko', 'c2']);
    console.log(clientQue);
    console.log(clientQue[0][0]);
});

// POST REQUESTS
app.post('/login', function (req, res){
    var username = req.body.username;
    var password = req.body.password;
    login_core(req, res, username, password).then(function(response) {
        var username = response.username;
        var type = response.type;
        if(type === "O"){
            console.log("Uso u deo za O");
            var enc_username = enc(username);
            res.redirect('/cookie?id=' + enc_username);
        }
        else{
            console.error("WRONG USER!");  
            res.redirect('/?id=error'); 
        }
    }, function(error) {
        console.error("Failed!", error);  
        res.redirect('/?id=error');     
    });
});
app.post('/distress', function(req, res) {
    console.log(req.body);
    var response = { server: 'Heroku', message: 'Distress call recieved.' };
    res.send(response);
    console.log("Post on /distress response sent.");
});


// WEB SOCKETS
io.on('connection', function(socket){

    // operator salje poruku klientu preko servera
    socket.on('operator_event', function (data) {
        var operator = data.from;
        var client = getClient(operator);
        console.log('Operator (' + operator + ') message: ' + data.content + '/n Poruka za: ' + client);
        if(isInsideOperator(operator)){
            if(isInsideClient(client)){
                if(getClient(operator) == client){
                    io.emit( client + '_client_event', { data: data });
                }
            }
        }
        else{
            // poruka je namenjena radniku
        }
    });

    // klijent salje poruku ili se prvi put prijavio
    socket.on('client_event', function (data) {
        console.log(data);
        var client = data.from;
        console.log('Client (' + client + ') message: ' + data.content);
        
        if(isInsideClient(client)){
            // emituj poruku odgovarajucem operateru
            console.log('Poslao operatoru');
            console.log(getOperator(client));
            io.emit( getOperator(client) + '_operator_event', { data: data });
        }
        else{
            // pokazi svim operaterima da imaju novog klienta
            io.emit('new_client_event', { client: client });
        }
    });

    // kad operater prihvati da obradjuje klijenta
    socket.on('accept_client_event', function (data) {
        console.log('Kl: ' + data.client + ", Op: " + data.operator);
        clientQue.push([data.client, data.operator]);
        io.emit( data.operator + '_operator_event', { connection: 'successful' });
        io.emit( data.client + '_client_event', { connection: 'successful' });
    });

    // radnici salju poruke
    socket.on('worker_event', function (data) {
         console.log('SERVER READ: ' + data);
    });

    // radnici se prijavio, doso na poso
    socket.on('worker_connection_event', function (data) {
         console.log('SERVER READ: ' + data);
    });

    // login event za pristup korisnika sa mobilnih uredjaja
    socket.on('login_event', function (data) {
        var username = data.username;
        var password = data.password;

        login_core(req, res, username, password).then(function(response) {
            // successful login
            var type = response.type;
            if(type == "C"){
                // client
                io.emit( 'login_event_listener', { connection: 'successful', type: 'C' });
            }

            if(type == "W"){
                // worker
                io.emit( 'login_event_listener', { connection: 'successful', type: 'W' });
            }
        }, function(error) {
           // error
           io.emit( 'login_event_listener', { connection: 'failed' });
        });
    });

    socket.on('logout_event', function (data) {
    });

});



http.listen(process.env.PORT || 8081, function(){
  console.log('HTTP server RUN');
});



/*var server = app.listen(process.env.PORT || 8081, function() {

    var host = 'localhost'; //server.address().address;
    var port = process.env.PORT; //server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);

});*/

//WebSocket Server
