/*
* These are the request handlers
*
*/

// Dependencies
const config = require('./config');
const _data = require('./data');
const helpers = require('./helpers');
const _url = require("url");
const dns = require("dns");
const _performance = require("perf_hooks").performance;
const util = require("util");
const debug = util.debuglog("performance");


// Define the handler
const handlers = {};


/*
* HTML Handler
*
*/

// Index Handler
handlers.index = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Uptime Monitoring - Made Simple",
      "head.description": "We offer free simple, uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down. We\'ll send you a text to let you know",
      "body.class": "index"
    };

    // read in a template as a string
    helpers.getTemplate('index', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// create account handler
handlers.accountCreate = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Create an Account",
      "head.description": "Signup is easy and only takes a few seconds",
      "body.class": "accountCreate"
    };

    // read in a template as a string
    helpers.getTemplate('accountCreate', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}

// create session handler
handlers.sessionCreate = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Login to your Account",
      "head.description": "Please enter your phone number and password to access your account",
      "body.class": "sessionCreate"
    };

    // read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}

// session has been delete handler
handlers.sessionDeleted = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Logged Out",
      "head.description": "You have been logged out of your account",
      "body.class": "sessionDeleted"
    };

    // read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}


// account edit handler
handlers.accountEdit = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Account Settings",
      "body.class": "accountEdit"
    };

    // read in a template as a string
    helpers.getTemplate('accountEdit', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}


// account edit handler
handlers.accountDeleted = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Account Settings",
      "head.description": "Your account has been deleted",
      "body.class": "accountDeleted"
    };

    // read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}


// checks create handler
handlers.checksCreate = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Account Settings",
      "body.class": "checksCreate"
    };

    // read in a template as a string
    helpers.getTemplate('checksCreate', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}


// Dashboard (view)
handlers.checksList = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Dashboard",
      "body.class": "checksList"
    };

    // read in a template as a string
    helpers.getTemplate('checksList', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}

// Edit a check handler
handlers.checksEdit = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {

    // prepare data for interpolation
    let templateData = {
      "head.title": "Check Detail",
      "body.class": "checksEdit"
    };

    // read in a template as a string
    helpers.getTemplate('checksEdit', templateData, function(err, str) {
      if (!err && str) {
        // add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, fullString) {
          if (!err && fullString) {
            // return that page as HTML
            callback(200, fullString, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
}


// favicon handle
handlers.favicon = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {
    // read in the favicon data
    helpers.getStaticAsset("favicon.ico", function(err, data) {
      if (!err && data) {
        callback(200, data, "favicon");
      } else {
        callback(500);
      }
    })
  } else {
    callback(405);
  }
}


// public assets
handlers.public = function(data, callback) {
  // reject any request that isn't a GET
  if (data.method === "get") {
    // get the filename being requested
    let trimmedAssetName = data.trimmedPath.replace("public/", "").trim();
    if (trimmedAssetName.length > 0) {
      // read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, function(err, asset) {
        if (!err && asset) {
          // determine the content type (default to plain text)
          let contentType = "plain";
          if (trimmedAssetName.indexOf(".css") > -1) contentType = "css";
          if (trimmedAssetName.indexOf(".png") > -1) contentType = "png";
          if (trimmedAssetName.indexOf(".jpg") > -1) contentType = "jpg";
          if (trimmedAssetName.indexOf(".ico") > -1) contentType = "favicon";

          // callback the data
          callback(200, asset, contentType)
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
}


/*
* JSON API Handler
*
*/

// example error
handlers.exampleError = function(data, callback) {
  let err = new Error("this is an example error");
  throw err;
}

// users handler
handlers.users = function(data, callback) {
  const acceptibleMethods = ['post', 'get', 'put', 'delete']
  if (acceptibleMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
}

// container for users submethods
handlers._users = {};

// users - post
// required data: firstName, lastName, phone, password, tosAgreement
// optional data: none
handlers._users.post = function(data, callback) {
  // check that all required fields are all filled out
  const firstName = typeof(data.payload.firstName) === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false;
  const lastName = typeof(data.payload.lastName) === "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) === "string" && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgreement = typeof(data.payload.tosAgreement) === "boolean" && data.payload.tosAgreement === true ? true : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exist
    _data.read('users', phone, function(err, data) {
      if(err) {
        // hash the password
        let hashedPassword = helpers.hash(password);

        // create the user object
        if (hashedPassword) {
          let userObj = {
            firstName,
            lastName,
            phone,
            hashedPassword,
            tosAgreement
          }
  
          // store the user
          _data.create('users', phone, userObj, function(err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {'error': 'could not create the new user'})
            }
          });

        } else {
          callback(500, {'error': 'could not has the user\'s password'})
        }

      } else {
        callback(400, {'error': 'user with phone number already exists'})
      }

    });
  } else {
    callback(400, {error: 'missing required fields'});
  }
};

// users - get
// required data: phone
// optional data: none
handlers._users.get = function(data, callback) {
  // check that the phone number is valid
  let phone = typeof(data.queryStringObject.phone) === "string" && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim(): false;

  if (phone) {
    // get the tokens from the headers
    let token = typeof(data.headers.token) === "string" ? data.headers.token : false
    // verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
      if (tokenIsValid) {
        // look up the user
        _data.read('users', phone, function(err, data) {
          if (!err && data) {
            // remove the hash password from user Obj
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {error: "missing required token in header or token is invalid"});
      }
    })
    
  } else {
    callback(400, {'error': 'missing required fields'})
  }
};

// users - put
// required data: phone
// optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function(data, callback) {
  // check for the required fields
  let phone = typeof(data.payload.phone) === "string" && data.payload.phone.trim().length === 10 ? data.payload.phone.trim(): false;

  // check for optional fields
  let firstName = typeof(data.payload.firstName) === "string" && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim(): false;
  let lastName = typeof(data.payload.lastName) === "string" && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let password = typeof(data.payload.password) === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  // error if the phone is invalid
  if(phone) {
    // error is nothing is sent to update
    if (firstName || lastName || password) {
      // get the tokens from the headers
      let token = typeof(data.headers.token) === "string" ? data.headers.token : false;
      // verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
        if (tokenIsValid) {

          // look up user
          _data.read("users", phone, function(err, userData) {
            if (!err && userData) {
              // update the fields neccessary
              if(firstName) userData.firstName = firstName;
              if (lastName) userData.lastName = lastName;
              if (password) userData.hashedPassword = helpers.hash(password);
              // store the new update
              _data.update("users", phone, userData, function(err) {
                if(!err) {
                  callback(200);
                } else {
                  console.log(err)
                  callback(500, {error: 'could not update the user'})
                }
              })
            } else {
              callback(400, {'error': 'the specified user does not exist'});
            }
          });

        } else {
          callback(403, {error: "missing required token in header or token is invalid"});
        }
      });
      
    } else {
      callback(400, {error: 'missing fields to update'});
    }
  } else {
    callback(400, {error: 'missing required fields'});
  }

};

// users - delete
// required field: phone
handlers._users.delete = function(data, callback) {
  // check that the phone number is valid
  let phone = typeof(data.queryStringObject.phone) === "string" && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim(): false;

  if (phone) {
    // get the tokens from the headers
    let token = typeof(data.headers.token) === "string" ? data.headers.token : false;
    // verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
      if (tokenIsValid) {
        // look up the user
        _data.read('users', phone, function(err, userData) {
          if (!err && userData) {
            // delete user
            _data.delete("users", phone, function(err) {
              if (!err) {
                // delete each of the checks associated with the user
                let userChecks = typeof(userData.checks) === "object" && userData.checks instanceof Array ? userData.checks : [];
                let checksToDelete = userChecks.length;
                if (checksToDelete > 0) {
                  let checksDeleted = 0;
                  let deletionErrors = false;
                  // loop thru the checks
                  userChecks.forEach(function(checkId) {
                    // delete the check
                    _data.delete("checks", checkId, function(err) {
                      if (err) {
                        deletionErrors = true
                      }
                      checksDeleted++;
                      if (checksDeleted === checksToDelete) {
                        if (!deletionErrors) {
                          callback(200);
                        } else {
                          callback(500, {error: "error encountered while attempting to delete all of the user\'s checks. all checks may not have been deleted from the system successfully"});
                        }
                      }
                    })
                  });
                } else {
                  callback(200);
                }

              } else {
                callback(500, {error: 'could not delete the specified user'});
              }
            })
          } else {
            callback(404, {'error': 'could not find specified user'});
          }
        });
      } else {
        callback(403, {error: "missing required token in header or token is invalid"});
      }
    })
    
  } else {
    callback(400, {'error': 'missing required fields'});
  }
};


// tokens handler
handlers.tokens = function(data, callback) {
  const acceptibleMethods = ['post', 'get', 'put', 'delete']
  if (acceptibleMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
}


// container for all tokens submethods
handlers._tokens = {};

// tokens - post
// required data: phone, password
// optional data: none
handlers._tokens.post = function(data, callback) {
  _performance.mark("entered function");
  let phone = typeof(data.payload.phone) === "string" && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) === "string" && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  _performance.mark("inputs validated");
  if(phone && password) {
    // look up the user who matches that phone
    _performance.mark("beginning user lookup");
    _data.read("users", phone, function(err, userData) {
      _performance.mark("user lookup complete");
      if(!err && userData) {
        // hash the sent password
        _performance.mark("begining password hashing");
        let hashedPassword = helpers.hash(password);
        _performance.mark("password hashing complete");
        if (hashedPassword === userData.hashedPassword) {
          // if valid create a new token with a random name. set expiration date 1 hour in the future
          _performance.mark("creating data for the token");
          let tokenId = helpers.createRandomString(20);
          let expires = Date.now() + 1000 * 60 * 60;
          let tokenObject = {
            phone,
            id: tokenId,
            expires
          }
          // store the token
          _performance.mark("beginning storing token");
          _data.create("tokens", tokenId, tokenObject, function(err) {
            _performance.mark("storing token complete");

            // gather all the measurements
            _performance.measure("Beginning to end", "entered function", "storing token complete");
            _performance.measure("Validating user input", "entered function", "inputs validated");
            _performance.measure("user lookup", "beginning user lookup", "user lookup complete");
            _performance.measure("password hashing", "begining password hashing", "password hashing complete");
            _performance.measure("token data creation", "creating data for the token", "beginning storing token");
            _performance.measure("token storing", "beginning storing token", "storing token complete");

            // log out all measurements
            let measurements = _performance.getEntriesByType("measure");
            measurements.forEach(function(measurement) {
              debug("\x1b[33m%s\x1b[0m", `${measurement.name} ${measurement.duration}`);
            })

            if(!err) {
              callback(200, tokenObject);
            } else {
              callback(500, {error: 'could not create new token'});
            }
          })
        } else {
          callback(400, {error: 'password did not match'});
        }
      } else {
        callback(400, {'error': 'could not find the specified user'});
      }
    })
  } else {
    callback(400, {error: 'missing required fields'})
  }
}

// tokens - get
// required data: phone
// optional data: none
handlers._tokens.get = function(data, callback) {
  // check that the id is valid
  let tokenId = typeof(data.queryStringObject.tokenId) === "string" && data.queryStringObject.tokenId.trim().length === 20 ? data.queryStringObject.tokenId.trim(): false;

  if (tokenId) {
    // look up the token
    _data.read('tokens', tokenId, function(err, data) {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {'error': 'missing required fields'})
  }
}

// tokens - put
// required fields: tokenId, extend
// optional data: none
handlers._tokens.put = function(data, callback) {
  let tokenId = typeof(data.payload.tokenId) === "string" && data.payload.tokenId.trim().length === 20 ? data.payload.tokenId.trim() : false;
  let extend = typeof(data.payload.extend) === "boolean" && data.payload.extend === true ? true : false;
  if (tokenId && extend) {
    // look up token
    _data.read("tokens", tokenId, function(err, tokenData) {
      if (!err && tokenData) {
        // check to make sure that token isn't already expired
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;
          // store the updates
          _data.update("tokens", tokenId, tokenData, function(err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {error: "could not update token expiration"});
            }
          })
        } else {
          callback(400, {error: 'token has already expired and cannot be extended'});
        }
      } else {
        callback(400, {error: "specified token does not exist"});
      }
    })
  } else {
    callback(400, {error: 'missing required fields or fields are invalid'});
  }
}

// tokens - delete
// required data: tokenId
// optional data: none
handlers._tokens.delete = function(data, callback) {
  // check that the id is valid
  let tokenId = typeof(data.queryStringObject.tokenId) === "string" && data.queryStringObject.tokenId.trim().length === 20 ? data.queryStringObject.tokenId.trim(): false;

  if (tokenId) {
    // look up the token
    _data.read('tokens', tokenId, function(err, data) {
      if (!err && data) {
        // delete token
        _data.delete("tokens", tokenId, function(err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, {error: 'could not delete the specified token'})
          }
        })
      } else {
        callback(404, {'error': 'could not find specified token'});
      }
    });
  } else {
    callback(400, {'error': 'missing required fields'})
  }
}


// verify if a given tokenid is currently valid for a given user
handlers._tokens.verifyToken = function(tokenId, phone, callback) {
  // look up the token
  _data.read("tokens", tokenId, function(err, tokenData) {
    if (!err && tokenData) {
      // check that the token is for the given user and has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  })
}


// checks handler
handlers.checks = function(data, callback) {
  const acceptibleMethods = ['post', 'get', 'put', 'delete']
  if (acceptibleMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
}


// container for all checks submethods
handlers._checks = {};

// checks -post
// required data: protocol url, method, successCodes, timeoutSeconds
// optional data none
handlers._checks.post = function(data, callback) {
  // valid check input
  let protocol = typeof(data.payload.protocol) === "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  let url = typeof(data.payload.url) === "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  let method = typeof(data.payload.method) === "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  let successCodes = typeof(data.payload.successCodes) === "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  let timeoutSeconds = typeof(data.payload.timeoutSeconds) === "number" && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // get token from the headers
    let token = typeof(data.headers.token) === "string" ? data.headers.token: false;
    // look up the user by reading the token
    _data.read("tokens", token, function(err, tokenData) {
      if (!err && tokenData) {
        let userPhone = tokenData.phone

        // look up the user data
        _data.read("users", userPhone, function(err, userData) {
          if (!err && userData) {
            let userChecks = typeof(userData.checks) === "object" && userData.checks instanceof Array ? userData.checks : [];
            // verify that the user has less than the number is max-checks-per-user
            if (userChecks.length < config.maxChecks) {
              // verify that the URL given has DNS entries (and therefore can resolve)
              let parseUrl = new _url.URL(`${protocol}://${url}`)
              let hostname = typeof(parseUrl.hostname) === "string" && parseUrl.hostname.length > 0 ? parseUrl.hostname: false;
              dns.resolve(hostname, function(err, records) {
                if (!err && records) {
                  // create a random id for the check
                  let checkId = helpers.createRandomString(20);
                  
                  // create the check object and include the user's phone
                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds
                  };
                  // save the object
                  _data.create("checks", checkId, checkObject, function(err) {
                    if (!err) {
                      // add the check id to user's object
                      userData.checks = userChecks;
                      userData.checks.push(checkId);

                      // save the new user data
                      _data.update("users", userPhone, userData, function(err) {
                        if (!err) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, { error: "could not update the user with the new check" });
                        }
                      });
                    } else {
                      callback(500, { error: "could not create the new check" });
                    }
                  });
                } else {
                  callback(400, {error: "the hostname of the URL entered did not resolve to any DNS entries"});
                }
              });
            } else {
              callback(400, {error: `the user already has maximum number of checks (${config.maxChecks})`});
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { error: 'missing required inputs or inputs are invalid' })
  }
}


// checks - get
// required data: checkId
// optional data: none
handlers._checks.get = function(data, callback) {
  // check that the checkId is valid
  let checkId = typeof(data.queryStringObject.checkId) === "string" && data.queryStringObject.checkId.trim().length === 20 ? data.queryStringObject.checkId.trim(): false;

  if (checkId) {
    // look up the check
    _data.read("checks", checkId, function(err, checkData) {
      if (!err && checkData) {
        // get the tokens from the headers
        let token = typeof(data.headers.token) === "string" ? data.headers.token : false
        // verify that the given token is valid for the phone number and belongs to the creator
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if (tokenIsValid) {
            // return the check data
            callback(200, checkData)
          } else {
            callback(403);
          }
        });
      } else {
        callback(404);
      }
    });
    
  } else {
    callback(400, {'error': 'missing required fields'})
  }
}

// checks  - put
// required data: checkId
// optional data : protocol, url, method, successCode, timeoutSeconds
handlers._checks.put = function(data, callback) {
  // check for the required fields
  let checkId = typeof(data.payload.checkId) === "string" && data.payload.checkId.trim().length === 20 ? data.payload.checkId.trim(): false;

  // check for optional fields
  let protocol = typeof(data.payload.protocol) === "string" && ["https", "http"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  let url = typeof(data.payload.url) === "string" && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
  let method = typeof(data.payload.method) === "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  let successCodes = typeof(data.payload.successCodes) === "object" && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
  let timeoutSeconds = typeof(data.payload.timeoutSeconds) === "number" && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;

  // check to make sure checkId is valid
  if (checkId) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // look up the check
      _data.read("checks", checkId, function(err, checkData) {
        if (!err && checkData) {
          // get the tokens from the headers
          let token = typeof(data.headers.token) === "string" ? data.headers.token : false
          // verify that the given token is valid for the phone number and belongs to the creator
          handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
            if (tokenIsValid) {
              // return update the check where neccessary
              if (protocol) checkData.protocol = protocol;
              if (url) checkData.url = url;
              if (method) checkData.method = method;
              if (successCodes) checkData.successCodes = successCodes;
              if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;
              
              // store the new update
              _data.update("checks", checkId, checkData, function(err) {
                if (!err) {
                  callback(200);
                } else {
                  callback(500, {error: "could not update the check"});
                }
              })
            } else {
              callback(403);
            }
          });
        } else {
          callback(400, { error: "check id did not exist" });
        }
      });
    } else {
      callback(400, {error: 'missing fields to update'});
    }
  } else {
    callback(400, {error: 'missing required field'});
  }
}


// checks - delete
// required data: checkId
// optional data: none
handlers._checks.delete = function(data, callback) {
  // check that the phone number is valid
  let checkId = typeof(data.queryStringObject.checkId) === "string" && data.queryStringObject.checkId.trim().length === 20 ? data.queryStringObject.checkId.trim(): false;

  if (checkId) {
    // lookup the check
    _data.read("checks", checkId, function(err, checkData) {
      if (!err && checkData) {
        // get the tokens from the headers
        let token = typeof(data.headers.token) === "string" ? data.headers.token : false;
        // verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
          if (tokenIsValid) {
            // delete the check data
            _data.delete("checks", checkId, function(err) {
              if (!err) {
                // look up the user
                _data.read('users', checkData.userPhone, function(err, userData) {
                  if (!err && userData) {
                    let userChecks = typeof(userData.checks) === "object" && userData.checks instanceof Array ? userData.checks : [];

                    // remove the deleted check from their list of checks
                    let checkIndex = userChecks.indexOf(checkId);
                    if (checkIndex > -1) {
                      userChecks.splice(checkIndex, 1);
                      // resave user data;
                      userData.checks = userChecks;
                      _data.update("users", checkData.userPhone, userData, function(err) {
                        if (!err) {
                          callback(200);
                        } else {
                          callback(500, {error: 'could not delete the specified user'});
                        }
                      });
                    } else {
                      callback(500, { error: "could not find the check on user object" })
                    }
                    
                  } else {
                    callback(500, {'error': 'could not find the user who created the check. could not remove check from list of check on user object'});
                  }
                });
              } else {
                callback(500, { error: "could not delete the check data" });
              }
            })
            
          } else {
            callback(403);
          }
        });
        
      } else {
        callback(400, {error: "specified checkId does not exist"});
      }
    });
    
  } else {
    callback(400, {'error': 'missing required fields'});
  }
}


// ping handler
handlers.ping = function(data, callback) {
  // callback http status code and payload object
  callback(200);
}

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
} 


// export the module
module.exports = handlers;