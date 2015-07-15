(function () {
  'use strict';
  var restify = require('restify');

  exports.Server = (function(){
    function HttpServer() {
      this.onMotor = function (param) {};
    }

    HttpServer.prototype.run = function(port) {
      var server = restify.createServer();
      server.use(restify.queryParser());
      // CORS
      server.use(restify.CORS());
      server.use(restify.fullResponse());

      var self = this;
      server.get('/put', function (req, res, next) {
        self.onMotor(req.query);
        res.send('done');
        next();
      });

      server.listen(port, function() {
        console.log(server.name, 'listening on', server.url);
      });
    };

    return HttpServer;
  })();
})();
