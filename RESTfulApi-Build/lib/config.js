/*
* create and export configuration variables
*
*/

// container for all environment
const environments = {};


// staging [default] environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: "thisIsASecretHash",
  maxChecks: 5,
  twilio : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany Inc",
    yearCreated: "2022",
    baseUrl: "http://localhost:3000/"
  }
};

// testing environment
environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'testing',
  hashingSecret: "thisIsASecretHash",
  maxChecks: 5,
  twilio : {
    'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
    'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
    'fromPhone' : '+15005550006'
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany Inc",
    yearCreated: "2022",
    baseUrl: "http://localhost:3000/"
  }
};

// production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: "thisIsASecretProdHash",
  maxChecks: 5,
  twilio: {
    accountSid: "",
    authToken: "",
    fromPhone: ""
  },
  templateGlobals: {
    appName: "UptimeChecker",
    companyName: "NotARealCompany Inc",
    yearCreated: "2022",
    baseUrl: "http://localhost:5000/"
  }
};

// determin which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase(): '';

// check if current environment is one of the environment above, if not default to staging
const environmentToExport = typeof(environments[currentEnvironment]) ===  'object' ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport;
