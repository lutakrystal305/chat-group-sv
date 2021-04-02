require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const pass= process.env.PASSWORD;
const userRouter = require("./route/user.route");
const chatRouter = require('./route/chat.route');
const User = require("./models/user.model");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(`mongodb+srv://lutakrystal305:${pass}@cluster0.ksoml.mongodb.net/chat?authSource=admin&replicaSet=atlas-1ht9s4-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true`)





const server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
    origin: "https://kmess.herokuapp.com",
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
app.use('/user', userRouter);
app.use('/chat', chatRouter);
const port = process.env.PORT || 9999; 
server.listen(port, () => {
    console.log("listen on port 9999!");
})
const usersOnline = [];
io.on("connection", (socket) => {
    console.log(socket.id+'da CONNECT');
    socket.on('user-connect', ({ user }) => {
        console.log('nice!!');
        console.log(user);
        if (usersOnline.indexOf(user) === -1) {
            usersOnline.push(user);
            socket._id = user._id;
            socket.userName = user.name;
            socket.user = user;
            io.sockets.emit('server-send-users-online', usersOnline);
        } else {
            io.sockets.emit('server-send-users-online', usersOnline);
        }
    })
    socket.on('client-join-rooms', (data) => {
        if (data) {
            data.forEach((x) => {
                socket.join(x._id);
            })
        }
    })
    socket.on('client-send-room-now', (data) => {
        if (data) {
            socket.join(data._id);
        }
        socket.roomNow = data;
        console.log(socket.roomNow._id);
        socket.emit('server-send-room-now', socket.roomNow);
    })
    socket.on('client-send-message', (data) => {
        console.log(data.message);
        io.sockets.in(data.to._id).emit('server-send-message', {from: data.from, message: data.message, to: data.to, date: data.date, img: data.img});
    })
    socket.on('client-leave-room', (data) => {
        if (data) {
            socket.leave(data._id)
        }
        socket.broadcast.to(data._id).emit('server-send-message', {from: {name: 'key'}, message: `${socket.user.name} has just leave room!`, to: data, date: Date.now()});
    })
    socket.on('disconnect', () => {
        let z=usersOnline.indexOf(socket.user);
        usersOnline.splice(z,1);
        socket.broadcast.emit('server-send-users-online', usersOnline);
    })
})
app.get("/", (req, res) => {
    res.send('hello');
})
