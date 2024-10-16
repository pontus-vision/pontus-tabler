FROM node:22

RUN apt update && \
    apt install -y openjdk-17-jdk openjdk-17-source 
RUN apt install make g++
RUN npm i -g java --unsafe-perm
RUN npm install -g ts-node typescript jest 


WORKDIR /usr/src/app