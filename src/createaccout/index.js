const usernameInput = document.getElementById('username')
const nameInput = document.getElementById('name')
const lastnameInput = document.getElementById('lastname')
const descricionInput = document.getElementById('descricion')
const showPasswordButton = document.getElementById('BTshow-password');
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const photo = document.getElementById('photo')
const fileInput = document.getElementById('photoFileInput')
const uploadButton = document.getElementById('photoUploadButton')
const createBT = document.getElementById('createBT')
const info = document.getElementById('info')

const url = 'http://localhost:3000/api/v1/users'

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

uploadButton.addEventListener('click', () => {
    fileInput.click();
})

let PhotoFile = undefined

fileInput.addEventListener('change', () => {
    info.textContent = ''

    PhotoFile = fileInput.files[0];

    if (!PhotoFile.name.endsWith('.png')) {
        info.textContent = 'Only PNG files.'
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        photo.src = reader.result;
    });

    reader.readAsDataURL(PhotoFile);
});

usernameInput.value = "Fresa"
nameInput.value = 'Alexa'
lastnameInput.value = 'Delgado'
descricionInput.value = "Soy muy nuv"
emailInput.value = 'alexadelgado1345@gmail.com'
passwordInput.value = '12345678'
passwordConfirmInput.value = '12345678'

createBT.addEventListener('click', async () => {
    const username = usernameInput.value
    const name = nameInput.value
    const lastname = lastnameInput.value
    const descripcion = descricionInput.value
    const email = emailInput.value
    const password = passwordInput.value
    const passwordConfirm = passwordConfirmInput.value

    info.textContent = ''

    if (!(password === passwordConfirm)){
        info.textContent = 'Passwords do not match.';
        return 0
    }

    const data = {
        email,
        password,
        descripcion,
        name,
        lastname,
        username
    }

    const rta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const APIdata = await rta.json();

    if (APIdata.statusCode === 409){
        info.textContent = APIdata.errors[0].message
        return 0;
    }

    //Primer LogIn
    rtaLogIn = await fetch('http://localhost:3000/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                email,
                password
            })
    })
    const dataLogIN = await rtaLogIn.json();

    const formData = new FormData();

    const token = dataLogIN.token
    let ID = APIdata.id
    formData.append('profilePhoto', PhotoFile, 'profile.png');

    const PhotoUrl = `http://localhost:3000/api/v1/users/upload-profilephoto/${ID}`;

    fetch(PhotoUrl, {
        method: 'POST',
        headers: {
            authHeader: token,
        },
        body: formData,
    });

    localStorage.setItem('token', token);
    window.location.href='/src/home/'
})

