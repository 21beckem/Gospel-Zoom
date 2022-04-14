const { exec } = require("child_process");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const v = new GlobalKeyboardListener();

const browser = require('./browser.js');
const remote = require('./new-remote.js');
const remote_server = new remote.IO_REMOTE(1820);
const bower = new browser.Bower();

let handshake = 12345;

function getHand() {
    return handshake;
}

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
                    togglefeed();
                    break;
                case 'NUMPAD 3':
                    endmeeting();
                    break;
                default:
                    break;
            }
        } else {
            switch (e.name) {
                case 'NUMPAD 0':
                    // send remote to sign in page
                    remote_server.startSignInProcess();
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

async function signInWithZoomInfo(data) {
    console.log(data);
    return;
    generateHandshake();
    await bower.invoke('setHandshake("' + handshake + '")');
    await bower.launchZoom('https://zoom.us/s/96138303673', 'brookfieldzoom@gmail.com', '4Nephi112');
}

const togglefeed = async function(hnd) {
    if (bower.zoomRunning && hnd == handshake) {
        await bower.zoomToggle('A');
        await bower.zoomToggle('V');
    }
}
const endmeeting = async function(hnd) {
    if (bower.zoomRunning && hnd == handshake) {
        if (await bower.zoomPressEnd()) {
            await bower.invoke('webinarEnded()');
        }
    }
}

async function remoteConnected() {
    await bower.invoke('remoteConnected()')
}

// main
(async () => {
    remote_server.init(getHand, remoteConnected, signInWithZoomInfo, togglefeed, endmeeting);
    remote_server.begin();
    let remoteAddr = [remote_server.host, remote_server.port]
    await bower.init("file:///" + __dirname + '/web/index.html?qr=' + JSON.stringify(remoteAddr));
})();