#!/bin/sh

#!/bin/sh

sleep 15

curl -X POST -H "Content-Type: application/json" \
  http://connect:8083/connectors/ \
  -d @/debezium/connector-config.json

STATUS=$(cat /tmp/status.txt)

if [ "$STATUS" = "201" ]; then
  echo "Connector registered"
elif [ "$STATUS" = "409" ]; then
  echo "Connector already registered"
else
  echo "Something went wrong, status $STATUS"
  cat /tmp/response.txt
fi