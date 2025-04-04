import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_todolist'
});

const connectionTransaction = await connectionPool.getConnection();

const DB_START = {
    registerUser: async(user_data) => {
        const [result] = await connectionTransaction.query('INSERT INTO user_info(user_name, user_email, user_password, user_knows_the_rules) VALUES(?, ?, ?, ?)',
            [user_data.user_name, user_data.user_email, user_data.user_password, user_data.user_knows_the_rules]);
        return result.insertId;
    },
    createTodos: async(userID) => {
        await connectionTransaction.query(`CREATE TABLE todos_for_${userID} AS SELECT * FROM todos`);
        await connectionPool.query(`ALTER TABLE todos_for_${userID} MODIFY todo_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT`);
    }
}

const createAccount = async(user_data) => {
    try {
        await connectionTransaction.beginTransaction();
        const userID = await DB_START.registerUser(user_data);
        await DB_START.createTodos(userID);
        await connectionTransaction.commit();
        return userID;
    } catch (error) {
        await connectionTransaction.rollback();
        console.error(`An error occurred while performing transactions: ${error}`);
    } finally {
        connectionTransaction.release();
    }
}


export default createAccount;