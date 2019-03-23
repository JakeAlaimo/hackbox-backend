# Hackbox Backend
This is the hackbox backend built with socket.io

## Game Client Messages
"request room" - When sent, sets up a new room using a random four character identifier. Returns the code.

## Web Client Messages
"join" - Joins a room. The room code must be provided in the payload from the client. Returns true/false depending if the room was able to be joined.

