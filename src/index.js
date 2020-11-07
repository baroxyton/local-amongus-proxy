let config = {
    name:"proxy",
    players:"fake",
    client:"192.168.0.11",
    server:"192.168.0.24",
    clientPort:0,
    serverPort:22023
}
const udp = require('dgram');
const dgram = udp
let fakeServer = dgram.createSocket('udp4');
let fakeClient = dgram.createSocket('udp4');
fakeServer.bind(config.serverPort);
function sendClient(data){
fakeServer.send(data,config.clientPort,config.client)
}
function sendServer(data){
fakeClient.send(data,config.serverPort,config.server)
}
function proxyDiscovery(){
    const discovery = (this.discovery = dgram.createSocket('udp4'));
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
function stringToHex(str) {
    return Buffer.from(str).toString("hex")
   }
   fakeServer.on("message",function(msg,info){
config.clientPort=info.port;
console.log(msg.toString() + " or "+msg.toString("hex"),"from client to server")
sendServer(msg)
if(msg.toString().includes("disconnect")){
    sendClient("\x09")
}
   })
   fakeClient.on("message",function(msg,info){
    console.log(msg.toString() + " or "+msg.toString("hex"),"from server to client")
    sendClient(msg)
   })
   proxyDiscovery()
