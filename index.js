const { exec } = require("child_process");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const v = new GlobalKeyboardListener();

const browser = require('./browser.js');
const remote = require('./new-remote.js');
const remote_server = new remote.IO_REMOTE(1820);
const bower = new browser.Bower();

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
    await bower.launchZoom('https://zoom.us/s/' + data.webinarid, data.email, data.password, (launchSuccess)=>{
        remote_server.returnSignInSuccess(launchSuccess);
    });
}

const togglefeed = async function() {
    await bower.zoomToggle('A');
    await bower.zoomToggle('V');
}
const endmeeting = async function() {
    if (await bower.zoomPressEnd()) {
        await bower.invoke('webinarEnded()');
        remote_server.webinarEnded();
        remote_server.resetRemoteMemory();
    }
}

const main = async () => {
    remote_server.init(signInWithZoomInfo, togglefeed, endmeeting);
    remote_server.begin();
    let remoteAddr = [remote_server.host, remote_server.port];
    await bower.init("file:///" + __dirname + '/web/index.html?qr=' + JSON.stringify(remoteAddr));
}
main();