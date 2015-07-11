(function () {
  'use strict';
  var blaster = require('pi-blaster.js');

  exports.TankMoter = (function () {
    var THRESHOLD = 30;

    // constructor
    function TankMoter(in1, in2, pwm) {
      this.in1 = in1;
      this.in2 = in2;
      this.pwm = pwm;
    }
    TankMoter.prototype.setValue = function(value) {
      var in1val = 0, in2val = 0, pwmval = 0;
      var absval = Math.abs(value);
      if (absval >= THRESHOLD) {
        in1val = value <= 0 ? 0 : 1;
        in2val = value >= 0 ? 0 : 1;
        pwmval = absval / 100.0;
      }
      console.log(this.in1, in1val);
      console.log(this.in2, in2val);
      console.log(this.pwm, pwmval);
      blaster.setPwm(this.in1, in1val);
      blaster.setPwm(this.in2, in2val);
      blaster.setPwm(this.pwm, pwmval);
    };
    return TankMoter;
  })();
})();
