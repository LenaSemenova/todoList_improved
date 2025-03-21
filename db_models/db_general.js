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

export default isRegistered;