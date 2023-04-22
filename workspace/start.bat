@echo off
start cmd /k "cd socket.io && nodemon app"
start cmd /k "cd TreeHole-api && nodemon app"
start cmd /k "cd TreeHole && yarn dev"
start cmd /k "cd TreeHole-admin && yarn dev"