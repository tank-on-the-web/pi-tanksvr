(function () {
  'use strict';

  var restify = require('restify');
  var tankmoter = require('./tank-moter.js');
  var http = require('./http-server.js');

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

  var server = new http.TankServer(leftMoter, rightMoter);
  server.run(PORT);
})();
