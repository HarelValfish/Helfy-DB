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
    action: fields.action,
    table: fields.table,
    database: fields.database,
    before: fields.before,
    after: fields.after
  }));
}

module.exports = { logEvent };