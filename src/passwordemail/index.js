const inputEmail = document.getElementById('email')
const sendMailbt = document.getElementById('sendMailbt')
const info = document.getElementById("info")

const url = "http://localhost:3000/api/v1/users/askresetpassword"

inputEmail.value = 'demiancalleros0@gmail.com';

sendMailbt.addEventListener('click', async () => {
    const email = inputEmail.value;
    sendMailbt.classList.add('loading');
    sendMailbt.disabled = true;

    info.textContent = 'Sending mail'
    setInterval(() => {
        if (info.textContent === 'Sending mail...'){
            info.textContent = 'Sending mail'
        }
        info.textContent += '.'
    }, 500)

    const rta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({
                email
            }
        )
    })
    const data = await rta.json();

    if (data.statusCode === 400) {  //Bad request
        sendMailbt.classList.remove('loading');
        sendMailbt.disabled = false;
        info.textContent = 'Bad request'
        return 0
    }

    if (data.statusCode === 404) {  //User not found
        sendMailbt.classList.remove('loading');
        sendMailbt.disabled = false;
        info.textContent = 'User not found'
        return 0
    }

    if (data.rta === 'Email sent'){ //Email sent
        window.location.href = '/src/emailsent/'
    }
})
//onclick="window.location.href='/src/emailsent/'"