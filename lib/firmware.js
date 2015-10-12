var https = require('https');
var fs = require('fs');
var path = require('path');

module.exports = {
  checkFirmware: function(callback){
    // check that firmware exists. 
    fs.stat(path.resolve(__dirname, '..', 'firmware', 'voodoospark.cpp'), function(err, stats){
      if(err){
        if(err.errno === -2){
          // file doesn't exist. That's fine, just means we need to download it.
          callback('not installed');
        } else {
          // we're not ready for this error.
          console.error(err);
          process.exit(1);
        }
      } else {
        callback(undefined);
      }
    });
  },
  install: function(callback){
    https.get('https://raw.githubusercontent.com/voodootikigod/voodoospark/master/firmware/voodoospark.cpp', function(res){
        var body = '';
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          fs.writeFile(path.resolve('/' , __dirname, '..', 'firmware', 'voodoospark.cpp'), 
            body,
            function(err){
              if(err){
                callback('Error writing firmware to file: ' + err);
              } else {
                callback(undefined);
              }
          });
        });
    }).on('error', function(err){
      callback('Problem fetching firmware: ' + err);
    });
  }
}