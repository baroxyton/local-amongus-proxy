# amongus-proxy
A proxy to try to understand the among us protocol
## Credits
The broadcasting part of my code originally was written in  [this project](https://github.com/NickCis/among-us-proxy) by @NickCis
# purpose
the purpose of this is to decipher the among us protocol, create a documentation and allow the community to create servers and more. If you find anything out, you can pull a request and add it to the documentation below
## requirementy
1. nodejs on a computer
2. 2 or more devices with among us installed
3. the devices and the computer are in the same network
## how to use
1. look up the internal ips of the devices
2. start a local among us game on one of the two devices
3. use the devices internal ips in the config. The ip of the device where the local game is started should be in the "server"-field
4. join the local game named "proxy" on the other device
# Among us documentation
### Packet 0x09 from the server
forcefully disconnect the client from the server
### Packet 0x09 from the client
disconnect from the server
### Packets that start with 0x0a or 0x0c
Heartbeat, always counts up from both server and client; it's unclear if it serves any other purpose
