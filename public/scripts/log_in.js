// data from the log-in form (orientation: portrait)
const loginFormP = document.querySelector('#login-form-p');
const emailLoginP = document.querySelector('#login-email');
const passwordLoginP = document.querySelector('#login-password');
const btnLoginSbmtP = document.querySelector('.btn-login-submit');


// data from the log-in form (orientation: landscape)

const loginFormL = document.querySelector('#login-form-l');
const emailLoginL = document.querySelector('#login-l-email');
const passwordLoginL = document.querySelector('#login-l-password');
const btnLoginSbmtL = document.querySelector('.btn-login-submit-l');

// in case users forget their passwords
const forgottenPasswords = document.querySelectorAll('.forgotten-password');
const modalWindowNewPassword = document.querySelector('.modal-window-new-password');
const currentInfo = document.querySelector('.current-info-message');
const resetPasswordEmail = document.querySelector('#reset-password-email');
const hiddenName = document.querySelector('.hidden-username');
const resetPasswordFullUsername = document.querySelector('#full-username');
const resetNewPassword = document.querySelector('#reset-password');
const btnSubmitEmail = document.querySelector('.modal-window-submit-email');
const btnSubmitUsername = document.querySelector('.modal-window-submit-username');
const btnSubmitNewPassword = document.querySelector('.modal-window-submit-new-password');
const btnModalWindowNewPasswordOk = document.querySelector('.modal-window-new-password-ok');
const btnCloseResetPassword = document.querySelector('.reset-password-close');


const userData = {
    user_email: '',
    user_password: ''
};

// const errors = [];
// const emailRegExp = /\S+@\S+\.\S+/;

async function sendLoginData(data) {
    try {
        return await fetch('/todos/log_in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred while sending the data to LOG IN: ${error}`);
    }
}

async function collectDataLoginPortrait(event) {
    event.preventDefault();

    // collecting user's data to log in

    if (!emailLoginP.value || !emailRegExp.test(emailLoginP.value)) {
        errors.push("Your cannot log in without your e-mail!");
    } else {
        userData.user_email = emailLoginP.value;
    }

    if (!passwordLoginP.value || passwordLoginP.value.length < 8 || passwordP.value.length > 20) {
        errors.push(`You cannot log in without your password.
                     Remember, it must be at least 8 symbols long but no longer than 20 symbols!`);
    } else {
        userData.user_password = passwordLoginP.value;
    }

    // check if there are any errors

    if (errors.length) {
        handlingValidationErrors(errors);
    } else {
        //console.log(userData);
        const response = await sendLoginData(userData);
        if (response.status === 200) {
            window.location.href = response.url;
        }
        if (response.status === 403) {
            await collectServerErrors(response);
        }
        if (response.status === 401) {
            await collectServerErrors(response);
        }
        const result = await response.json();
        const receivedErrors = result.errors;
        const serverErrors = [];
        for (let i = 0; i < receivedErrors.length; i++) {
            serverErrors.push(receivedErrors[i].msg);
        }
        handlingValidationErrors(serverErrors);
    }
}

async function collectDataLoginLandscape(event) {
    event.preventDefault();

    // collecting user's data to log in
    if (!emailLoginL.value || !emailRegExp.test(emailLoginL.value)) {
        errors.push("Your cannot log in without your e-mail!");
    } else {
        userData.user_email = emailLoginL.value;
    }
    if (!passwordLoginL.value || passwordLoginL.value.length < 8 || passwordL.value.length > 20) {
        errors.push(`You cannot log in without your password.
                     Remember, it must be at least 8 symbols long but no longer than 20 symbols!`);
    } else {
        userData.user_password = passwordLoginL.value;
    }

    // check if there are any errors
    if (errors.length) {
        handlingValidationErrors(errors);
    } else {
        console.log(userData);
        const response = await sendLoginData(userData);
        if (response.status === 200) {
            console.log('Successfull log in');
            window.location.href = response.url;
        }
        if (response.status === 403) {
            await collectServerErrors(response);
        }
        if (response.status === 401) {
            await collectServerErrors(response);
        }
        const result = await response.json();
        const receivedErrors = result.errors;
        const serverErrors = [];
        for (let i = 0; i < receivedErrors.length; i++) {
            serverErrors.push(receivedErrors[i].msg);
        }
        handlingValidationErrors(serverErrors);
    }
}

function closeModalWindowNewPassword() {
    btnCloseResetPassword.onclick = () => {
        modalWindowNewPassword.style.display = 'none';
    }
    btnModalWindowNewPasswordOk.onclick = () => {
        modalWindowNewPassword.style.display = 'none';
    }
}
