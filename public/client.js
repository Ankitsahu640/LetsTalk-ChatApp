const socket = io();


const msgbox = document.getElementById("msg_box");


const appendMessage =(msg,pos)=>{
    if(msg.message.trim()==""){
        return;
    }
    const messageElement = document.createElement('div');
    let html=`  <h6>${msg.user}</h6>
                <p>${msg.message}</p> `;
    messageElement.innerHTML=html;
    messageElement.classList.add("msg",pos);
    
    msgbox.appendChild(messageElement);
    scrollEnd();
}


const appendInfo = (nam,info,color)=>{
    const msgElement = document.createElement('div');
    let html = `<p><i>${nam}: ${info}</i></p>`;
    msgElement.innerHTML=html;
    msgElement.classList.add("msginfo",color);

    msgbox.appendChild(msgElement);
}


const appendPeople = (users)=>{
    console.log(users);
    const onlineList = document.getElementById("online-list");
    let html="";
    const users_arr = Object.values(users);
    for(i=0;i<users_arr.length;i++){
        html = html + `<li>${users_arr[i]}</li>`;
    };
    onlineList.innerHTML=html;

    const badge = document.getElementById("badge");
    badge.innerText = users_arr.length;
}


const scrollEnd = ()=>{
    msgbox.scrollTop = msgbox.scrollHeight;
}

// -----------------------------------------------------------------------------------------------//

console.log("welcome");
let nam;
do{
    nam = prompt("enter your name to join");
}while(!nam)
socket.emit('new-user-joined',nam);

socket.on('user-joined',data=>{
    console.log(data,"user-joined");
    appendInfo(data,"joined the chat","green");
})

socket.on("online-users",users=>{
    appendPeople(users);
})



let msginput = document.getElementById("msg_value");
let bttn = document.getElementById('bttn');

bttn.addEventListener('click',(e)=>{
    e.preventDefault();
    const msg = {
        user: nam,
        message: msginput.value
    };
    appendMessage(msg,"right");
    socket.emit('send',msg.message);
    msginput.value="";
})

socket.on("recive",msg=>{
    appendMessage(msg,"left");
    scrollEnd();
})

socket.on("user-left",nam =>{
    appendInfo(nam,"left the chat","red");
    scrollEnd();
})


