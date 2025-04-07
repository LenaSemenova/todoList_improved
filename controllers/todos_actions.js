import generalQueries from '../db_models/db_general.js';
import { body, validationResult } from 'express-validator';
import todosActions from '../db_models/db_todos.js';
import deleteAccountForever from '../db_models/db_delete_account.js';


const openTodos = async (req, res) => {
    const user_id = req.params.user_id;
    const todos = await generalQueries.getTodos(user_id);
    return res.render('todos', { todos });
}

const isValidInput = async (req, res) => {

    // object with different error messages

    const errMessages = {
        errorsTitle: {
            isEmpty: "Titles of your tasks in todo-cards mustn't be empty.",
            tooLong: "Titles of your tasks in todo-cards mustn't be longer than 60 symbols."
        },
        errorsDescription: {
            tooLong: "Descriptions of your tasks in todo-cards mustn't be longer than 200 symbols."
        }
    };

    // check if everything is according to the rules


    await body('todo_title').trim().notEmpty().withMessage(errMessages.errorsTitle.isEmpty).run(req);
    await body('todo_title').trim().isLength({ max: 60 }).withMessage(errMessages.errorsTitle.tooLong).run(req);
    await body('todo_description').isLength({ max: 200 }).withMessage(errMessages.errorsDescription.tooLong).run(req);

    // inform your users about possible problems if there are any

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.validationErrors = errors.array();
        return req.validationErrors;
    } else {
        return true;
    }
}

const addTodo = async (req, res) => {
    try {
        await isValidInput(req, res);
        if (req.validationErrors) {
            const errArr = req.validationErrors;
            return res.status(422).json({ errorMessage: errArr });
        } else {
            const user_id = req.params.user_id;
            const newTodo = req.body;

            const result = await todosActions.addNewTodo(user_id, newTodo);
            if (result.affectedRows) {
                return res.redirect(`/todos/list/${user_id}`);
            }
        }
    } catch (error) {
        console.error(`This error occurred while adding a new card: ${error}`);
        return res.status(400).json({ errorMessage: `Something went wrong while adding a new card: ${error}. Reload this page.` })
    }
}

const updateTodo = async (req, res) => {
    try {
        const updatesFromClient = req.body;
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

        const resultOfUpdate = await todosActions.updateTodo(user_id, updatesForServer);
        if (resultOfUpdate.affectedRows) {
            return res.redirect(`/todos/list/${user_id}`);
        }
    } catch (error) {
        console.error(`This error occurred while updating: ${error}`);
        return res.status(400).json({ errorMessage: `Something went wrong while updating the todo-card: ${error}. Reload this page.` });
    }
}

const deleteTodo = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const deleteTodo = req.body;

        const resultOfDelete = await todosActions.deleteTodo(user_id, deleteTodo);

        if (resultOfDelete.affectedRows) {
            return res.redirect(`/todos/list/${user_id}`);
        }
    } catch (error) {
        console.error(`This error occurred while while deleting a todo-card: ${error}`);
        return res.status(400).json({ errorMessage: `Something went wrong while deleting the todo-card: ${error}. Reload this page.` });
    }
}

const bringBack = async (req, res) => {
    try {
        const user_id = req.params.user_id;

        const resultOfBringingBack = await todosActions.bringDeletedTodosBack(user_id);
        if (resultOfBringingBack.affectedRows) {
            res.redirect(`/todos/list/${user_id}`);
        }
    } catch (error) {
        console.error(`This error happened while bringing all the deleted tasks back: ${error}`);
        return res.status(400).json({ errorMessage: `Something bad happened while bringing all the deleted tasks back: ${error}. Reload this page` });
    }
}

const showDeletedTodos = async (req, res) => {
    const user_id = req.params.user_id;
    return res.redirect(`/todos/list_deleted/${user_id}/`);
}

const openDeletedTodos = async (req, res) => {
    const user_id = req.params.user_id;
    const todos = await generalQueries.getTodos(user_id);
    return res.render('todos_deleted', { todos });
}

const bringOneCardBack = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user_data = req.body;

        const changedStatus = await todosActions.bringOneDeletedCardBack(user_id, user_data.todo_id);
        if (changedStatus.affectedRows) {
            return res.redirect(`/todos/list_deleted/${user_id}`);
        }
    } catch (error) {
        console.error(`Something went wrong while changing the status: ${error}`);
        return res.status(400).json({ errorMessage: `Something went wrong while changing the status of the task: ${error} Reload this page` });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const result = await deleteAccountForever(user_id);

        if (result) {
            res.status(200).json({ successMessage: 'Your account has been deleted!' });
        }
    } catch (error) {
        res.status(400).json({ errorMessage: `Something went wrong while deleting your account: ${error}. Try to reload this page.` })
    }
}

export default {
    openTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    bringBack,
    showDeletedTodos,
    openDeletedTodos,
    bringOneCardBack,
    deleteAccount
}