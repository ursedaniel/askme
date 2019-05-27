const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require('http');


const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};


const port = process.env.PORT || '3000';
app.set('port', port);


const server = http.createServer(app);
// Socket.io for real time communication
var io = require('socket.io').listen(server);
server.listen(port, () => console.log(`API running on localhost:${port}`));

app.io.attach(server);


