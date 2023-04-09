const showPasswordButton = document.getElementById('BTshow-password');
const passwordInput = document.getElementById('password');

showPasswordButton.addEventListener('click', function() {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        showPasswordButton.src = '../icons/hide.svg';
    } else {
        passwordInput.type = 'password';
        showPasswordButton.src = '../icons/show.svg';
    }
});

