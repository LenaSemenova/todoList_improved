// elements from the page todos_deleted.ejs

const bringCardsBack = document.querySelectorAll('.bringDeletedTasksBack');
const todoCards = document.querySelectorAll('.todo-card');
const btnGoBack = document.querySelector('.btn-informed');

const currentURL = window.location.href;
const regExpID = /\/(\d+)/;
const extractedID = currentURL.match(regExpID)[1];

async function sendDeletedCardsBack (data) {
    try {
    return await fetch(`/todos/list_deleted/${extractedID}/bringCardsBack`, {
        method: 'PUT',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(data)
    })
    } catch(error) {
        console.error(`This error occurred while changing the deleted status of the card: ${error}`);
    } 
}

function bringDeletedTodosBack () {
    bringCardsBack.forEach((btnBringBack) => {
        btnBringBack.onclick = async(event) => {
            event.preventDefault();
            const todoChangeDeleted = {};

            for (let i = 0; i < bringCardsBack.length; i++) {
                if (todoCards[i].dataset.number === btnBringBack.dataset.number) {
                    todoChangeDeleted.todo_id = btnBringBack.dataset.number;
                    todoChangeDeleted.todo_deleted = 0;
                }
            }
            const response = await sendDeletedCardsBack(todoChangeDeleted);
            if (response.url) {
                window.location.href = response.url;
            } else {
                console.error(`Something went wrong while sending the new status of the card.`);
            }
        }
    }) 
}

function goBack () {
    btnGoBack.onclick = () => {
        window.location.href = `/todos/list/${extractedID}`;
    }
}

function init () {
    bringDeletedTodosBack();
    goBack();
}

window.addEventListener('DOMContentLoaded', init);
