while [ "$(docker inspect -f '{{.State.Health.Status}}' $(docker ps --last 1 --format '{{.Names}}'))" != "healthy" ];
do 
  sleep 1
done