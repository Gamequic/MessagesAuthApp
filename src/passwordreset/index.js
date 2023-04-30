const showPasswordButton = document.getElementById('BTshow-password');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const updatePasswordBT = document.getElementById('updatePasswordBT');
const info = document.getElementById('info')

const URLAPI = 'http://192.168.1.78:3000/api/v1/users/resetpassword';

const tokenURL = new URL(window.location.href);
const token = tokenURL.searchParams.get('token');

showPasswordButton.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordConfirmInput.type = 'text';
        showPasswordButton.src = '../icons/hide.svg';
    } else {
        passwordInput.type = 'password';
        passwordConfirmInput.type = 'password';
        showPasswordButton.src = '../icons/show.svg';
    }
});

updatePasswordBT.addEventListener('click', async () => {
    info.textContent = ''
    if (!(passwordInput.value === passwordConfirmInput.value)){
        info.textContent = 'Passwords do not match.';
        return 0;
    }

    const passwordData = {
        password: passwordInput.value,
        token
    }

    const rta = await fetch(URLAPI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
    })
    const data = await rta.json()

    window.location.href='/src/login/'
})
