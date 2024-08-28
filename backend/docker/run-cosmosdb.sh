docker run \
    --publish 8081:8081 \
    --publish 10250-10255:10250-10255 \
    --interactive \
    --tty \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest    

