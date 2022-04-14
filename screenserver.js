const path = require('path'),
    screenshot = require('screenshot-desktop'),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var gethandshake = () => {};

class SCREENserver {
    begin() {
        server.listen(1820);
    }
    init(getHandshake_func) {
        gethandshake = getHandshake_func;
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'screenserver/index.html'));
        });
        
        io.on('connection', (socket) => {
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

module.exports = { SCREENserver };