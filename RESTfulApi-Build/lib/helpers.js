/*
* helpers for various tasks
*
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const path = require("path");
const fs = require("fs");

// container for all the helpers
const helpers = {};

// sample test to get number
helpers.getNumber = function() {
  return 1;
}


// create a SHA256 hash
helpers.hash = function(str) {
  if(typeof(str) === "string" && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest("hex");
    return hash;
  } else {
    return false;
  }
}


// parse buffer to json object
helpers.parseJsonToObject = function(buff) {
  try {
    return JSON.parse(buff);
  } catch (error) {
    return {}
  }
}

// create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength) {
  let validStrLength = typeof(strLength) === "number" && strLength > 0 ? strLength: false;
  if (validStrLength) {
    // define all the possible characters that could go into a string
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";

    // start the final string
    let str = '';
    for (let i = 0; i < validStrLength; i++) {
      // get a random character from the possibleCharacters string
      let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

      str += randomCharacter;
    }
    // return final string
    return str;
  } else {
    return false
  }
}


// send an sms message via twilio
helpers.sendTwilioSms = function (phone, msg, callback) {
  // validate parameters
  let phoneNumber = typeof(phone) === "string" && phone.trim().length === 10 ? phone.trim() : false;
  let message = typeof(msg) === "string" && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim(): false;

  if (phoneNumber && message) {
    // configure the request payload
    let payload = {
      From: config.twilio.fromPhone,
      To: `+254${phoneNumber}`,
      Body: message
    }

    // stringify the payload
    let payloadString = new URLSearchParams(payload).toString();

    // configure the request details
    let requestDetails = {
      protocol: "https:",
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
      auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(payloadString)
      }
    }

    // instantiate the request object
    let req = https.request(requestDetails, function(res) {
      // grab the status of the sent request
      let status = res.statusCode;
      console.log(res.statusMessage);

      // callback successfully if request went through
      if (status === 200 | 201) {
        callback(false);
      } else {
        callback('status code return was', status)
      }
    });

    // bind to the error event so it doesn't get thrown
    req.on("error", function(e) {
      callback(e);
    });

    // add the payload
    req.write(payloadString);

    // end the request
    req.end()
  } else {
    callback('given parameters were missing or invalid');
  }

}


// get the string content of a template
helpers.getTemplate = function(template, data, callback) {
  let templateName = typeof(template) === "string" && template.length > 0 ? template: false;
  let dataObject = typeof(data) === "object" && data !== null ? data : {};

  if (templateName) {
    let templatesDir = path.join(__dirname, "/../templates/");
    fs.readFile(`${templatesDir}${templateName}.html`, "utf8", function(err, str) {
      if (!err && str && str.length > 0) {
        // do the interpolation on the string
        let finalString = helpers.interpolate(str, dataObject)
        callback(false, finalString);
      } else {
        callback("No template could be found");
      }
    })
  } else {
    callback("A valid template name was not specified");
  }
}


// add the universal header and footer to a string, and pass the provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function(str, data, callback) {
  let stringValue = typeof(str) === "string" && str.length > 0 ? str : false;
  let dataObject = typeof(data) === "object" && data !== null ? data : {};

  // get the header
  helpers.getTemplate("_header", dataObject, function(err, headerString) {
    if (!err && headerString) {
      // get the footer
      helpers.getTemplate("_footer", dataObject, function(err, footerString) {
        if (!err && footerString) {
          // add them all together
          let fullString = headerString + stringValue + footerString;
          callback(false, fullString)
        } else {
          callback("could not find the footer template");
        }
      })
    } else {
      callback("could not find the header template");
    }
  })
}


// take a given string and data object and find/replace all the key within it
helpers.interpolate = function(str, data) {
  let stringValue = typeof(str) === "string" && str.length > 0 ? str : false;
  let dataObject = typeof(data) === "object" && data !== null ? data : {};

  // add the templateGlobals to the data object, prepending thier key name with "global"
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      dataObject[`global.${keyName}`] = config.templateGlobals[keyName];
    }
  }

  // for each key in the dataObject, insert its value into the string at the corresponding placeholder
  for (let key in dataObject) {
    if (dataObject.hasOwnProperty(key) && typeof(dataObject[key]) === "string") {
      let replace = dataObject[key];
      let find = `{${key}}`;
      stringValue = stringValue.replace(find, replace);
    }
  }

  return stringValue;
}

// get the contents of static (public) asset
helpers.getStaticAsset = function(assetName, callback) {
  let fileName = typeof(assetName) === "string" && assetName.length > 0 ? assetName : false;
  if (fileName) {
    let publicDir = path.join(__dirname, "/../public/");
    fs.readFile(`${publicDir}${fileName}`, function(err, data) {
      if (!err && data) {
        callback(false, data)
      } else {
        callback("No file could be found");
      }
    })
  } else {
    callback("A valid file name was not specified");
  }
}


// export the module
module.exports = helpers;