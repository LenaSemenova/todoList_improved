import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mySQLpass',
    database: 'petproject_todolist'
});

const db_connection = await connectionPool.getConnection();

const addNewTodo = async(user_id, newTodo) => {
    const [result] = await db_connection.query(`INSERT INTO todos_for_${user_id} (todo_title, todo_description, todo_status, todo_deleted) VALUES(?, ?, ?, ?)`,
        [newTodo.todo_title, newTodo.todo_description, newTodo.todo_status, newTodo.todo_deleted]);
    return result;
}

const updateTodo = async(user_id, updatedTodo) => {
    const [result] = await db_connection.query(`UPDATE todos_for_${user_id} SET todo_title = ?, todo_description = ?, todo_status = ? WHERE todo_id = ?`, 
                                                [updatedTodo.todo_title, updatedTodo.todo_description, updatedTodo.todo_status, updatedTodo.todo_id]);
    return result;                                            
}

const deleteTodo = async(user_id, deleteTodo) => {
    const [result] = await db_connection.query(`UPDATE todos_for_${user_id} SET todo_deleted = ? WHERE todo_id = ?`,
        [deleteTodo.todo_deleted, deleteTodo.todo_id]);
    return result;
}

const bringDeletedTodosBack = async(user_id) => {
    const [result] = await db_connection.query(`UPDATE todos_for_${user_id} SET todo_deleted = 0`);
    return result;
}

export default {
    addNewTodo,
    updateTodo,
    deleteTodo,
    bringDeletedTodosBack
}