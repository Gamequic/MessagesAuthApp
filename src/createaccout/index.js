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
const colorSelector = document.getElementById('color-selector')
const info = document.getElementById('info')

const url = `http://${globals.apiAddress}/api/v1/users`

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

var selectedColor = "#ffffff"
colorSelector.addEventListener('input', (event) => {
    selectedColor = event.target.value;
    photo.style.border = `4px solid ${selectedColor}`;
});

uploadButton.addEventListener('click', () => {
    fileInput.click();
})

let PhotoFile = undefined

fileInput.addEventListener('change', () => {
    info.textContent = ''

    PhotoFile = fileInput.files[0];

    if (!PhotoFile.name.endsWith('.png') && !PhotoFile.name.endsWith('.jpg')) {
        info.textContent = 'Only PNG or JPG files.'
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        photo.src = reader.result;
    });

    reader.readAsDataURL(PhotoFile);
});

usernameInput.value = "Gamequic"
nameInput.value = 'Demian'
lastnameInput.value = 'Calleros'
descricionInput.value = "Soy muy pro"
emailInput.value = 'demiancalleros0@gmail.com'
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
        return;
    }
    if(!(password.length === 8)){
        info.textContent = 'The password must be a minimum of 8 characters.';
        return;
    }

    const data = {
        email,
        password,
        descripcion,
        name,
        lastname,
        username,
        hexaColor: selectedColor
    }

    const rta = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const APIdata = await rta.json();

    if (APIdata.statusCode === 409 || APIdata.statusCode === 400){
        info.textContent = APIdata.errors[0].message;
        return;
    }

    //Primer LogIn
    rtaLogIn = await fetch(url + '/login', {
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
    const token = dataLogIN.userData.token
    let ID = APIdata.id
    
    formData.append('profilePhoto', PhotoFile, 'profile');

    const PhotoUrl = url + `/upload-profilephoto/${ID}`;

    const rtaPhoto = await fetch(PhotoUrl, {
        method: 'POST',
        headers: {
            authHeader: token,
        },
        body: formData,
    });

    const userWithPhoto = await rtaPhoto.json()

    localStorage.setItem('userData', JSON.stringify(userWithPhoto));
    window.location.href='/src/home/'
})

