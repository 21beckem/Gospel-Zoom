const { exec } = require("child_process");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const v = new GlobalKeyboardListener();

const browser = require('./browser.js');
const remote = require('./remote.js');
const remote_server = new remote.server(1830, '/remote');
const bower = new browser.Bower();

let handshake = 12345;

function generateHandshake() {
    let hnd = "";
    for (let i = 0; i < 4; i++) {
        hnd += Math.floor(Math.random() * 10).toString();
    }
    handshake = hnd;
}

v.addListener(async function (e, down) {
    if (e.state == 'DOWN') {
        if (bower.zoomRunning) {
            switch (e.name) {
                case 'NUMPAD 2':
                    await bower.zoomToggle('A');
                    await bower.zoomToggle('V');
                    break;
                case 'NUMPAD 3':
                    if (await bower.zoomPressEnd()) {
                        await bower.invoke('webinarEnded()');
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (e.name) {
                case 'NUMPAD 0':
                    generateHandshake();
                    await bower.invoke('setHandshake("' + handshake + '")');
                    await bower.launchZoom('https://zoom.us/s/96138303673', 'brookfieldzoom@gmail.com', '4Nephi112');
                    break;
                case 'BACKSPACE':
                    //exec('shutdown /s /t 1');
                    console.log('would normally shut down now...');
                    break;
                default:
                    break;
            }
        }
        return true;
    }
});

const togglefeed = async function() {
    console.log('toggle feed');
}
const endmeeting = async function() {
    console.log('end meeting');
}

async function remoteConnected() {
    await bower.invoke('remoteConnected()')
}

// main
(async () => {
    remote_server.setSpecialResponses([
        ['/togglefeed', togglefeed],
        ['/endmeeting', endmeeting]
    ])
    remote_server.begin(remoteConnected);
    let remoteAddr = [remote_server.host, remote_server.port]
    await bower.init("file:///" + __dirname + '/web/index.html?qr=' + JSON.stringify(remoteAddr));
})();