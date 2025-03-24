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

// create a new object to send new information to the server correctly
const user_reset_password = {};

async function sendData_resetPassword_stepOne(data) {
    try {
        return await fetch('/todos/reset_password_stepOne', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred during the first step of trying to reset the password: ${error}`);
    }
}

function resetPassword_stepOne() {

    // first step: check if there is such a user in the database, use an e-mail from the input field
    forgottenPasswords.forEach((btn) => {
        btn.onclick = () => {
            modalWindowNewPassword.style.display = 'block';
            btnSubmitEmail.onclick = async () => {
                if (!resetPasswordEmail.value || !emailRegExp.test(resetPasswordEmail.value)) {
                    currentInfo.innerHTML = `You cannot reset your password without a real e-mail!`;
                    currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
                } else {
                    currentInfo.style.animation = 'none';
                    user_reset_password.user_email = resetPasswordEmail.value;
                    const response = await sendData_resetPassword_stepOne(user_reset_password);
                    if (response.status === 403) {
                        const result = await response.json();
                        currentInfo.textContent = result.errorMessage;
                        currentInfo.style.animation = 'slideInFromTheLeft 3s ease';

                        // second step: check if the person who tries to reset the password can decipher their own username

                    } else {
                        currentInfo.style.animation = 'none';
                        const result = await response.json();
                        console.log(result.nextStep, result.nextInfo);
                        currentInfo.innerHTML = `${result.nextStep}`;
                        currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
                        resetPasswordFullUsername.removeAttribute('disabled');
                        btnSubmitUsername.removeAttribute('disabled');
                        hiddenName.innerHTML = `${result.nextInfo}`;
                    }
                }
            }
        }
    })
    return user_reset_password;
}

async function sendData_resetPassword_stepTwo(data) {
    try {
        return await fetch('/todos/reset_password_stepTwo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred during the second step of trying to reset the password: ${error}`);
    }
}

function resetPassword_stepTwo () {
    btnSubmitUsername.onclick = async () => {
        currentInfo.style.animation = 'none';
        if (!resetPasswordFullUsername.value) {
            currentInfo.textContent = "That's not your full username. Try it again please."
            currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
        } else {
            user_reset_password.user_name = resetPasswordFullUsername.value;
            const response = await sendData_resetPassword_stepTwo(user_reset_password);
            if (response.status === 403) {
                const result = await response.json();
                currentInfo.textContent = result.errorMessage;
                currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
            }
            if (response.status === 200) {
                const result = await response.json();
                currentInfo.textContent = result.nextStep;
                currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
                resetNewPassword.removeAttribute('disabled');
                btnSubmitNewPassword.removeAttribute('disabled');
            }
        }
    }
    return user_reset_password;
}

async function sendData_resetPassword_stepThree (data) {
    try {
        return await fetch('/todos/reset_password_stepThree', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred during the third step of trying to reset the password: ${error}`);
    }
}

function resetPassword_stepThree () {
    btnSubmitNewPassword.onclick = async () => {
        if (!resetNewPassword.value || resetNewPassword.value.length < 8 || resetNewPassword.value.length > 20) {
            errors.push("Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols");
            handlingValidationErrors(errors);
        } else {
            user_reset_password.user_password = resetNewPassword.value;
            const response = await sendData_resetPassword_stepThree(user_reset_password);
            console.log(response.status);
            //currentInfo.textContent = 'Great! Do not forget your new password again!';
            //currentInfo.style.animation = 'slideInFromTheLeft 3s ease';
            setTimeout(() => {
                modalWindowNewPassword.style.display = 'none';
            }, 2000);
        }
    }
    return user_reset_password;
}

// ONE FURTHER ADDITION: LIMIT THE ATTEMPTS OF CHANGING THE PASSWORD!

function resetPassword() {

    // create a new object to send new information to the server correctly
    const user_reset_password = {};

    // first step: check if there is such a user in the database, use an e-mail from the input field
    forgottenPasswords.forEach((btn) => {
        btn.onclick = () => {
            modalWindowNewPassword.style.display = 'block';
            btnSubmitEmail.onclick = async () => {
                if (!resetPasswordEmail.value || !emailRegExp.test(resetPasswordEmail.value)) {
                    currentInfo.innerHTML = `You cannot reset <br> your password <br> without a real e-mail!`;
                    currentInfo.style.animation = 'slideInFromTheLeft 3.5s ease';
                } else {
                    currentInfo.style.animation = 'none';
                    user_reset_password.user_email = resetPasswordEmail.value;
                    const response = await sendData_resetPassword_stepOne(user_reset_password);
                    if (response.status === 403) {
                        const result = await response.json();
                        currentInfo.textContent = result.errorMessage;
                        currentInfo.style.animation = 'slideInFromTheLeft 3.5s ease';

                        // second step: check if the person who tries to reset the password can decipher their own username

                    } else {
                        currentInfo.style.animation = 'none';
                        const result = await response.json();
                        console.log(result.nextStep, result.nextInfo);
                        currentInfo.innerHTML = `${result.nextStep}`;
                        currentInfo.style.animation = 'slideInFromTheLeft 3.5s ease';
                        resetPasswordFullUsername.removeAttribute('disabled');
                        btnSubmitUsername.removeAttribute('disabled');
                        hiddenName.textContent = result.nextInfo;
                        btnSubmitUsername.onclick = async () => {
                            currentInfo.style.animation = 'none';
                            if (!resetPasswordFullUsername.value) {
                                currentInfo.textContent = "That's not your full username. Try it again please."
                                currentInfo.style.animation = 'slideInFromTheLeft 3.5s ease';
                            } else {
                                user_reset_password.user_name = resetPasswordFullUsername.value;
                                const response = await sendData_resetPassword_stepTwo(user_reset_password);
                                if (response.status === 403) {
                                    const result = await response.json();
                                    currentInfo.textContent = result.errorMessage;
                                }
                                if (response.status === 200) {
                                    const result = await response.json();
                                    currentInfo.textContent = result.nextStep;
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
                        }
                    }
                }
            }
        }
    })
}

function closeModalWindowNewPassword() {
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
    //resetPassword();
    resetPassword_stepOne();
    resetPassword_stepTwo();
    resetPassword_stepThree();
    closeModalWindowNewPassword();
}

window.addEventListener('DOMContentLoaded', init);
