'use strict';

const AppErr = require('punch-error');

const ERROR = {
  TypeError: {status: 400},
  GENERIC: {status: 500, message: 'Database error.'}
};

const HANDLERS = {
  SequelizeDatabaseError: (err, resource) => {
    let message = `[${resource} Error] ${err.message}`;
    return {status: 500, message};
  },
  SequelizeValidationError: (err, resource) => {
    let message = `[${resource} Error] `;
    if (err.errors && err.errors.length) {
      message += err.errors.map(err => {
        let message = err.message;
        if (err.path) message = `${err.path}: ${message}`;
        if (err.type) message = `${message} (${formatCase(err.type)})`;
        return message;
      }).join(', ');
    }
    return {status: 400, message};
  },
  SequelizeForeignKeyConstraintError: (err, resource) => {
    // Attempt to get foreign key field from message:
    let message = err.message;
    const match = err.message.match(/foreign\s+key\s*\(\`[^\s]+\`\)/ig);
    if (match) message = match.join(', ');
    return {
      status: 400,
      message: `[${resource} Error] Foreign Key Constraint failed (${message || err.index})`
    }
  },
  SequelizeUniqueConstraintError: (err, resource) => {
    let message = `[${resource} Error] `;
    if (err.errors && err.errors.length) {
      message += err.errors.map(err => {
        let message = err.message;
        if (err.path) message = `${err.path}: ${message}`;
        if (err.type) message = `${message} (${formatCase(err.type)})`;
        return message;
      }).join(', ');
    }
    return {status: 400, message};
  }
};

const RE = /[A-Z]/;

function handleErrors(err, resource) {
  resource = formatCase(resource);
  
  if (err && err.name) {
    if (HANDLERS[err.name]) return AppErr.reject(null, HANDLERS[err.name](err, resource)); 
  }
  let message = '';
  if (resource) message += `${resource} Error: `;
  let error = ERROR[err.name] || ERROR.GENERIC;
  if (err.errors && err.errors.length) {
     error.message = message + err.errors.map(err => {
      let message = err.message;
      if (err.path) message = `${err.path}: ${message}`;
      if (err.type) message = `${message} (${formatCase(err.type)})`;
      return message;
    }).join(', ');
  } else {
    // Error is not a DB error but a sequelize error (to be investigated further)
    console.log('Suppressing DB error', err, err.stack);
    return AppErr.reject(err, ERROR.GENERIC);
  }

  return AppErr.reject(err, error);
}

function formatCase(resource) {
  return resource.split(/\-+|\s+/g).map(string => {
    let formatted = string[0].toUpperCase();
    let previousCapital = false;
    for (let i = 1; i < string.length; i++) {
      if (!string[i].match(RE)) {
        previousCapital = false;
      } else {
        if (!previousCapital) formatted += ' ';
        previousCapital = true;
      }
      formatted += string[i];
    }
    return formatted;
  }).join(' ');
}


module.exports = handleErrors;
