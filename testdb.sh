#!/bin/bash
while [ "$(docker inspect -f '{{.State.Health.Status}}' $(docker ps --last 1 --format '{{.Names}}'))" != "healthy" ];
do 
  docker-compose logs db
  sleep 1
done