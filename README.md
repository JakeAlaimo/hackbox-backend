# Hackbox Backend
This is the hackbox backend built with socket.io. It's only a mirror of what is on heroku, therefore, pushing to this will have no effect on the backend.

## Messages
### From Browser
**join room** - Add the socket to the room. Payload: 
```js
{
  "roomcode": "ABCD"
}
```
**start game** - Starts the game. Payload:
```js
{
  "roomcode": "ABCD"
}
```
**enter submission** - Informs the server of a new submission.
```js
{
  "roomcode": "ABCD",
  "submission": "Submission Text"
}
```
**vote** - Sends in a vote. Payload: 
```js
{
  "roomcode": "ABCD",
  "votee": 0 // 0 indicates player 1, 1 indicates player 2
}
```
## From Unity
**request room** - Requests a new room. Payload: None


## To Unity
**request room** - Returns the room code. Payload: 
```js
{
  "roomcode": "ABCD"
}
```
**start game** - Returns the room code. Payload: 
```js
{
  "category": "category_name",
  "player1Name": "Name",
  "player2Name": "Name"
}
```
**vote** - Returns the vote status. Payload: 
```js
{
  "percentage": 0 // 0 -> 1
}
```
## From Server

**timeout** - Sends the room code. Payload: None

**time changed** - Sends the new time. Payload: 
```js
{
  "time": 59
}
```

