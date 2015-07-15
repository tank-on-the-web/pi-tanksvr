(function() {
  'use strict';
  var WebSocketServer = require('ws').Server;

  exports.Server = (function () {
    function WSServer() {
      this.onMotor = function (param) {};
    }

    WSServer.prototype.run = function(port) {
      var self = this;
      this.wss = new WebSocketServer({ port: port });
      console.log(new Date(), 'Server is listening on port', port);
      this.wss.on('connection', function(socket) {
        socket.on('message', function(message) {
          console.log('message: ' + message);
          var obj = JSON.parse(message);
          if (obj.type === 'motor') {
            self.onMotor(obj.data);
          }
        });
      });
    };
    
    WSServer.prototype.send = function(data) {
      this.wss.clients.forEach(function(socket) {
        socket.send(JSON.stringify(data));
      });
    };

    return WSServer;

  })();
})();
