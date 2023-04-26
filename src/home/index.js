const contactsList = document.getElementById('contactsList');
const nameP = document.getElementById('name')
const profilePhoto = document.getElementById('profilePhoto')
const sendMessageBT = document.getElementById('sendMessageBT');
const inputMessage = document.getElementById('inputMessage');

const messagesContainer = document.getElementsByClassName('messages-container')

console.log(messagesContainer)

//const 

const userData = JSON.parse(localStorage.getItem('userData'));
const url = 'http://localhost:3000/api/v1/';

async function main() {
    const rta = await fetch(url + "users/", {
        method: 'GET',
        headers: {
            'authHeader': userData.token,
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

var currentChatID = undefined;
function setCurrentChat(caller){
    currentChatID = caller.getAttribute('id');


}

sendMessageBT.addEventListener('click', async () => {
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
})

async function getMessages(id) {
    const data = {
        method: 'GET',
        headers: {
            'authheader': userData.token
        },
    }

    const rta = await fetch(url + `messages/chat/${id}`, data);
    const dataRta = await rta.json()
}
