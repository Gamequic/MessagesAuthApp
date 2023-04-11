const showPasswordButton = document.getElementById('BTshow-password');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');

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

