FROM node:22

RUN apt update && \
    apt install -y openjdk-17-jdk openjdk-17-source 
RUN apt install -y make g++ netcat-traditional net-tools

RUN npm i -g java --unsafe-perm
RUN npm install -g ts-node typescript jest nodemon
RUN npm install -g fern-api
RUN chmod +x /usr/local/lib/node_modules/java && \
    npm rebuild

WORKDIR /usr/src/app
