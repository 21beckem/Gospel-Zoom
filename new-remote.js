const path = require('path'),
    screenshot = require('screenshot-desktop'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    ip = require('ip');

var currentSocket = null;

var gethandshake = () => {};
var launchZoom = () => {};
var toggleAV = () => {};
var endMeeting = () => {};
var remoteConnected = () => {};

class IO_REMOTE {
    constructor(port) {
        this.host = ip.address();
        this.port = port;
    }
    begin() {
        server.listen(this.port);
    }
    startSignInProcess() {
        if (currentSocket == null) {
            console.log("ERROR. No remote connected yet!");
        } else {
            currentSocket.emit('loginNow');
        }
    }
    init(getHandshake_func, remoteConnected_func, launchZoom_func, toggleAV_func, endMeeting_func) {
        gethandshake = getHandshake_func;
        launchZoom = launchZoom_func;
        toggleAV = toggleAV_func;
        endMeeting = endMeeting_func;
        remoteConnected = remoteConnected_func;

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/waitForLogin.html'));
        });
        app.get('/signIn', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/signIn.html'));
        });
        app.get('/launchZoomNow', (req, res) => {
            launchZoom(req);
            res.sendFile(path.join(__dirname, 'remote/remote.html'));
        });
        app.get('/togglefeed', (req, res) => {
            toggleAV(req);
            res.send('1');
        });
        app.get('/endmeeting', (req, res) => {
            endMeeting(req);
            res.send('1');
        });

        app.get('/video', (req, res) => {
            res.sendFile(path.join(__dirname, 'screenserver/index.html'));
        });
        
        io.on('connection', (socket) => {
            currentSocket = socket;
            console.log('remote connected');
            remoteConnected();
            socket.on('pingImage', (hnd) => {
                if (gethandshake() == hnd) {
                    screenshot().then((img) => {
                        socket.emit('image', img);
                    });
                }
            });
        });
    }
}

module.exports = { IO_REMOTE };