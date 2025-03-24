import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_todolist'
});

const db_connection = await connectionPool.getConnection();

const isRegistered = async(user_email) => {
    const [result] = await db_connection.query('SELECT * FROM user_info WHERE user_email = ?',
        [user_email]);
        return result;
}

const resetPassword = async(user_data) => {
    const [result] = await db_connection.query('UPDATE user_info SET user_password = ? WHERE user_name = ? AND user_email = ?',
        [user_data.user_password, user_data.user_name, user_data.user_email]);
        return result.affectedRows;
}

export default {
    isRegistered,
    resetPassword
};