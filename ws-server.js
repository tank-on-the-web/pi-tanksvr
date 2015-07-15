(function() {
  'use strict';
  var WebSocketServer = require('ws').Server;

  exports.Server = (function () {
    function WSServer() {
      this.onMotor = function (param) {};
      this.onFire = function (pressed) {};
    }

    WSServer.prototype.run = function(port) {
      var self = this;
      var fired = false;
      this.wss = new WebSocketServer({ port: port });
      console.log(new Date(), 'Server is listening on port', port);
      this.wss.on('connection', function(socket) {
        socket.on('message', function(message) {
          console.log('message: ' + message);
          var obj = JSON.parse(message);
          self.onMotor(obj.motor);
          if (obj.fire && fired === false) {
            self.onFire(obj.fire);
          }
          fired = obj.fire;
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
