const express = require('express');
const path = require('path');

const app=express();
const http = require('http').createServer(app)

const drpath = path.join(__dirname,'public');

app.use(express.static(drpath));

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
})

http.listen(3000);




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