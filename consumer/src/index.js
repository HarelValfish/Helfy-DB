const { Kafka } = require('kafkajs');
const { logEvent } = require('./logger');

const kafka = new Kafka({
  clientId: 'cdc-consumer',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'cdc-consumer-group' });

const topics = ['appdb.appdb.users', 'appdb.appdb.user_tokens'];

const opNames = {
  c: 'INSERT',
  u: 'UPDATE',
  d: 'DELETE',
  r: 'READ'
};

async function run() {
  await consumer.connect();

  for (const topic of topics) {
    await consumer.subscribe({ topic: topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) {
        return;
      }

      const payload = JSON.parse(message.value.toString());

      if (!payload || !payload.payload) {
        return;
      }

      const change = payload.payload;

      logEvent({
        action: opNames[change.op] || change.op,
        table: change.source.table,
        database: change.source.db,
        before: change.before,
        after: change.after
      });
    }
  });
}

run();