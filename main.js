(function () {
  'use strict';

  var restify = require('restify');
  var tankmoter = require('./tank-moter.js');
  var http = require('./http-server.js');
  var ws = require('./ws-server.js');

  var isLockOn = false;
  var PORT = 7090;

  // GPIO#
  var L_IN1 = 17;
  var L_IN2 = 18;
  var L_PWM = 27;
  var R_IN1 = 22;
  var R_IN2 = 23;
  var R_PWM = 24;

  var leftMoter  = new tankmoter.TankMoter(L_IN1, L_IN2, L_PWM);
  var rightMoter = new tankmoter.TankMoter(R_IN1, R_IN2, R_PWM);

  // var server = new http.Server();
  var server = new ws.Server();
  server.run(PORT);
  server.onMotor = function(param) {
    var lv = param.lv;
    var rv = param.rv;

    console.log('lv=' + lv, 'rv=' + rv);
    leftMoter.setValue(lv);
    rightMoter.setValue(rv);
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
})();
