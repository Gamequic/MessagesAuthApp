const inputEmail = document.getElementById('email')
const sendMailbt = document.getElementById('sendMailbt')
const info = document.getElementById("info")

const url = `http://${globals.apiAddress}/api/v1/users/askresetpassword`

inputEmail.value = 'demiancalleros0@gmail.com';

sendMailbt.addEventListener('click', async () => {
    const email = inputEmail.value;
    sendMailbt.classList.add('loading');
    sendMailbt.disabled = true;

    info.textContent = 'Sending mail'
    const Interval = setInterval(() => {
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

    if (data.statusCode === 400 || data.statusCode === 404) {   //Error
        sendMailbt.classList.remove('loading');
        sendMailbt.disabled = false;
        clearInterval(Interval)
    }

    if (data.statusCode === 400) {  //Bad request
        info.textContent = 'Bad request'
        return
    }

    if (data.statusCode === 404) {  //User not found
        info.textContent = 'User not found'
        return
    }

    if (data.rta === 'Email sent'){ //Email sent
        window.location.href = '/src/emailsent/'
    }
})
//onclick="window.location.href='/src/emailsent/'"