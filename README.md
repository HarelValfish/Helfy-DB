# DevOps Home Test Assignment

Full stack app with authentication, MySQL, Kafka, and Debezium CDC. Built for a DevOps take home test, kept intentionally simple, this is a skills demo, not a product.

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