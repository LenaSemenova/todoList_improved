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
const currentInfo = document.querySelector('.current-info');
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

const isEmail = true;
const hiddenUsername = '*len*';
const revealedUsername = 'elena';
let newPassword;

// ONE FURTHER ADDITION: LIMIT THE ATTEMPTS OF CHANGING THE PASSWORD!

function resetPassword() {
    forgottenPasswords.forEach((btn) => {
        btn.onclick = () => {
            modalWindowNewPassword.style.display = 'block';
            btnSubmitEmail.onclick = () => {
                if (!resetPasswordEmail.value || !emailRegExp.test(resetPasswordEmail.value)) {
                    currentInfo.textContent = 'You cannot reset your password without a real e-mail!';
                } else {
                    if (isEmail) {
                        resetPasswordFullUsername.removeAttribute('disabled');
                        btnSubmitUsername.removeAttribute('disabled');
                        hiddenName.textContent = hiddenUsername;
                        currentInfo.textContent = 'You can see your username. Enter your full username without any asterisks.';
                        btnSubmitUsername.onclick = () => {
                            if (!resetPasswordFullUsername.value || resetPasswordFullUsername.value !== revealedUsername) {
                                currentInfo.textContent = `That's not your full username. Try it again please.`
                            } else {
                                currentInfo.textContent = `Think of a new password. Don't forget the rules: 
                                                           Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols`
                                resetNewPassword.removeAttribute('disabled');
                                btnSubmitNewPassword.removeAttribute('disabled');
                                btnSubmitNewPassword.onclick = () => {
                                    if (!resetNewPassword.value || resetNewPassword.value.length < 8 || resetNewPassword.value.length > 20) {
                                        errors.push("Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols");
                                        handlingValidationErrors(errors);
                                    } else {
                                        newPassword = resetNewPassword.value;
                                        // send the collected data to the server!
                                        currentInfo.textContent = 'Great! Do not forget your new password again!';
                                        setTimeout(() => {
                                            modalWindowNewPassword.style.display = 'none';
                                        }, 2000);
                                    }
                                }
                            }
                        }
                    } else {
                        currentInfo.textContent = 'We do not have such an e-mail in our database!';
                    }
                }
            }
        }
    })
}

function closeModalWindowNewPassword () {
    btnCloseResetPassword.onclick = () => {
        modalWindowNewPassword.style.display = 'none';
    }
    btnModalWindowNewPasswordOk.onclick = () => {
        modalWindowNewPassword.style.display = 'none';
    }
}

function init() {
    // from script_animation.js
    modalWindowInfo();
    subTitleAnimation();
    redirectForms();
    closeOpenEyePassword();
    // from data_sign_up.js
    btnSubmit.addEventListener('click', collectDataSignUpPortrait);
    btnSubmitL.addEventListener('click', collectDataSignUpLandscape);
    userKnowsRules();
    // from data_login.js
    btnLoginSbmtP.addEventListener('click', collectDataLoginPortrait);
    btnLoginSbmtL.addEventListener('click', collectDataLoginLandscape);
    resetPassword();
    closeModalWindowNewPassword();
}

window.addEventListener('DOMContentLoaded', init);
