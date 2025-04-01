FROM node:22

RUN apt update && \
    apt install -y openjdk-17-jdk openjdk-17-source 
RUN apt install make g++
RUN npm i -g java --unsafe-perm
RUN npm config set registry https://registry.npmjs.org/ \
    && rm -rf node_modules package-lock.json \
    && npm cache clean --force \
    && npm install ts-node typescript jest nodemon --unsafe-perm --legacy-peer-deps
RUN npm install -g fern-api
RUN chmod +x /usr/local/lib/node_modules/java && \
    npm rebuild

WORKDIR /usr/src/app
