import { Router } from 'express';
import controllers from '../controllers/todos.js';


const router = new Router();

router.get('/', controllers.redirect);
router.get('/todos', controllers.openMainPage);
router.post('/todos/sign_up', controllers.getSignUpData);
router.post('/todos/log_in', controllers.getLogInData);
router.post('/todos/reset_password_stepOne', controllers.resetPassword_stepOne);
router.post('/todos/reset_password_stepTwo', controllers.resetPassword_stepTwo);
router.post('/todos/reset_password_stepThree', controllers.resetPassword_stepThree);


router.get('/todos/list/:user_id', controllers.openTodos);
router.post('/todos/list/:user_id/newTodo', controllers.addTodo);
router.post('/todos/list/:user_id/updateTodo', controllers.updateTodo);
router.delete('/todos/list/:user_id/deleteTodo', controllers.deleteTodo);
router.put('/todos/list/:user_id/bringDeletedCardsBack', controllers.bringBack);
router.get('/todos/list/:user_id/showDeletedCards', controllers.showDeletedTodos);

router.get('/todos/list_deleted/:user_id', controllers.openDeletedTodos);
router.put('/todos/list_deleted/:user_id/bringCardsBack', controllers.bringOneCardBack);

export default router;

