/*
* library for storing and editting data
*
*/

// dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// container for the module (to be exported)
const lib = {};

// base directory of data folder
lib.baseDir = path.join(__dirname,'/../.data/')

// write data to a file
lib.create = function(dir, file, data, callback) {
  // open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', function(err, fileDescriptor) {
    if(!err && fileDescriptor) {
      // convert data to string
      let stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if(!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback('error closing new file')
            }
          })
        } else {
          callback('error writing to new file')
        }
      })
    } else {
      console.log(err)
      callback('could not create new file, it may already exist')
    }
  })
}


// read data from a file
lib.read = function(dir, file, callback) {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', function(err, data) {
    if (!err && data) {
      callback(false, helpers.parseJsonToObject(data))
    } else {
      callback(err, data);
    }
  });
}

// update data inside a file
lib.update = function(dir, file, data, callback) {
  // open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      // convert data to string
      let stringData = JSON.stringify(data);

      // truncate the file
      fs.ftruncate(fileDescriptor, 4, function(err) {
        if (!err) {
          // write to file and close it
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              fs.close(fileDescriptor, function(err) {
                if (!err) {
                  callback(false);
                } else {
                  callback(err);
                }
              })
            } else {
              callback(err);
            }
          })
        } else {
          callback(err);
        }
      })
    } else {
      callback('could not open file for updating, it may not exist yet');
    }
  })
}

// delete a file
lib.delete = function(dir, file, callback) {
  // unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, function(err) {
    if (!err) {
      callback(false);
    } else {
      callback(err);
    }
  })
}


// list all items in a directory
lib.list = function(dir, callback) {
  fs.readdir(`${lib.baseDir}${dir}/`, function(err, files) {
    if (!err && files && files.length > 0) {
      let trimmedFileNames = [];
      files.forEach(function(file) {
        trimmedFileNames.push(file.replace(".json", ""));
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, files)
    };
  });
};


// export the module
module.exports = lib;