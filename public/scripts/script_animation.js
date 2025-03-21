// one-line subtitles (orientation: portrait)
const subTitles = document.querySelectorAll('.sub-title');
// three-lines subtitles (orientation: landscape);
const subTitlesLandscapeOne = document.querySelectorAll('.sub-title-one');
const subTitlesLandscapeTwo = document.querySelectorAll('.sub-title-two');
const subTitlesLandscapeThree = document.querySelectorAll('.sub-title-three');
// sign up forms (orientation: portrait) and (orientation: landscape)
const wrapperSignUpForm = document.querySelector('.wrapper-card-sign-up');
const wrapperSignUpFormLandscape = document.querySelector('.wrapper-card-sign-up-landscape');
// log in forms (orientation: portrait) and (orientation: landscape)
const wrapperLoginForm = document.querySelector('.wrapper-card-login');
const wrapperLoginFormLandscape = document.querySelector('.wrapper-card-login-landscape');
// span-elements that allow users to navigate between the sign-up form and the log-in form 
// (orientation: portrait)
const infoRegistered = document.querySelector('.registered');
const infoNotRegistered = document.querySelector('.not-registered');
// (orientation: landscape)
const infoRegisteredLandscape = document.querySelector('.registered-landscape');
const infoNotRegisteredLandscape = document.querySelector('.not-registered-landscape');
// eye-icon that changes the type of the text in the input-field 'password'
const iconsEyePassword = document.querySelectorAll('img');
const inputPassword = document.querySelectorAll('.password');
// buttons that changes the display of the modal window with the additional information about the app
const btnInfo = document.querySelectorAll('.btn-informed');
const modalWindow = document.querySelector('.modal-window');
const closeBtn = document.querySelector('.close');
// data from the sign up form (orientation: portrait)
const inputs = document.querySelectorAll('input');


// animation settings for sign up subtitles

function subTitleAnimation() {
    setTimeout(() => {
        subTitles.forEach((subTitle) => {
            subTitle.style.animation = 'opacityChanger 1.5s ease';
            subTitle.style.opacity = '1';
        })   
    }, 2000);
    setTimeout(() => {
        subTitlesLandscapeOne.forEach((subTitle) => {
            subTitle.style.animation = 'opacityChanger 1.5s ease';
            subTitle.style.opacity = '1';
        })
    }, 2000);
    setTimeout(() => {
        subTitlesLandscapeTwo.forEach((subTitle) => {
            subTitle.style.animation = 'opacityChanger 1.5s ease';
            subTitle.style.opacity = '1';
        })
    }, 2500);
    setTimeout(() => {
            subTitlesLandscapeThree.forEach((subTitle) => {
                subTitle.style.animation = 'opacityChanger 1.5s ease';
                subTitle.style.opacity = '1';
            })
    }, 3000);
}
function clearPasswordField () {
    // delete all the information that has been typed in the input-field password
    inputs.forEach((input) => {
        input.value = '';
    })
    inputPassword.forEach((input) => {
        input.setAttribute('type', 'password');
    })
    // change the eye-icon to its default view 
    iconsEyePassword.forEach((iconEye) => {
        iconEye.src = 'pictures_and_icons/eye_closed.png';
    })
}

function redirectForms () {
    infoRegistered.onclick = () => {
        // remove all the information from the password input-field
        clearPasswordField();
        // set default settings for the wrapper log in form (orientation: portrait)
        wrapperLoginForm.style.animation = 'none';
        wrapperLoginForm.style.opacity = '0';
        // set default settings for the subtitle (just one line) (orientation: portrait)
        subTitles[1].style.animation = 'none';
        subTitles[1].style.opacity = '0';
        setTimeout(() => {
            wrapperLoginForm.style.animation = 'moveUpwards 2s ease';
            wrapperLoginForm.style.opacity = '1';
            setTimeout(() => {
                subTitles[1].style.animation = 'opacityChanger 1.5s ease';
                subTitles[1].style.opacity = '1';
            }, 2000)
        }, 300);
    }
    infoNotRegistered.onclick = () => {
        // remove all the information from the password input-field
        clearPasswordField();
        // set default settings for the wrapper sign up form (orientation: portrait)
        wrapperSignUpForm.style.animation = 'none';
        wrapperSignUpForm.style.opacity = '0';
        // set default settings for the subtitle (just one line) (orientation: portrait)
        subTitles[0].style.animation = 'none';
        subTitles[0].style.opacity = '0';
        setTimeout(() => {
            wrapperSignUpForm.style.animation = 'moveDownwards 2s ease';
            wrapperSignUpForm.style.opacity = '1';
            setTimeout(() => {
                subTitles[0].style.animation = 'opacityChanger 1.5s ease';
                subTitles[0].style.opacity = '1';
            }, 2000);
        }, 300);
    }
    infoRegisteredLandscape.onclick = () => {
        // remove all the information from the password input-field
        clearPasswordField();
        // set default settings for the log in form (orientation: landscape)
        wrapperLoginFormLandscape.style.animation = 'none';
        wrapperLoginFormLandscape.style.opacity = '0';
        // set default settings for the first line of the subtitle
        subTitlesLandscapeOne[1].style.animation = 'none';
        subTitlesLandscapeOne[1].style.opacity = '0';
        // set default settings for the second line of the subtitle
        subTitlesLandscapeTwo[1].style.animation = 'none';
        subTitlesLandscapeTwo[1].style.opacity = '0';
        // set default settings for the third line of the subtitle
        subTitlesLandscapeThree[1].style.animation = 'none';
        subTitlesLandscapeThree[1].style.opacity = '0';
            setTimeout(() => {
                wrapperLoginFormLandscape.style.animation = 'moveUpwards 2s ease';
                wrapperLoginFormLandscape.style.opacity = '1';   
                setTimeout(() => {
                    subTitlesLandscapeOne[1].style.animation = 'opacityChanger 1.5s ease';
                    subTitlesLandscapeOne[1].style.opacity = '1';
                }, 2000);
                setTimeout(() => {
                    subTitlesLandscapeTwo[1].style.animation = 'opacityChanger 1.5s ease';
                    subTitlesLandscapeTwo[1].style.opacity = '1';
                }, 2500);
                setTimeout(() => {
                    subTitlesLandscapeThree[1].style.animation = 'opacityChanger 1.5s ease';
                    subTitlesLandscapeThree[1].style.opacity = '1';
                }, 3000);
            }, 300);
    }
    infoNotRegisteredLandscape.onclick = () => {
        // remove all the information from the password input-field
        clearPasswordField();
        // set default settings for the sign up form (orientation: landscape)
        wrapperSignUpFormLandscape.style.animation = 'none';
        wrapperSignUpFormLandscape.style.opacity = '0';
        // set default settings for the first line of the subtitle
        subTitlesLandscapeOne[0].style.animation = 'none';
        subTitlesLandscapeOne[0].style.opacity = '0';
        // set default settings for the second line of the subtitle
        subTitlesLandscapeTwo[0].style.animation = 'none';
        subTitlesLandscapeTwo[0].style.opacity = '0';
        // set default settings for the third line of the subtitle
        subTitlesLandscapeThree[0].style.animation = 'none';
        subTitlesLandscapeThree[0].style.opacity = '0';

        setTimeout(() => {
            wrapperSignUpFormLandscape.style.animation = 'moveDownwards 2s ease';
            wrapperSignUpFormLandscape.style.opacity = '1';
            setTimeout(() => {
                subTitlesLandscapeOne[0].style.animation = 'opacityChanger 1.5s ease';
                subTitlesLandscapeOne[0].style.opacity = '1'; 
            }, 2000);
            setTimeout(() => {
                subTitlesLandscapeTwo[0].style.animation = 'opacityChanger 1.5s ease';
                subTitlesLandscapeTwo[0].style.opacity = '1';
            }, 2500);
            setTimeout(() => {
                subTitlesLandscapeThree[0].style.animation = 'opacityChanger 1.5s ease';
                subTitlesLandscapeThree[0].style.opacity = '1'; 
            }, 3000);
        }, 300)
    }
}

function closeOpenEyePassword () {
    iconsEyePassword.forEach((iconEye) => {
        iconEye.onclick = () => {

            inputPassword.forEach((input) => {
                const type = input.getAttribute('type');
                if (type === 'password') {
                    input.setAttribute('type', 'text');
                    iconEye.src = 'pictures_and_icons/eye_opened.png';
                } else {
                    input.setAttribute('type', 'password');
                    iconEye.src = 'pictures_and_icons/eye_closed.png';
                }
            })
            
        }
    })
}

function modalWindowInfo () {
    btnInfo.forEach((btn) => {
        btn.onclick = (event) => {
            event.preventDefault();
            modalWindow.style.display = 'block';
        }
    })
    closeBtn.onclick = () => {
        modalWindow.style.display = 'none';
    }
}