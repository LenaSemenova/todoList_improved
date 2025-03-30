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

export default router;

