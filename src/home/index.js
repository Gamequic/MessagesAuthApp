const contactsList = document.getElementById('contactsList');

const token = localStorage.getItem('token');
const url = 'http://localhost:3000/api/v1/users/';

async function main() {
    const rta = await fetch(url, {
        method: 'GET',
        headers: {
            'authHeader': token,
            'Content-Type': 'application/json'
        }
    });
    const data = await rta.json()
    
    if (data.statusCode === 401) {
        window.location.href = '/src/login';
    }

    for (let i in data){
        contactsList.innerHTML = contactsList.innerHTML + `<li>\n<img src="${data[i].photo}">\n<p class="name">${data[i].name} ${data[i].lastname}</p>\n</li>`
    }
}

main();