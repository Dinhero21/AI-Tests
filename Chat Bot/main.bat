@echo off
echo LOADING MAIN.JS IN NODE.JS
node main.js
COLOR 0C
echo NODE.JS ENDED THE PROGRAM OR CRASHED
echo THE ERROR CAN BE SEEN ABOVE
echo THIS WINDOW WILL CLOSE IN 1 MINUTE
TIMEOUT /T 60 /NOBREAK > NUL
