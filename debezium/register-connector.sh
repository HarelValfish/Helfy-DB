#!/bin/sh

sleep 15

sed "s/REPLACE_ME/$DEBEZIUM_PASSWORD/" /debezium/connector-config.json > /tmp/connector-config.json

curl -X POST -H "Content-Type: application/json" \
  http://connect:8083/connectors/ \
  -d @/tmp/connector-config.json