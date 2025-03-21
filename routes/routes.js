import { Router } from 'express';
import controllers from '../controllers/todos.js';


const router = new Router();

router.get('/', controllers.redirect);
router.get('/todos', controllers.openMainPage);
router.post('/todos/sign_up', controllers.getSignUpData);
router.post('/todos/log_in', controllers.getLogInData);

export default router;

