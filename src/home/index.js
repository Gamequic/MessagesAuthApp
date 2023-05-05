const contactsList = document.getElementById('contactsList');
const nameP = document.getElementById('name')
const profilePhoto = document.getElementById('profilePhoto')
const sendMessageBT = document.getElementById('sendMessageBT');
const inputMessage = document.getElementById('inputMessage');
const chat = document.getElementById('chat');
const noChat = document.getElementById('no_chat');

const messagesContainer = document.getElementsByClassName('messages-container')

var userData = JSON.parse(localStorage.getItem('userData'));
const url = `http://${globals.apiAddress}/api/v1/`;
console.log(userData);
async function main() {
    if (!userData) {
	//window.location.href = '/src/login';
        return;
    }

    const rta = await fetch(url + "users/", {
        method: 'GET',
        headers: {
            'authHeader': userData.token || undefined,
            'Content-Type': 'application/json'
        }
    });
    const data = await rta.json()
    
    if (data.statusCode === 401) {
        window.location.href = '/src/login';
    }

    for (let i in data){
        if (!(data[i].id ===  userData.id)){
            contactsList.innerHTML = contactsList.innerHTML + `<li id='${data[i].id}' onclick='setCurrentChat(this)'>\n<img style="border: 3px solid ${data[i].hexaColor};" src="${data[i].photo}">\n<p class="name">${data[i].username}</p>\n</li>`
        }
    }

    nameP.innerHTML = userData.username;
    profilePhoto.src = userData.photo;
    profilePhoto.style.border = `3px solid ${userData.hexaColor}`;
}

main();

async function getMessages(id) {
    const data = {
        method: 'GET',
        headers: {
            'authheader': userData.token
        },
    }

    const rta = await fetch(url + `messages/chat/${id}`, data);
    const dataRta = await rta.json()
    return dataRta
}

var currentChatID = undefined;
noChat.style.display = 'block'
function setCurrentChat(caller){
    try{
        currentChatID = caller.getAttribute('id');
    } catch {
        currentChatID = caller
    }

    noChat.style.display = 'none';
    chat.style.display = 'block';

    var innerHTML = ''

    getMessages(currentChatID).then((messages) => {
        innerHTML = '<ul class="messages">'

        for (let i in messages){
            const dateObjet = new Date(messages[i].createdAt);
            //Diferenciaciones de dias

            //Poner mensajes en el chat
            if (messages[i].senderId === userData.id){
                var messageClass = "me";
            } else {
                var messageClass = "other";
            }
            innerHTML = innerHTML + `<li class="Message ${messageClass}"><p>${messages[i].content}</p><p class="time">${dateObjet.toLocaleDateString('es-ES')} ${dateObjet.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p></li>`;
        }

        innerHTML + "</ul>";
        messagesContainer[0].innerHTML = innerHTML;
    });
}

async function postMessage(){
    const message = inputMessage.value;

    if (currentChatID === undefined || message === ''){     //No esta seleccionado un chat o no hay mensaje
        console.log("Not message or chat");
        return
    }

    const data = {
        "receiverId": currentChatID,
        "content": message
    }

    const rta = await fetch(url + 'messages/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authheader': userData.token
        },
        body: JSON.stringify(data)
    });
    inputMessage.value = "";
}


sendMessageBT.addEventListener('click', postMessage)

setInterval(() => {
    if (currentChatID) {
        setCurrentChat(currentChatID)
    }
}, 500)

