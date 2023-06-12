'use strict';

(function() {

    function checkLogin(e) {

        e.preventDefault();
        const username = loginForm.username.value;
        const pass = loginForm.password.value;

        if ((username === 'user') && (pass === 'pass')) {
            alert('You have successfully logged in.');
            location.reload();
        } else {
            errorMsg.style.opacity = 1;
        }
    }

    const loginForm = document.getElementById('login-form');
    const submit = document.getElementById('login-form-submit');
    const errorMsg = document.getElementById('login-error-msg-holder');

    submit.addEventListener('click', checkLogin, false);
})();
