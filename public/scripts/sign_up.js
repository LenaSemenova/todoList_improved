
// data from the sign up form (orientation: portrait)
const signUpFormP = document.querySelector('#sign-up-form-p');
const nameP = document.querySelector('#sign-up-name');
const emailP = document.querySelector('#sign-up-email');
const passwordP = document.querySelector('#sign-up-password');
const btnSubmit = document.querySelector('.btn-submit');
const btnKnowsRules = document.querySelector('.btn-knows-rules');

// data from the sign up form (orientation: landscape) 
const signUpFormL = document.querySelector('#sign-up-form-l');
const nameL = document.querySelector('#sign-up-l-name');
const emailL = document.querySelector('#sign-up-l-email');
const passwordL = document.querySelector('#sign-up-l-password');
const btnSubmitL = document.querySelector('.btn-submit-l');

// settings for processing different validation errors
const containerForErrors = document.querySelector('.container-for-errors');
const modalWindowErrors = document.querySelector('.modal-window-errors');
const btnCloseErrors = document.querySelector('.errors-close');
const btnOkErrors = document.querySelector('.btn-ok-errors');

const newUser = {
    user_name: '',
    user_email: '',
    user_password: '',
    user_knows_rules: 0
};

const emailRegExp = /\S+@\S+\.\S+/;

const errors = [];

function handlingValidationErrors(errors) {
    errors.forEach((err) => {
        const newError = document.createElement('span');
        newError.innerHTML = `<img src="pictures_and_icons/favicon_single.png" /> ${err} \n`;
        containerForErrors.appendChild(newError);
    })
    btnCloseErrors.onclick = () => {
        while (errors.length) {
            errors.pop();
        }
        while (containerForErrors.firstChild) {
            containerForErrors.removeChild(containerForErrors.firstChild);
        }
        modalWindowErrors.style.display = 'none';
    }
    btnOkErrors.onclick = () => {
        while (errors.length) {
            errors.pop();
        }
        while (containerForErrors.firstChild) {
            containerForErrors.removeChild(containerForErrors.firstChild);
        }
        modalWindowErrors.style.display = 'none';
    }
    modalWindowErrors.style.display = 'block';
    modalWindowErrors.style.zIndex = '2';
}

async function collectServerErrors (response) {
    const result = await response.json();
    const errorMessage = [];
    errorMessage.push(result.errorMessage);
    handlingValidationErrors(errorMessage);
}

async function sendData(data) {
    try {
        return await fetch('/todos/sign_up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred while sending the data to SIGN UP: ${error}`);
    }
}

function userKnowsRules() {
    btnKnowsRules.onclick = () => {
        newUser.user_knows_rules = 1;
        modalWindow.style.display = 'none';
    }
}

async function collectDataSignUpPortrait(event) {
    event.preventDefault();
    
    // collecting user's data
    if (!nameP.value || nameP.value.length < 5 || nameP.value.length > 20) {
        errors.push("Your name must consist of at least 5 symbols and it mustn't be longer than 20 symbols");
    } else {
        newUser.user_name = nameP.value;
    }
    if (!emailP.value || !emailRegExp.test(emailP.value)) {
        errors.push("Your e-mail is requiered!");
    } else {
        newUser.user_email = emailP.value;
    }
    if (!passwordP.value || passwordP.value.length < 8 || passwordP.value.length > 20) {
        errors.push("Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols");
    } else {
        newUser.user_password = passwordP.value;
    }

    // check if there are any validation errors
    if (errors.length) {
        handlingValidationErrors(errors);
    } else {
        const response = await sendData(newUser);
        if (response.status === 200) {
            window.location.href = response.url;
        }
        if (response.status === 409) {
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

async function collectDataSignUpLandscape(event) {
    event.preventDefault();

    // collecting user's data
    if (!nameL.value || nameL.value.length < 5 || nameL.value.length > 20) {
        errors.push("Your name must consist of at least 5 symbols and it mustn't be longer than 20 symbols");
    } else {
        newUser.user_name = nameL.value;
    }
    if (!emailL.value || !emailRegExp.test(emailL.value)) {
        errors.push("Your e-mail is requiered!");
    } else {
        newUser.user_email = emailL.value;
    }
    if (!passwordL.value || passwordL.value.length < 8 || passwordL.value.length > 20) {
        errors.push("Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols");
    } else {
        newUser.user_password = passwordL.value;
    }

    // check if there are any validation errors
    if (errors.length) {
        handlingValidationErrors(errors);
    } else {
        const response = await sendData(newUser);
        if (response.status === 200) {
            window.location.href = response.url;
        }
        if (response.status === 409) {
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