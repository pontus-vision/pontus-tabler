FROM node:22

RUN apt update && \
    apt install -y openjdk-17-jdk make g++ netcat-traditional net-tools curl tar unzip

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV HIVE_VERSION=3.1.3
ENV HADOOP_VERSION=3.3.1
ENV HIVE_HOME=/opt/hive
ENV HADOOP_HOME=/opt/hadoop
ENV PATH=$PATH:$HIVE_HOME/bin:$HADOOP_HOME/bin

RUN curl -LO https://archive.apache.org/dist/hive/hive-${HIVE_VERSION}/apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    tar -xzf apache-hive-${HIVE_VERSION}-bin.tar.gz && \
    mv apache-hive-${HIVE_VERSION}-bin /opt/hive && \
    rm apache-hive-${HIVE_VERSION}-bin.tar.gz

RUN curl -LO https://archive.apache.org/dist/hadoop/core/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz && \
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz && \
    mv hadoop-${HADOOP_VERSION} /opt/hadoop && \
    rm hadoop-${HADOOP_VERSION}.tar.gz

RUN npm cache clean --force
RUN npm i -g java --unsafe-perm && \
    npm install -g ts-node typescript jest nodemon fern-api && \
    chmod +x /usr/local/lib/node_modules/java

WORKDIR /usr/src/app

