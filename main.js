(function () {
  'use strict';

  var fs = require('fs');
  var restify = require('restify');
  var tankmoter = require('./tank-moter.js');
  var http = require('./http-server.js');
  var ws = require('./ws-server.js');

  var isLockOn = false;
  var PORT = 7090;
  var HTTP_PORT = 7080;
  var HTTP_PATH = './AR-tank-console/';

  // GPIO#
  var L_IN1 = 17;
  var L_IN2 = 18;
  var L_PWM = 27;
  var R_IN1 = 22;
  var R_IN2 = 23;
  var R_PWM = 24;

  var leftMoter  = new tankmoter.TankMoter(L_IN1, L_IN2, L_PWM);
  var rightMoter = new tankmoter.TankMoter(R_IN1, R_IN2, R_PWM);

  // if no input longer than the interval, set the motor to 0
  var failSafeTimestamp = 0;
  var failSafeTimestampLastTime = 0;
  var failSafeTimer = setInterval(
    function() {
      if (failSafeTimestamp === failSafeTimestampLastTime) {
        if (leftMoter.getValue() != 0 || rightMoter.getValue() != 0) {
          console.log('!!! fail safe !!!')
          leftMoter.setValue(0);
          rightMoter.setValue(0);
        }
      }
      failSafeTimestampLastTime = failSafeTimestamp;
    },
    1000 // fail safe interval
  );

  // var server = new http.Server();
  var server = new ws.Server();
  server.run(PORT);
  server.onMotor = function(param) {
    var lv = param.lv;
    var rv = param.rv;

    console.log('lv=' + lv, 'rv=' + rv);
    leftMoter.setValue(lv);
    rightMoter.setValue(rv);
    failSafeTimestamp = Date.now();
  };
  server.onFire = function() {
    console.log('fire!');
    var msg = { fire: true };
    if (isLockOn) {
      console.log('hit!!!');
      msg.hit = true;
    }
    server.send(msg);
  };
  server.onLockOn = function(lockon) {
    isLockOn = lockon;
  };

  if (fs.existsSync(HTTP_PATH)) {
    var httpServer = require('http-server/lib/http-server');

    var HTTP_ADDR = '0.0.0.0';
    var options = { root: HTTP_PATH };

    var httpd = httpServer.createServer(options);
    httpd.listen(HTTP_PORT, HTTP_ADDR, function() {
      console.log(HTTP_PATH, 'listening on', HTTP_ADDR + ':' + HTTP_PORT);
    });
  }

})();
