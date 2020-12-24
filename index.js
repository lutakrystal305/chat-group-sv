require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const pass= process.env.PASSWORD;
const loginRouter = require("./route/login.route");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(`mongodb+srv://lutakrystal305:${pass}@cluster0.ksoml.mongodb.net/chat?authSource=admin&replicaSet=atlas-1ht9s4-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true`)





const server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors());

app.use(function(req, res, next) { 
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*'); 
    res.header('Access-Control-Allow-Credentials', 'true'); 
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); 
    res.header('Access-Control-Expose-Headers', 'Content-Length'); 
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range'); 
    if (req.method === 'OPTIONS') { 
    return res.send(200); 
    } else { 
    return next(); 
    } 
});
app.use('/user', loginRouter) 
server.listen(9999, () => {
    console.log("listen on port 9999!");
})
const userOnline = [];
io.on("connection", (socket) => {
    console.log(socket.id+'da CONNECT');
    socket.on('login', (data) => {
        console.log(socket.id+'da login');
        if (userOnline.indexOf(data) < 0) {
            userOnline.push(data);
            socket.userName = data;
            socket.emit('login-success', data)
            io.sockets.emit('server-send-users-online', userOnline);
        } else {
            socket.emit('login-fail') 
        }
    })
    socket.on('client-send-room', (data) => {
        console.log(data);
        socket.join(data);
        if (socket.yourRooms) {
            socket.yourRooms.push(data);
        } else {
            socket.yourRooms = [data];
        }
        socket.roomNow = data
        console.log(socket.rooms);
        socket.emit('server-send-room-now', socket.roomNow);
        socket.emit('server-send-your-rooms', socket.yourRooms);
    })
    socket.on('client-change-room', (data) => {
        socket.roomNow = data;
        socket.emit('server-send-room-now', socket.roomNow);
    })
    socket.on('client-send-chat', (data) => {
        io.sockets.in(socket.roomNow).emit('server-send-chat', {user: socket.userName, message: data});
    })
    socket.on('logout', () => {
        let z=userOnline.indexOf(socket.userName);
        userOnline.splice(z,1);
        socket.broadcast.emit('server-send-users-online', userOnline);
    })
    socket.on('disconnect', () => {
        let z=userOnline.indexOf(socket.userName);
        userOnline.splice(z,1);
        socket.broadcast.emit('server-send-users-online', userOnline);
    })
})
app.get("/", (req, res) => {
    res.send('hello');
})
