const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

async function WinShot() {
    let dir = (process.pkg == undefined) ? __dirname : process.cwd() + '\\screenshot-desktop';
    let imgPath = 's.jpg';
    return new Promise((resolve, reject) => {
        exec('"' + path.join(dir.replace('app.asar', 'app.asar.unpacked'), 'screenCapture_1.3.2.bat') + '" "' + imgPath + '"', {
            cwd: dir.replace('app.asar', 'app.asar.unpacked'),
            windowsHide: true
            }, (err, stdout) => {
                if (err) {
                    return reject(err);
                } else {
                    fs.readFile(dir + '\\s.jpg', function(err, data) {
                        if (err) throw err;
                        resolve(data);
                    });
                }
            }
        );
    });
}
module.exports = WinShot;