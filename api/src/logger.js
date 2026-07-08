const log4js = require('log4js');

log4js.configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'messagePassThrough' } }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' }
  }
});

const logger = log4js.getLogger();

function logEvent(fields) {
  logger.info(JSON.stringify({
    timestamp: new Date().toISOString(),
    userId: fields.userId,
    action: fields.action,
    ip: fields.ip
  }));
}

module.exports = { logEvent };