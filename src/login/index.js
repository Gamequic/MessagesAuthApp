const showPasswordButton = document.getElementById('BTshow-password');
const passwordInput = document.getElementById('password');
const LogInBT = document.getElementById('LogInBT');
const emailInput = document.getElementById('emailInput');
const info = document.getElementById('info')

const url = `http://${globals.apiAddress}/api/v1/users/login`

emailInput.value = 'demiancalleros0@gmail.com'
passwordInput.value = '12345678'

LogInBT.addEventListener('click', async () => {
    email = emailInput.value;
    password = passwordInput.value;
    rta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email,
                password
            })
    })
    const data = await rta.json();

    console.log(data);

    if (data.statusCode === 404 || data.statusCode === 401){   //User not found, Unauthorized
        info.textContent = 'No account was found'
        return
    }

    localStorage.setItem('userData', JSON.stringify(data.userData));
    window.location.href='/src/home/';
})

showPasswordButton.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordButton.src = '../icons/hide.svg';
    } else {
        passwordInput.type = 'password';
        showPasswordButton.src = '../icons/show.svg';
    }
});

