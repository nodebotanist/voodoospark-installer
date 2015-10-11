var path = require('path');
var particle = require('spark');
var inquirer = require('inquirer');
var chalk = require('chalk');

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

inquirer.prompt(loginQuestions, function(answers){
  particle.login({
    username: answers.username,
    password: answers.password
  }, function(err, body){
    if(err){
      if(err.toString().indexOf('invalid_grant') !== -1){
        console.error(chalk.yellow('Invalid username or password!'));
      } else {
        console.error(err);
      }
      process.exit(1);
    }

    console.log(chalk.green('Successfully logged in to Particle!'));

    particle.listDevices(function(err, devices){
      if(err){
        console.error(err);
        process.exit(1);
      }

      inquirer.prompt([{
        type: "list",
        name: "device",
        message: "Select the device you want to flash",
        choices: devices
      }], function(answers){
        var device = devices.filter(function(device){
          return device.attributes.name === answers.device
        })[0];

        device.flash([path.join(__dirname, '../firmware/voodoospark.cpp')], function(err){
          if(err){
            console.log(err);
            process.exit(1);
          } else {
            console.log(chalk.green("SUCCESS! You should be able to use Johnny-Five now."));
          }
        });
      });
    });
  });
});