const path = require('path'),
    screenshot = require('./screenshot-desktop/shot.js'),
    express = require('express'),
    app = express();
app.use(express.urlencoded({ extended: true }));
const server = require('http').Server(app),
    io = require('socket.io')(server),
    ip = require('ip');

var currentSocket = null;

var currentRemoteIP = null;
var TrustedRemote = null;

var launchZoom = () => {};
var toggleAV = () => {};
var endMeeting = () => {};

class IO_REMOTE {
    constructor(port) {
        this.host = ip.address();
        this.port = port;
    }
    begin() {
        server.listen(this.port);
    }
    returnSignInSuccess(yesOrNo) {
        currentSocket.emit('returnSignInSuccess', yesOrNo);
        if (yesOrNo) {
            TrustedRemote = currentRemoteIP;
        }
    }
    resetRemoteMemory() {
        currentSocket = null;
        TrustedRemote = null;
        TrustedRemote = null;
    }
    webinarEnded() {
        currentSocket.emit('webinarEnded');
    }
    init(launchZoom_func, toggleAV_func, endMeeting_func) {
        launchZoom = launchZoom_func;
        toggleAV = toggleAV_func;
        endMeeting = endMeeting_func;

        app.get('/remote-style.css', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/style.css'));
        });
        app.get('/churchZoomIcon', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/churchZoomIcon.png'));
        });
        app.get('/remote-script.js', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/script.js'));
        });

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/signIn.html'));
        });
        app.get('/remote', (req, res) => {
            res.sendFile(path.join(__dirname, 'remote/remote.html'));
        });
        app.post('/launchZoomNow', (req, res) => {
            if (TrustedRemote == null) {
                currentRemoteIP = req.socket.remoteAddress;
                launchZoom(req.body);
                res.sendFile(path.join(__dirname, 'remote/waitForLogin.html'));
            } else {
                res.send("<h3>ERROR:<h3><p>Only 1 remote at a time<p>");
            }
        });
        app.get('/togglefeed', (req, res) => {
            if (req.socket.remoteAddress == TrustedRemote) {
                res.send('1');
                toggleAV();
            } else {
                res.send('0');
            }
        });
        app.get('/endmeeting', (req, res) => {
            if (req.socket.remoteAddress == TrustedRemote) {
                res.send('1');
                endMeeting();
            } else {
                res.send('0');
            }
        });
        
        io.on('connection', (socket) => {
            currentSocket = socket;
            socket.on('pingImage', () => {
                if (socket.handshake.address == TrustedRemote) {
                    screenshot().then((img) => {
                        socket.emit('image', img);
                    });
                }
            });
        });
    }
}

module.exports = { IO_REMOTE };