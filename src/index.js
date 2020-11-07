let config = {
  //The shown name of the local proxy game
  name:"proxy",
  //the shown amount of players, also can be a string
  players:"fake",
  //ip of the device that will act as the client
  client:"192.168.0.11",
  //ip of the device that will act as the servere
  server:"192.168.0.24",
  //The clients port is not always the same. It will be changed when the client joins
  clientPort:0,
  //always the server port, don't change
  serverPort:22023,
  showKeepalive:false
}
//require udp and create sockets
const udp = require('dgram');
let fakeServer = udp.createSocket('udp4');
let fakeClient = udp.createSocket('udp4');
//start server on server port
fakeServer.bind(config.serverPort);
//Send data to client
function sendClient(data){
fakeServer.send(data,config.clientPort,config.client)
}
//send data to the server
function sendServer(data){
fakeClient.send(data,config.serverPort,config.server)
}
//broadcasts a discovery message; not mine
function proxyDiscovery(){
  const discovery = (this.discovery = udp.createSocket('udp4'));
const message = Buffer.from(
    `0402${stringToHex(config.name)}7e4f70656e7e${stringToHex(
      `${config.players}`
    )}7e`,
    'hex'
  );
discovery.bind(() => {
    this.discoveryInterval = setInterval(() => {
      // 192.168.1.255
      discovery.send(message, "47777", "192.168.0.11");
    }, 1000);
  });
}
//0b to 0x
function stringToHex(str) {
  return Buffer.from(str).toString("hex")
 }
//listen to messages sent to the proxy server and sends them to the real one. When a player writes "disconnect" he will get a disconnection packet by the proxy
 fakeServer.on("message",function(msg,info){
config.clientPort=info.port;
logEvent(0,msg)
if(msg.toString().includes("disconnect")){
  sendClient("\x09")
  return
}
sendServer(msg)
 })
//forwards messages by the server to the client
 fakeClient.on("message",function(msg,info){
  logEvent(1,msg)
  sendClient(msg)
 })
//Send discovery message to client
 proxyDiscovery()
 //log events from the server and client
 let senders = ["client","server"]
 function logEvent(sender,msg){
   let texts = [msg.toString(),msg.toString("hex")]
   let isHeartbeat = ["0c","0a"].includes(texts[1].slice(0,2))
   let fromServer = sender
   let textSender = `the ${senders[sender]}`
   let text = `package bin ${texts[0]} hex ${texts[1]} was sent from ${textSender}`;
   if(isHeartbeat){
 text = `heartbeat ${texts[1]} was sent from ${textSender}`
   }
   if(!config.showKeepalive&&isHeartbeat){
return
   }
   console.log(text)
 }
