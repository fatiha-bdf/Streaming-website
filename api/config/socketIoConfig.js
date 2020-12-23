var app = require('../app');
var http = require('http');
var socket = require('socket.io');

module.exports = class webSocketIo {
    getIo() {
        /**
         * Get port from environment and store in Express.
         */
        var port = normalizePort(process.env.PORT || '3000');
        app.set('port', port);
        /**
         * Create HTTP server.
         */
        var server = http.createServer(app);
        /**
         * Listen on provided port, on all network interfaces.
         */
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
        var io = socket(server);
        return io;
    }
}
