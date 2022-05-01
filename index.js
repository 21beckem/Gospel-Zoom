const __dir = (process.pkg == undefined) ? __dirname : process.cwd();

const { exec } = require("child_process");

const browser = require('./browser.js');
const remote = require('./remote.js');
const remote_server = new remote.IO_REMOTE(1820);
const bower = new browser.Bower();

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
    await bower.init("file:///" + __dir + '/web/index.html?qr=' + JSON.stringify(remoteAddr));
}
main();