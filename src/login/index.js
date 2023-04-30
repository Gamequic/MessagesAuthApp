const showPasswordButton = document.getElementById('BTshow-password');
const passwordInput = document.getElementById('password');
const LogInBT = document.getElementById('LogInBT');
const emailInput = document.getElementById('emailInput');
const info = document.getElementById('info')

const url = 'http://192.168.1.78:3000/api/v1/users/login'

emailInput.value = 'demiancalleros0@gmail.com'
passwordInput.value = '123456789'

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

    if (data.statusCode === 401){   //Unauthorized
        info.textContent = 'No account was found'
        return
    }

    localStorage.setItem('userData', JSON.stringify(data.userData));
    window.location.href='/src/home/'
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

