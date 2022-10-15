const express = require('express');
const path = require('path');

let port = process.env.PORT || 1234;

const app=express();
const http = require('http').createServer(app);

app.use(express.static(__dirname));

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

http.listen(port);




const io= require('socket.io')(http);

const users={};
io.on('connection', socket =>{
    socket.on("new-user-joined", name =>{
        console.log(name,"just joined");
        users[socket.id]=name;
        socket.broadcast.emit("user-joined",name);
        socket.emit("online-users",users);
        socket.broadcast.emit("online-users",users);
    })
    socket.on("send", message =>{
        socket.broadcast.emit("recive",{user: users[socket.id],message: message});
    })
    socket.on("disconnect",()=>{
        socket.broadcast.emit('user-left',users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit("online-users",users);
    })
})