// elements from the document
const addNewTitle = document.querySelector('#title');
const addNewDescription = document.querySelector('#description');
const saveNewTodo = document.querySelector('#save');


const urlQueries = new URLSearchParams(window.location.search);

//const currentURL = window.location.href;
//const regExpID = /\/(\d+)\?/;
//console.log(currentURL.match(regExpID));

const rules = urlQueries.get('rules');

function informUser () {
    if(rules === '0') {
        modalWindow.style.display = 'block';
        btnClose.onclick = () => {
            modalWindow.style.display = 'none';
        }
    }
}

function createNewTodo () {
    saveNewTodo.onclick = (event) => {
        event.preventDefault();
        const newTodo = {
            todo_title: addNewTitle.value,
            todo_description: addNewDescription.value,
            todo_status: 0

        }
        console.log(newTodo);
    }
}

function init () {
    showInfo();
    changeView();
    informUser();
    createNewTodo();

}

window.addEventListener('DOMContentLoaded', init);