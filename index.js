const express = require("express");
const ws = require("ws");
const server = express()
    .use((req, res) => res.send("Something fun"))
    .listen(process.env.PORT, () => console.log("listening on 80"));

const wss = new ws.Server({server});
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('close', () => console.log('Client disconnected'));
  });