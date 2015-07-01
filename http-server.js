(function () {
  'use strict';
  var restify = require('restify');

  exports.TankServer = (function(){
    function HttpTankServer(lMoter, rMoter) {
      this.lMoter = lMoter;
      this.rMoter = rMoter;
    }

    // constructor
    HttpTankServer.prototype.run = function(port) {
      var server = restify.createServer();
      server.use(restify.queryParser());
      // CORS
      server.use(restify.CORS());
      server.use(restify.fullResponse());

      server.get('/put', this.setMoterValues.bind(this));

      server.listen(port, function() {
        console.log(server.name, 'listening on', server.url);
      });
    }

    HttpTankServer.prototype.setMoterValues = function(req, res, next) {
      var lv = req.query.lv;
      var rv = req.query.rv;

      console.log('lv=' + lv, 'rv=' + rv);
      this.lMoter.setValue(lv);
      this.rMoter.setValue(rv);

      res.send('done');
      next();
    }

    return HttpTankServer;
  })();
})();
