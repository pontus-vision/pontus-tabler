FROM node:18

RUN apt update && \
    apt install -y openjdk-17-jdk openjdk-17-source 
RUN npm install -g ts-node typescript jest

WORKDIR /usr/src/app