#!/usr/bin/env node
var particle = require('spark');
var inquirer = require('inquirer');
var chalk = require('chalk');

var flash = require('../lib/flash');
var firmware = require('../lib/firmware');

var command = process.argv[2];

command = command || 'flash';

if(command === 'install'){
  firmware.install(function(err){
    if(err){
      console.error(chalk.red('Error installing firmware: ' + err));
      process.exit(1);
    } else {
      console.log(chalk.green('Firmaware voodoospark installed and ready to flash!'));
    }
  });
} else if(command === 'update'){
   firmware.install(function(err){
    if(err){
      console.error(chalk.red('Error updating firmware: ' + err));
      process.exit(1);
    } else {
      console.log(chalk.green('Firmaware voodoospark updated and ready to flash!'));
    }
  }); 
} else if(command === 'flash'){
  firmware.checkFirmware(function(err){
    if(err){
      console.log(chalk.yellow('Firmware not found-- we need to install it!'));
      firmware.install(function(err){
        if(err){
          console.error(chalk.red('Problem fetching firmware: ' + err));
          process.exit(1);
        }
        console.log(chalk.green('Firmware installation complete!'));
        startFlashing();
      });
    } else {
      console.log(chalk.green('firmware found.'))
      startFlashing();
    }
  });

  function startFlashing(){
    inquirer.prompt(loginQuestions, function(answers){
      flash.getDevices(answers.username, answers.password,
      function(err, devices){
        inquirer.prompt([{
          type: "list",
          name: "device",
          message: "Select the device you want to flash",
          choices: devices
        }], function(answers){
          var device = devices.filter(function(device){
            return device.attributes.name === answers.device
          })[0];
          flash.flash(device, function(err){
            if(err){
              console.error(chalk.red(err));
              process.exit(1);
            } else {
              console.log(chalk.green("SUCCESS! You should be able to use Johnny-Five now."));
              process.exit(0);
            }
          });
        });
      });
    });
  }
}

var loginQuestions = [
  {
    type: "input",
    name: "username",
    message: "What's your Particle username? Hint: you probably created this when you claimed your Photon or Core."
  },
  {
    type: "password",
    name: "password",
    message: "Enter your Particle password."
  }
];

// inquirer.prompt(loginQuestions, function(answers){
//   particle.login({
//     username: answers.username,
//     password: answers.password
//   }, function(err, body){
//     if(err){
//       if(err.toString().indexOf('invalid_grant') !== -1){
//         console.error(chalk.yellow('Invalid username or password!'));
//       } else {
//         console.error(err);
//       }
//       process.exit(1);
//     }

//     console.log(chalk.green('Successfully logged in to Particle!'));

//     particle.listDevices(function(err, devices){
//       if(err){
//         console.error(err);
//         process.exit(1);
//       }

//       inquirer.prompt([{
//         type: "list",
//         name: "device",
//         message: "Select the device you want to flash",
//         choices: devices
//       }], function(answers){
//         var device = devices.filter(function(device){
//           return device.attributes.name === answers.device
//         })[0];


//       });
//     });
//   });
// });