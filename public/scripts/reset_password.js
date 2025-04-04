// all the functions that are used in this project to reset forgotten passwords

// create a new object to send new information to the server correctly
const user_reset_password = {};

// first step: check if there is such a user in the database, use an e-mail from the input field
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
    forgottenPasswords.forEach((btn) => {
        btn.onclick = () => {
            modalWindowNewPassword.style.display = 'block';
            btnSubmitEmail.onclick = async () => {
                if (!resetPasswordEmail.value || !emailRegExp.test(resetPasswordEmail.value)) {
                    currentInfo.innerHTML = `You cannot reset your password without a real e-mail!`;
                    currentInfo.style.animation = 'slideInFromTheTop 3s ease';
                } else {
                    currentInfo.style.animation = 'none';
                    user_reset_password.user_email = resetPasswordEmail.value;
                    const response = await sendData_resetPassword_stepOne(user_reset_password);
                    if (response.status === 403) {
                        const result = await response.json();
                        currentInfo.innerHTML = `${result.errorMessage}`;
                        currentInfo.style.animation = 'slideInFromTheTop 3s ease';

                        // second step: check if the person who tries to reset the password can decipher their own username

                    } else {
                        currentInfo.style.animation = 'none';
                        const result = await response.json();
                        currentInfo.innerHTML = `${result.nextStep}`;
                        currentInfo.style.animation = 'slideInFromTheTop 3s ease';
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

// second step: give the user who tries to reset the password a chance to decipher his / her ciphered username

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

function resetPassword_stepTwo() {
    btnSubmitUsername.onclick = async () => {
        currentInfo.style.animation = 'none';
        if (!resetPasswordFullUsername.value) {
            currentInfo.textContent = "That's not your full username. Try it again please."
            currentInfo.style.animation = 'slideInFromTheTop 3s ease';
        } else {
            user_reset_password.user_name = resetPasswordFullUsername.value;
            const response = await sendData_resetPassword_stepTwo(user_reset_password);
            if (response.status === 403) {
                const result = await response.json();
                currentInfo.innerHTML = `${result.errorMessage}`;
                currentInfo.style.animation = 'slideInFromTheTop 3s ease';
            }
            if (response.status === 200) {
                const result = await response.json();
                currentInfo.innerHTML = `${result.nextStep}`;
                currentInfo.style.animation = 'slideInFromTheTop 3s ease';
                resetNewPassword.removeAttribute('disabled');
                btnSubmitNewPassword.removeAttribute('disabled');
            }
        }
    }
    return user_reset_password;
}

// third step: update the password in the database

async function sendData_resetPassword_stepThree(data) {
    try {
        return await fetch('/todos/reset_password_stepThree', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred during the third step of trying to reset the password: ${error}`);
    }
}

function resetPassword_stepThree() {
    btnSubmitNewPassword.onclick = async () => {
        if (!resetNewPassword.value || resetNewPassword.value.length < 8 || resetNewPassword.value.length > 20) {
            errors.push("Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols");
            handlingValidationErrors(errors);
        } else {
            user_reset_password.user_password = resetNewPassword.value;
            const response = await sendData_resetPassword_stepThree(user_reset_password);
            if (response.status === 400) {
                const result = await response.json();
                currentInfo.innerHTML = `${result.errorMessage}`;
                currentInfo.style.animation = 'slideInFromTheTop 3s ease';
            } else {
                currentInfo.style.animation = 'none';
                const result = await response.json();
                currentInfo.innerHTML = `${result.successMessage}`;
                currentInfo.style.animation = 'slideInFromTheTop 3s ease';
                setTimeout(() => {
                    modalWindowNewPassword.style.display = 'none';
                }, 4000);
            }
        }
    }
    return user_reset_password;
}

function init() {
    // from animation.js
    modalWindowInfo();
    subTitleAnimation();
    redirectForms();
    closeOpenEyePassword();
    // from sign_up.js
    btnSubmit.addEventListener('click', collectDataSignUpPortrait);
    btnSubmitL.addEventListener('click', collectDataSignUpLandscape);
    userKnowsRules();
    // from log_in.js
    btnLoginSbmtP.addEventListener('click', collectDataLoginPortrait);
    btnLoginSbmtL.addEventListener('click', collectDataLoginLandscape);
    // from reset_password.js
    resetPassword_stepOne();
    resetPassword_stepTwo();
    resetPassword_stepThree();
    closeModalWindowNewPassword();
}

window.addEventListener('DOMContentLoaded', init);