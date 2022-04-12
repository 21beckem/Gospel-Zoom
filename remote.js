const http = require("http");
const fs = require('fs').promises;
const ip = require('ip');

var folderDir = '';
var onConnect = () => {};
var specialResponses_url = [];
var specialResponses_func = [];
const content_type = {
    '3dmf' : 'x-world/x-3dmf',
    '3dm' : 'x-world/x-3dmf',
    'avi' : 'video/x-msvideo',
    'ai' : 'application/postscript',
    'bin' : 'application/octet-stream',
    'bin' : 'application/x-macbinary',
    'bmp' : 'image/bmp',
    'cab' : 'application/x-shockwave-flash',
    'c'	 : 'text/plain',
    'c++' : 'text/plain',
    'class' : 'application/java',
    'css' : 'text/css',
    'csv' : 'text/comma-separated-values',
    'cdr' : 'application/cdr',
    'doc' : 'application/msword',
    'dot' : 'application/msword',
    'docx' : 'application/msword',
    'dwg' : 'application/acad',
    'eps' : 'application/postscript',
    'exe' : 'application/octet-stream',
    'gif' : 'image/gif',
    'gz' : 'application/gzip',
    'gtar' : 'application/x-gtar',
    'flv' : 'video/x-flv',
    'fh4' : 'image/x-freehand',
    'fh5' : 'image/x-freehand',
    'fhc' : 'image/x-freehand',
    'help' : 'application/x-helpfile',
    'hlp' : 'application/x-helpfile',
    'html' : 'text/html',
    'htm' : 'text/html',
    'ico' : 'image/x-icon',
    'imap' : 'application/x-httpd-imap',
    'inf' : 'application/inf',
    'jpe' : 'image/jpeg',
    'jpeg' : 'image/jpeg',
    'jpg' : 'image/jpeg',
    'js' : 'application/x-javascript',
    'java' : 'text/x-java-source',
    'latex' : 'application/x-latex',
    'log' : 'text/plain',
    'm3u' : 'audio/x-mpequrl',
    'midi' : 'audio/midi',
    'mid' : 'audio/midi',
    'mov' : 'video/quicktime',
    'mp3' : 'audio/mpeg',
    'mpeg' : 'video/mpeg',
    'mpg' : 'video/mpeg',
    'mp2' : 'video/mpeg',
    'ogg' : 'application/ogg',
    'phtml' : 'application/x-httpd-php',
    'php' : 'application/x-httpd-php',
    'pdf' : 'application/pdf',
    'pgp' : 'application/pgp',
    'png' : 'image/png',
    'pps' : 'application/mspowerpoint',
    'ppt' : 'application/mspowerpoint',
    'ppz' : 'application/mspowerpoint',
    'pot' : 'application/mspowerpoint',
    'ps' : 'application/postscript',
    'qt' : 'video/quicktime',
    'qd3d' : 'x-world/x-3dmf',
    'qd3' : 'x-world/x-3dmf',
    'qxd' : 'application/x-quark-express',
    'rar' : 'application/x-rar-compressed',
    'ra' : 'audio/x-realaudio',
    'ram' : 'audio/x-pn-realaudio',
    'rm' : 'audio/x-pn-realaudio',
    'rtf' : 'text/rtf',
    'spr' : 'application/x-sprite',
    'sprite' : 'application/x-sprite',
    'stream' : 'audio/x-qt-stream',
    'swf' : 'application/x-shockwave-flash',
    'svg' : 'text/xml-svg',
    'sgml' : 'text/x-sgml',
    'sgm' : 'text/x-sgml',
    'tar' : 'application/x-tar',
    'tiff' : 'image/tiff',
    'tif' : 'image/tiff',
    'tgz' : 'application/x-compressed',
    'tex' : 'application/x-tex',
    'txt' : 'text/plain',
    'vob' : 'video/x-mpg',
    'wav' : 'audio/x-wav',
    'wrl' : 'model/vrml',
    'wrl' : 'x-world/x-vrml',
    'xla' : 'application/msexcel',
    'xls' : 'application/msexcel',
    'xls' : 'application/vnd.ms-excel',
    'xlc' : 'application/vnd.ms-excel',
    'xml' : 'text/xml',
    'zip' : 'application/x-zip-compressed',
    'zip' : 'application/zip',
}

class server {
    constructor(port, dir) {
        this.host = ip.address();
        this.port = port;
        folderDir = dir;
        this.server = http.createServer(this.requestListener);
    }
    begin(thisOnConnect = () => {}) {
        this.server.listen(this.port, this.host, () => {
            console.log(`Remote server is running on http://${this.host}:${this.port}`);
        });
        onConnect = thisOnConnect;
    }
    end() {
        this.server.close();    
    }
    requestListener(req, res) {
        //digest the Url
        let preUrl = (req.url=='/') ? '/index.html' : req.url;
        let [reqUrl, ...reqParams] = preUrl.split('?');
        reqParams = reqParams.join('?');

        //handle special occurances
        if (specialResponses_url.includes(reqUrl)) {
            specialResponses_func[specialResponses_url.indexOf(reqUrl)]();
            res.setHeader("Content-Type", 'text/plain');
            res.writeHead(200);
            res.end("1");
            return;
        }

        // return the files
        onConnect();
        let fileType = reqUrl.split('.').pop();
        console.log(folderDir + reqUrl);
        fs.readFile(__dirname + folderDir + reqUrl)
        .then(contents => {
            res.setHeader("Content-Type", content_type[fileType]);
            res.writeHead(200);
            res.end(contents);
        })
        .catch(err => {
            res.writeHead(500);
            res.end(err);
        });
    }
    setSpecialResponses(special) {
        specialResponses_func = Array(special.length);
        specialResponses_url = Array(special.length);
        for (let i = 0; i < special.length; i++) {
            specialResponses_url[i] = special[i][0];
            specialResponses_func[i] = special[i][1];
        }
        console.log("specialResponses_url:", specialResponses_func);
    }
}
module.exports = { server };