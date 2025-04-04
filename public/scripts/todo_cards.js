// elements from the document
const addNewTitle = document.querySelector('#title');
const addNewDescription = document.querySelector('#description');
const saveNewTodo = document.querySelector('#save');

// elements that we need for to update or delete todos
// preview-cards
const previewTodos = document.querySelectorAll('.todo-card-preview');
const previewInputs = document.querySelectorAll('.todo-input-preview');
const previewCompleted = document.querySelectorAll('.todo-completed-preview');
const previewUpdateBtns = document.querySelectorAll('.todo-update-preview');
const previewDeleteBtns = document.querySelectorAll('.todo-delete-preview');

// full-view-cards 

const fullviewTodos = document.querySelectorAll('.todo-card');
const fullviewInputs = document.querySelectorAll('.todo-input-fullview');
const fullviewTextareas = document.querySelectorAll('.todo-textarea-fullview');
const fullviewCompleted = document.querySelectorAll('.todo-completed-fullview');
const fullviewUpdateBtns = document.querySelectorAll('.todo-update-fullview');
const fullviewDeleteBtns = document.querySelectorAll('.todo-delete-fullview');

// modal window that shows different errors

const modalWindowErrors = document.querySelector('.modal-window-errors');
const btnCloseErrors = document.querySelector('.errors-close');
const containerForErrors = document.querySelector('.container-for-errors');
const btnOkErrors = document.querySelector('.btn-ok-errors');

// modal window that shows some addtional functions of the app

const allDeletedTasks = document.querySelector('.deletedTasks');
const bringDeletedTasksBack = document.querySelector('.bringDeletedTasksBack');
const btnDeleteAccount = document.querySelector('.deleteAccount');

// elements to delete the whole account

const extraQuestion = document.querySelector('.current-info');
const btnDeleteForever = document.querySelector('.btn-delete-account');

const urlQueries = new URLSearchParams(window.location.search);
const rules = urlQueries.get('rules');

const currentURL = window.location.href;
const regExpID = /\/(\d+)/;
const extractedID = currentURL.match(regExpID)[1];


function informUser() {
    if (rules === '0') {
        modalWindow.style.display = 'block';
        btnClose.onclick = () => {
            modalWindow.style.display = 'none';
        }
    }
}

function handlingValidationErrors(errors) {
    errors.forEach((err) => {
        const newError = document.createElement('span');
        newError.innerHTML = `<img src="/pictures_and_icons/favicon_single.png" /> ${err} \n`;
        containerForErrors.appendChild(newError);
    })
    btnCloseErrors.onclick = () => {
        while (errors.length) {
            errors.pop();
        }
        while (containerForErrors.firstChild) {
            containerForErrors.removeChild(containerForErrors.firstChild);
        }
        modalWindowErrors.style.display = 'none';
    }
    btnOkErrors.onclick = () => {
        while (errors.length) {
            errors.pop();
        }
        while (containerForErrors.firstChild) {
            containerForErrors.removeChild(containerForErrors.firstChild);
        }
        modalWindowErrors.style.display = 'none';
    }
    modalWindowErrors.style.display = 'block';
    modalWindowErrors.style.zIndex = '2';
}

async function collectServerErrors(response) {
    const result = await response.json();
    const errorMessage = [];
    for (let i = 0; i < result.errorMessage.length; i++) {
        errorMessage.push(result.errorMessage[i].msg);
    }
    handlingValidationErrors(errorMessage);
}

// add a function that can handle errors that are not sent by express-validator

async function collectServerErrors_2(response) {
    const result = await response.json();
    const errorMessage = [];
    errorMessage.push(result.errorMessage);
    handlingValidationErrors(errorMessage);
}

async function sendNewTodo(data) {
    try {
        return await fetch(`/todos/list/${extractedID}/newTodo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred while adding a new todo-card to the list: ${error}`);
    }
}

function createNewTodo() {
    saveNewTodo.onclick = async (event) => {
        event.preventDefault();
        const newTodo = {
            todo_status: 0,
            todo_deleted: 0
        };

        const errors = [];
        if (addNewTitle.value.length === 0 || addNewTitle.value.length > 60) {
            errors.push("Titles of your tasks in todo-cards mustn't be empty, but they also mustn't be longer than 60 symbols.");
        } else {
            newTodo.todo_title = addNewTitle.value;
        }
        if (addNewDescription.value.length > 200) {
            errors.push("Descriptions of your tasks in todo-cards mustn't be longer than 200 symbols.");
        } else {
            newTodo.todo_description = addNewDescription.value;
        }

        // check if there are any error messages in the array

        if (errors.length) {
            handlingValidationErrors(errors);
        } else {
            const response = await sendNewTodo(newTodo);

            if (response.status === 200) {
                window.location.href = response.url;
            } 
            if (response.status === 422) {
                await collectServerErrors(response);
            }
            if (response.status === 400) {
                await collectServerErrors_2(response);
            }
        }
    }
}

async function sendUpdatedTodo(data) {
    try {
        return await fetch(`/todos/list/${extractedID}/updateTodo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`This error occurred while updating an existing todo: ${error}`);
    }
}

function updateTodo() {
    previewUpdateBtns.forEach((updateBtn) => {
        updateBtn.onclick = async (event) => {
            event.preventDefault();
            const updatedTodo = {};
            updatedTodo.todo_id = updateBtn.dataset.number;
            for (let i = 0; i < previewUpdateBtns.length; i++) {
                if (previewInputs[i].dataset.number === updateBtn.dataset.number) {
                    updatedTodo.todo_title = previewInputs[i].value;
                }
                if (previewCompleted[i].dataset.number === updateBtn.dataset.number) {
                    if (previewCompleted[i].checked === true) {
                        updatedTodo.todo_status = 1;
                    } else {
                        updatedTodo.todo_status = 0;
                    }
                }
            }
            const response = await sendUpdatedTodo(updatedTodo);
            if (response.status === 200) {
                window.location.href = response.url;
            }
        }
    });

    fullviewUpdateBtns.forEach((updateBtn) => {
        updateBtn.onclick = async (event) => {
            event.preventDefault();
            const errors = [];
            const updatedTodo = {};

            updatedTodo.todo_id = updateBtn.dataset.number;
            for (let i = 0; i < fullviewUpdateBtns.length; i++) {
                if (fullviewInputs[i].dataset.number === updateBtn.dataset.number) {
                    updatedTodo.todo_title = fullviewInputs[i].value;
                }
                if (fullviewTextareas[i].dataset.number === updateBtn.dataset.number) {
                    if (fullviewTextareas[i].value.length > 200) {
                        errors.push("Descriptions of your tasks in todo-cards mustn't be longer than 200 symbols.");
                    } else {
                        updatedTodo.todo_description = fullviewTextareas[i].value;
                    }
                }
                if (fullviewCompleted[i].dataset.number === updateBtn.dataset.number) {
                    if (fullviewCompleted[i].checked === true) {
                        updatedTodo.todo_status = 1;
                    } else {
                        updatedTodo.todo_status = 0;
                    }
                }
            }
            if (errors.length) {
                handlingValidationErrors(errors);
            } else {
                const response = await sendUpdatedTodo(updatedTodo);
                if (response.status === 200) {
                    window.location.href = response.url;
                }
            }
        }
    })
}

async function sendDeleteTodo(data) {
    try {
        return await fetch(`/todos/list/${extractedID}/deleteTodo`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`An error occurred while deleting one of the todos: ${error}`);
    }
}

function deleteTodo() {
    previewDeleteBtns.forEach((deleteBtn) => {
        deleteBtn.onclick = async (event) => {
            event.preventDefault();
            const deleteTodoCard = {};
            for (let i = 0; i < previewDeleteBtns.length; i++) {
                if (previewTodos[i].dataset.number === deleteBtn.dataset.number) {
                    deleteTodoCard.todo_id = deleteBtn.dataset.number;
                    deleteTodoCard.todo_deleted = 1;
                }
            }
            const response = await sendDeleteTodo(deleteTodoCard);
            if (response.url) {
                window.location.href = response.url;
            } else {
                console.error('An error occurred while deleting a todo-card');
            }
        }
    });
    fullviewDeleteBtns.forEach((deleteBtn) => {
        deleteBtn.onclick = async (event) => {
            event.preventDefault();
            const deleteTodoCard = {};
            for (let i = 0; i < fullviewDeleteBtns.length; i++) {
                if (fullviewTodos[i].dataset.number === deleteBtn.dataset.number) {
                    deleteTodoCard.todo_id = deleteBtn.dataset.number;
                    deleteTodoCard.todo_deleted = 1
                }
            }
            const response = await sendDeleteTodo(deleteTodoCard);
            if (response.url) {
                window.location.href = response.url;
            } else {
                console.error('An error occurred while deleting a todo-card');
            }
        }
    })
}
async function bringBack(data) {
    try {
        return await fetch(`/todos/list/${extractedID}/bringDeletedCardsBack`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.error(`An error occurred while bringing the deleted tasks back: ${error}`);
    }
}

function bringDeletedCardsBack() {
    bringDeletedTasksBack.onclick = async (event) => {
        event.preventDefault();
        const bringCardsBack = { user_id: extractedID };
        const response = await bringBack(bringCardsBack);
        if (response.url) {
            window.location.href = response.url;
        } else {
            console.error('An error while bringing back');
        }
    }
}

function showDeletedTodos() {
    allDeletedTasks.onclick = async () => {
        const response = await fetch(`/todos/list/${extractedID}/showDeletedCards`);
        if (response.url) {
            window.location.href = response.url;
        }
    }
}

async function sendDeleteAccount() {
    try {
        return await fetch(`/todos/list/${extractedID}/deleteAccount`, {
            method: 'DELETE'
        })
    } catch (error) {
        console.error('This error occurred while deleting the account ', error);
    }
}

function deleteAccount() {
    btnDeleteAccount.onclick = () => {
        extraQuestion.style.animation = 'opacityChanger 2s ease';
        extraQuestion.style.visibility = 'visible';
        
        setTimeout(() => {
            btnDeleteForever.style.animation = 'opacityChanger 2s ease';
            btnDeleteForever.style.visibility = 'visible';
        }, 1000);

        btnDeleteForever.onclick = async () => {
            const response = await sendDeleteAccount();
            if (response.status === 200) {
                const msg = [];
                const result = await response.json();
                msg.push(result.successMessage);
                handlingValidationErrors(msg);

                setTimeout(() => {
                    window.location.href = `/todos`;
                }, 3000);
            }
            if (response.status === 400) {
                const msg = [];
                const result = await response.json();
                msg.push(result.errorMessage);
                handlingValidationErrors(msg);

                setTimeout(() => {
                    window.location.href = `/todos`;
                }, 3000);
            }
        }
    }
}



function init() {
    showInfo();
    changeView();
    informUser();
    createNewTodo();
    updateTodo();
    deleteTodo();
    bringDeletedCardsBack();
    showDeletedTodos();
    deleteAccount();
}

window.addEventListener('DOMContentLoaded', init);