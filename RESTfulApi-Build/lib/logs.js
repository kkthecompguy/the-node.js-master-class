/*
* Library for storing and rotating logs
*
*/

// Dependencies
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// container for the module
const lib = {};

// base directory of logs folder
lib.baseDir = path.join(__dirname,'/../.logs/');


// append a string to a file. create the file if it does not exit
lib.append = function(file, str, callback) {
  // open the file for appending
  fs.open(`${lib.baseDir}${file}.log`, 'a', function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      // append to the file and close it
      fs.appendFile(fileDescriptor, `${str} \n`, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback('error closing file that was begin appending');
            }
          })
        } else {
          callback('error appending to file');
        }
      })
    } else {
      callback('could not open file for appending');
    }
  })
};


// list all logs and optionally include the compressed logs
lib.list = function(includeCompressedLogs, callback) {
  fs.readdir(lib.baseDir, function(err, files) {
    if (!err && files && files.length > 0) {
      let trimmedFileNames = [];
      files.forEach(function(fileName) {
        // add the .log files
        if (fileName.indexOf(".log") > -1) {
          trimmedFileNames.push(fileName.replace(".log", ""));
        }

        // add on the .gz files
        if (fileName.indexOf(".gz.b64") > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace(".gz.b64", ""));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, files);
    }
  });
}

// compress the content of one .log file into .gz.b64 file within the same directory
lib.compress = function(logId, newFileId, callback) {
  let sourceFile = logId+".log";
  let destFile = newFileId+".gz.b64";

  // read the source file
  fs.readFile(`${lib.baseDir}${sourceFile}`, "utf8", function(err, inputString) {
    if (!err && inputString) {
      // compress the data with gzip
      zlib.gzip(inputString, function(err, buffer) {
        if (!err && buffer) {
          // send the data to destination file
          fs.open(`${lib.baseDir}${destFile}`, "wx", function(err, fileDescriptor) {
            if (!err && fileDescriptor) {
              // write to the destination file
              fs.writeFile(fileDescriptor, buffer.toString("base64"), function(err) {
                if (!err) {
                  // close the destination file
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
              });
            } else {
              callback(err);
            }
          });
        } else {
          callback(err);
        }
      });

    } else {
      callback(err);
    }
  });
};


// decompress the content of a .gz.b64 file into a string variable
lib.decompress = function(fileId, callback) {
  let fileName = fileId+".gz.b64";
  fs.readFile(`${lib.baseDir}${fileName}`, "utf8", function(err, str) {
    if (!err && str) {
      // decompress the data
      let inputBuffer = Buffer.from(str, "base64");
      zlib.unzip(inputBuffer, function(err, outputBuffer) {
        if (!err && outputBuffer) {
          // callback
          let outStr = outputBuffer.toString();
          callback(false, outStr);
        } else {
          callback(err);
        }
      })
    } else {
      callback(err);
    }
  });
}


// truncate a log file
lib.truncate = function(logId, callback) {
  fs.open(`${lib.baseDir}${logId}.log`, "r+", function(err, fileDescriptor) {
    if (!err && fileDescriptor) {
      fs.ftruncate(fileDescriptor, 0, function(err) {
        if (!err) {
          callback(false);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  })
}



// export module
module.exports = lib;