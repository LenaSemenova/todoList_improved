import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_todolist'
});

const connectionTransaction = await connectionPool.getConnection();

const DB_DELETE = {
    deleteTodos: async(user_id) => {
        const [result] = await connectionTransaction.query(`DROP TABLE todos_for_${user_id}`);
        return result;
    },
    deleteUserInfo: async(user_id) => {
        const [result] = await connectionTransaction.query(`DELETE FROM user_info WHERE user_id = ?`,
            [user_id]);
        return result;
    }
}

const deleteAccountForever = async(user_id) => {
    try {
        await connectionTransaction.beginTransaction();
        await DB_DELETE.deleteTodos(user_id);
        await DB_DELETE.deleteUserInfo(user_id);
        await connectionTransaction.commit();
        return true;
    } catch (error) {
        await connectionTransaction.rollback();
        console.error(`An error occurred while performing transactions: ${error}`);
    } finally {
        connectionTransaction.release();
    }
}

export default deleteAccountForever;