# DevOps Home Test Assignment

Full stack app with authentication, MySQL, Kafka, and Debezium CDC. Built for a DevOps take home test.

## Stack

- Backend: Node.js, Express
- Frontend: plain HTML, no framework
- Database: MySQL 8, binlog enabled for CDC
- Message queue: Apache Kafka
- CDC: Debezium MySQL connector, running inside Kafka Connect
- Logging: log4js, structured JSON
- Everything runs in Docker, one command starts the whole thing

## Requirements

- Docker
- Docker Compose

## Setup

Copy the example env file and fill in real values:

```
cp .env.example .env
```

Edit `.env` and set your own passwords for `MYSQL_ROOT_PASSWORD` and `DEBEZIUM_PASSWORD`. `.env` is gitignored, it never gets committed.

## Running it

```
docker-compose up --build
```

First run takes a couple minutes, it pulls MySQL, Zookeeper, Kafka, and Kafka Connect, and builds the api, client, and consumer images.

On first startup, MySQL automatically runs everything in `db/init/`, in order:
- `01-schema.sql` creates the `users` and `user_tokens` tables
- `02-debezium-user.sh` creates a dedicated `debezium` MySQL user with just enough access to read the binlog
- `03-seed.sql` inserts a default admin user

The `connect-register` service automatically registers the Debezium connector with Kafka Connect once it's ready, no manual steps needed.

## URLs

- Login page: http://localhost:8080
- API: http://localhost:3000
- Kafka Connect REST API: http://localhost:8083

## Default login

- Username or email: admin
- Password: password123

## What to look at

**Login flow**: open the login page, log in with the default user. The API checks the password, generates a token, stores it in `user_tokens`, and returns it. The page stores the token and sends it back as an `Authorization` header when calling the protected `/me` route.

**Login logging**:
```
docker-compose logs -f api
```
Every login prints one structured JSON line, timestamp, user ID, action, IP address.

**Database change monitoring**:
```
docker-compose logs -f connect
```
Debezium reading MySQL's binlog and forwarding row changes into Kafka.

**Real time processing**:
```
docker-compose logs -f consumer
```
Every insert, update, or delete on `users` or `user_tokens` shows up here as one structured JSON line, action, table, and the before/after values.

## Project layout

```
docker-compose.yml
.env.example
db/
  my.cnf
  init/
    01-schema.sql
    02-debezium-user.sh
    03-seed.sql
debezium/
  connector-config.json
  register-connector.sh
api/
  Dockerfile
  package.json
  src/
    index.js
    db.js
    logger.js
    routes/auth.js
    middleware/auth.js
client/
  Dockerfile
  public/index.html
consumer/
  Dockerfile
  package.json
  src/
    index.js
    logger.js
```

## Notes

- Tokens are random strings, not JWTs, stored in the database and checked against it on every authenticated request.
- Passwords are hashed with bcrypt before storage.
- Real secrets only ever live in `.env`. `connector-config.json` holds a placeholder instead of a real password, substituted at runtime by `register-connector.sh`.
- The `debezium` MySQL user only has replication read access, not access to the actual application data.

## Stopping / resetting

```
docker-compose down -v
```

The `-v` also removes MySQL's data volume, so the next `up` does a completely fresh init, tables, users, and the Debezium connector all get recreated from scratch.
