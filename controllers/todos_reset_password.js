import generalQueries from '../db_models/db_general.js';
import todosMain from './todos_main.js';



const resetPassword_stepOne = async (req, res) => {
    const user_reset_password_data = req.body;
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
        res.status(200).json({ nextStep: `Enter your full username without any asterisks`, nextInfo: `${cipheredUserName}` });
    }
}

const resetPassword_stepTwo = async (req, res) => {
    const user_data = req.body;
    const [isUser] = await generalQueries.isRegistered(user_data.user_email);
    if (user_data.user_name !== isUser.user_name) {
        res.status(403).json({ errorMessage: 'This name does not match the name from the database' });
    } else {
        res.status(200).json({ nextStep: "Your password must consist of at least 8 symbols and it mustn't be longer than 20 symbols" });
    }
}

const resetPassword_stepThree = async (req, res) => {
    const user_data = req.body;

    await todosMain.isValidPassword(req, res);
    if (req.validationErrors) {
        const errArr = req.validationErrors;
        return res.status(400).json({ errorMessage: errArr });
    } else {
        const hashedPassword = todosMain.hashPasswordsBcrypt(user_data.user_password);
        user_data.user_password = hashedPassword;
        const isReset = await generalQueries.resetPassword(user_data);
        if (!isReset) {
            res.status(400).json({ errorMessage: 'Something went wrong. Try to reset the password again' });
        } else {
            res.status(200).json({ successMessage: 'You have just reset your password. You can log in now' });
        }
    }
}

export default {
    resetPassword_stepOne,
    resetPassword_stepTwo,
    resetPassword_stepThree
}