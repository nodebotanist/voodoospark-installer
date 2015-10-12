var fs = require("fs");
var path = require('path');

var particle = require('spark');
var chalk = require('chalk');

module.exports = {
  getDevices: function(username, password, callback){
    particle.login({
      username: username,
      password: password
    }, function(err, body){
      if(err){
        if(err.toString().indexOf('invalid_grant') !== -1){
          callback(chalk.yellow('Invalid username or password!'));
        } else {
          callback('Error logging in: ' + err);
        }
      }

      console.log(chalk.green('Successfully logged in to Particle!'));

      particle.listDevices(function(err, devices){
        if(err){
          callback('Error getting a list of devices: ' + err);
        }

        callback(undefined, devices);
      });
    });
  },
  flash: function(device, callback){
    device.flash([path.relative(process.cwd(), path.resolve(__dirname, '..', 'firmware', 'voodoospark.cpp'))], function(err){
      if(err){
        callback('Error flashing firmware to device: ' + err);
      } else {
        callback(undefined);
      }
    });
  }
}