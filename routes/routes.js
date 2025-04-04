import { Router } from 'express';
import todosMain from '../controllers/todos_main.js';
import todosResetPassword from '../controllers/todos_reset_password.js';
import todosActions from '../controllers/todos_actions.js';


const router = new Router();

router.get('/', todosMain.redirect);
router.get('/todos', todosMain.openMainPage);
router.post('/todos/sign_up', todosMain.getSignUpData);
router.post('/todos/log_in', todosMain.getLogInData);


router.post('/todos/reset_password_stepOne', todosResetPassword.resetPassword_stepOne);
router.post('/todos/reset_password_stepTwo', todosResetPassword.resetPassword_stepTwo);
router.post('/todos/reset_password_stepThree', todosResetPassword.resetPassword_stepThree);


router.get('/todos/list/:user_id', todosActions.openTodos);
router.post('/todos/list/:user_id/newTodo', todosActions.addTodo);
router.post('/todos/list/:user_id/updateTodo', todosActions.updateTodo);
router.delete('/todos/list/:user_id/deleteTodo', todosActions.deleteTodo);
router.put('/todos/list/:user_id/bringDeletedCardsBack', todosActions.bringBack);
router.get('/todos/list/:user_id/showDeletedCards', todosActions.showDeletedTodos);

router.get('/todos/list_deleted/:user_id', todosActions.openDeletedTodos);
router.put('/todos/list_deleted/:user_id/bringCardsBack', todosActions.bringOneCardBack);
router.delete('/todos/list/:user_id/deleteAccount', todosActions.deleteAccount);

export default router;

