const web = require('./remote.js');

const server = new web.server(8000, '/remote');
server.begin();