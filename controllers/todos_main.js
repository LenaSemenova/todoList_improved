import bcrypt, { hashSync } from 'bcrypt';
import { body, validationResult } from 'express-validator';
import createAccount from '../db_models/db_get_started.js';
import generalQueries from '../db_models/db_general.js';

// redirecting to the endpoint '/todos' 

const redirect = (req, res) => {
    return res.redirect('/todos');
}

// rendering the main page of the app

const openMainPage = (req, res) => {
    return res.render('main_page');
}

// server-side validation check

const isValid = async (req, res) => {


    // object with error messages

    const errMessages = {
        errorsName: {
            tooShort: 'Your name is too short. It has to be at least 5 symbols long',
            tooLong: 'Your name is too long. The maximum length of your name is 20 symbols'
        },
        errorsEmail: {
            isInvalid: 'Your e-mail is required!'
        },
        errorsPassword: {
            tooShort: 'Your password is too short. It has to be at least 8 symbols long',
            tooLong: 'Your password is too long. The maximum length of your password is 20 symbols'
        }
    }
    await body('user_name').isLength({ min: 5 }).withMessage(errMessages.errorsName.tooShort).run(req);
    await body('user_name').isLength({ max: 20 }).withMessage(errMessages.errorsName.tooLong).run(req);
    await body('user_email').isEmail().withMessage(errMessages.errorsEmail.isInvalid).run(req);
    await body('user_password').isLength({ min: 8 }).withMessage(errMessages.errorsPassword.tooShort).run(req);
    await body('user_password').isLength({ max: 20 }).withMessage(errMessages.errorsPassword.tooLong).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array();
        return req.validationErrors;
    } else {
        return true;
    }
}

const isValidPassword = async (req, res) => {

    // object with different error messages

    const errMessages = {
        errorsPassword: {
            tooShort: 'Your password is too short. It has to be at least 8 symbols long',
            tooLong: 'Your password is too long. The maximum length of your password is 20 symbols'
        }
    };

    // check if everything is according to the rules

    await body('user_password').isLength({ min: 8 }).withMessage(errMessages.errorsPassword.tooShort).run(req);
    await body('user_password').isLength({ max: 20 }).withMessage(errMessages.errorsPassword.tooLong).run(req);

    // inform your users about possible problems if there are any

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array();
        return req.validationErrors;
    } else {
        return true;
    }
}

// using bcrypt library (safer than the standard 'node:crypt' module)

const hashPasswordsBcrypt = (user_password) => {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(user_password, saltRounds);
    return hashedPassword;
}

// saving users' data

const getSignUpData = async (req, res) => {
    await isValid(req, res);
    if (req.validationErrors) {
        const errArr = req.validationErrors;
        return res.status(400).json({ errors: errArr });
    } else {
        const user_data = req.body;
        const [result] = await generalQueries.isRegistered(user_data.user_email);
        if (result) {
            return res.status(409).json({ errorMessage: 'This e-mail is already used.' });
        } else {
            const hashedPassword = hashPasswordsBcrypt(user_data.user_password);
            user_data.user_password = hashedPassword;
            const new_userID = await createAccount(user_data);
            const [userInfo] = await generalQueries.getUserInfo(new_userID);
            if (userInfo.user_knows_the_rules === null) {
                await generalQueries.changeRulesStatus(userInfo.user_knows_the_rules);
                return res.redirect(`/todos/list/${new_userID}?rules=0`);
            } else {
                return res.redirect(`/todos/list/${new_userID}`);
            }
        }
    }
}

// let users log in 

const getLogInData = async (req, res) => {
    try {
        const user_login_data = req.body;
        const [isUser] = await generalQueries.isRegistered(user_login_data.user_email);
        if (!isUser) {
            return res.status(403).json({ errorMessage: 'You are not registered with this e-mail!' });
        } else {
            const isPassword = bcrypt.compareSync(user_login_data.user_password, isUser.user_password);
            if (!isPassword) {
                return res.status(401).json({ errorMessage: 'Your authorization attempt has failed. Try another e-mail and/or another password!' });
            } else {
                if (isUser.user_knows_the_rules === null) {
                    await generalQueries.changeRulesStatus(isUser.user_id);
                    return res.redirect(`/todos/list/${isUser.user_id}?rules=0`);
                } else {
                    return res.redirect(`/todos/list/${isUser.user_id}`);
                }
            }
        }
    } catch (error) {
        console.log('Error while attempting to log in ', error);
        return res.status(400).json({ errorMessage: 'Something went wrong while logging in. Reload this page.'});
    }
}

export default {
    redirect,
    openMainPage,
    getSignUpData,
    getLogInData,
    isValidPassword,
    hashPasswordsBcrypt,
    //resetPassword_stepOne,
    //resetPassword_stepTwo,
    //resetPassword_stepThree,
    //openTodos,
    //addTodo,
    //updateTodo,
    //deleteTodo,
    //bringBack,
    //showDeletedTodos,
    //openDeletedTodos,
    //bringOneCardBack,
    //deleteAccount
}

