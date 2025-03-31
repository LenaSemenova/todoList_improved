import bcrypt, { hashSync } from 'bcrypt';
import { body, validationResult } from 'express-validator';
import createAccount from '../db_models/db_get_started.js';
import generalQueries from '../db_models/db_general.js';
import todosActions from '../db_models/db_todos.js';

// redirecting to the endpoint '/todos' 

const redirect = (req, res) => {
    console.log('redirecting from controllers');
    return res.redirect('/todos');
}

// rendering the main page of the app

const openMainPage = (req, res) => {
    console.log('opening the main page');
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
        console.log('There are some errors');
        return req.validationErrors;
    } else {
        console.log('Everything is clean!');
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
        console.log('There are some errors');
        return req.validationErrors;
    } else {
        console.log('Everything is clean!');
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
        console.log(errArr);
        return res.status(400).json({ errors: errArr });
    } else {
        console.log('Everything is ok!', req.body);
        const user_data = req.body;
        const [result] = await generalQueries.isRegistered(user_data.user_email);
        console.log('Result after checking in the data_base: ', result);
        if (result) {
            return res.status(409).json({ errorMessage: 'This e-mail is already used.' });
        } else {
            const hashedPassword = hashPasswordsBcrypt(user_data.user_password);
            user_data.user_password = hashedPassword;
            const new_userID = await createAccount(user_data);
            return res.redirect(`/todos/list/${new_userID}`);
        }
    }
}

// let users log in 

const getLogInData = async (req, res) => {
    console.log('Login attempt ', req.body);
    try {
        const user_login_data = req.body;
        console.log(user_login_data);
        const [isUser] = await generalQueries.isRegistered(user_login_data.user_email);
        console.log(isUser);
        if (!isUser) {
            return res.status(403).json({ errorMessage: 'You are not registered with this e-mail!' });
        } else {
            const isPassword = bcrypt.compareSync(user_login_data.user_password, isUser.user_password);
            if (!isPassword) {
                return res.status(401).json({ errorMessage: 'Your authorization attempt has failed. Try another e-mail and/or another password!' });
            } else {
                console.log('You are authorized! Wait for the further development of the app!');
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
    }
}

// reset password_step one: check if there is a user that has been registered with a given e-mail
// and send a ciphered username for some additional control 

const resetPassword_stepOne = async (req, res) => {
    const user_reset_password_data = req.body;
    console.log(user_reset_password_data);
    const [isEmail] = await generalQueries.isRegistered(user_reset_password_data.user_email);
    if (!isEmail) {
        res.status(403).json({ errorMessage: 'You are not registered with this e-mail!' });
    } else {
        let cipheredUserName = '';
        for (let i = 0; i < isEmail.user_name.length; i++) {
            if (i % 2 === 0) {
                cipheredUserName = cipheredUserName + '*';
            } else {
                cipheredUserName = cipheredUserName + isEmail.user_name[i];
            }
        }
        console.log(cipheredUserName);
        res.status(200).json({ nextStep: `Enter your full username without any asterisks`, nextInfo: `${cipheredUserName}` });
    }
}

const resetPassword_stepTwo = async (req, res) => {
    const user_data = req.body;
    console.log(user_data);
    const [isUser] = await generalQueries.isRegistered(user_data.user_email);
    console.log(isUser);
    if (user_data.user_name !== isUser.user_name) {
        res.status(403).json({ errorMessage: 'This name does not match the name from the database' });
    } else {
        res.status(200).json({ nextStep: "Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols" });
    }
}

const resetPassword_stepThree = async (req, res) => {
    const user_data = req.body;

    await isValidPassword(req, res);
    if (req.validationErrors) {
        const errArr = req.validationErrors;
        return res.status(400).json({ errorMessage: errArr });
    } else {
        const hashedPassword = hashPasswordsBcrypt(user_data.user_password);
        user_data.user_password = hashedPassword;
        const isReset = await generalQueries.resetPassword(user_data);
        if (!isReset) {
            res.status(400).json({ errorMessage: 'Something went wrong. Try to reset the password again' });
        } else {
            res.status(200).json({ successMessage: 'You have just reset your password. You can log in now' });
        }
    }
}

const openTodos = async (req, res) => {
    const user_id = req.params.user_id;
    console.log('openTodos is opened with ', user_id);
    const todos = await generalQueries.getTodos(user_id);
    console.log('Todos from the openTodos ', todos.length);

    return res.render('todos', { todos });
}


const addTodo = async (req, res) => {
    const user_id = req.params.user_id;
    const newTodo = req.body;

    const result = await todosActions.addNewTodo(user_id, newTodo);
    if (result.affectedRows) {
        return res.redirect(`/todos/list/${user_id}`);
    } else {
        console.log('Something went wrong while reloading the page with the newly added todos');
    }
}

const updateTodo = async (req, res) => {
    const updatesFromClient = req.body;
    console.log(updatesFromClient);
    const user_id = req.params.user_id;
    const updatesForServer = {};

    const [existingTodo] = await generalQueries.getOneTodo(user_id, updatesFromClient.todo_id);

    updatesForServer.todo_id = updatesFromClient.todo_id;

    //check if there are any changes in the title

    if (!updatesFromClient.todo_title) {
        updatesForServer.todo_title = existingTodo.todo_title;
    } else {
        if (updatesFromClient.todo_title !== existingTodo.todo_title) {
            updatesForServer.todo_title = updatesFromClient.todo_title;
        } else {
            updatesForServer.todo_title = existingTodo.todo_title;
        }
    }

    // check if there are any changes in the description

    if (!updatesFromClient.todo_description) {
        updatesForServer.todo_description = existingTodo.todo_description;
    } else {
        if (updatesFromClient.todo_description !== existingTodo.todo_description) {
            updatesForServer.todo_description = updatesFromClient.todo_description;
        } else {
            updatesForServer.todo_description = existingTodo.todo_description;
        }
    }

    // check if there are any changes in the status


    if (updatesFromClient.todo_status !== existingTodo.todo_status) {
        updatesForServer.todo_status = updatesFromClient.todo_status;
    } else {
        updatesForServer.todo_status = existingTodo.todo_status;
    }

    console.log(updatesForServer);
    const resultOfUpdate = await todosActions.updateTodo(user_id, updatesForServer);
    if (resultOfUpdate.affectedRows) {
        return res.redirect(`/todos/list/${user_id}`);
    } else {
        console.error('An error occurred while updating');
    }
}

const deleteTodo = async(req, res) => {
    const user_id = req.params.user_id;
    const deleteTodo = req.body;
    
    const resultOfDelete = await todosActions.deleteTodo(user_id, deleteTodo);
    
    if(resultOfDelete.affectedRows) {
        return res.redirect(`/todos/list/${user_id}`);
    } else {
        console.error('An error occurred while deleting a todo-card');
    }
}

const bringBack = async(req, res) => {
    const user_id = req.params.user_id;
    
    const resultOfBringingBack = await todosActions.bringDeletedTodosBack(user_id);
    if (resultOfBringingBack.affectedRows) {
        res.redirect(`/todos/list/${user_id}`);
    } else {
        console.error('An error happened while bringing all the deleted tasks back');
    }
}

const showDeletedTodos = async(req, res) => {
    const user_id = req.params.user_id;
    return res.redirect(`/todos/list_deleted/${user_id}/`);
}

const openDeletedTodos = async(req, res) => {
    console.log('redirected from show_deleted_todos');
    const user_id = req.params.user_id;
    const todos = await generalQueries.getTodos(user_id);
    return res.render('todos_deleted', { todos });
}

export default {
    redirect,
    openMainPage,
    getSignUpData,
    getLogInData,
    resetPassword_stepOne,
    resetPassword_stepTwo,
    resetPassword_stepThree,
    openTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    bringBack,
    showDeletedTodos,
    openDeletedTodos
}

