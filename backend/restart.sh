#!/bin/bash
fuser -k 8080/tcp && nohup java -jar demo-0.0.1-SNAPSHOT.jar > nohup.log 2>&1 &