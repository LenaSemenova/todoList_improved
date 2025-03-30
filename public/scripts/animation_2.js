// elements from the page with todo-cards
const changePreview = document.querySelectorAll('.changePreview');
const changeFullView = document.querySelectorAll('.changeFullView');
const todoCardPreview = document.querySelectorAll('.todo-card-preview');
const todoCardFullView = document.querySelectorAll('.todo-card');

// settings for modal windows (ADDITIONAL SETTINGS SUCH AS REDIRECTING USERS TO DELETED TASKS ...)
const btnModalWindow = document.querySelector('.btn-informed');
const modalWindow = document.querySelector('.modal-window');
const btnClose = document.querySelector('.close');

function showInfo() {
    btnModalWindow.onclick = () => {
        modalWindow.style.display = 'block';
    }
    btnClose.onclick = () => {
        modalWindow.style.display = 'none';
    }
}

function changeView() {
    changePreview.forEach((btn) => {
        btn.onclick = (event) => {
            event.preventDefault();
            for (let i = 0; i < todoCardPreview.length; i++) {
                if (todoCardPreview[i].dataset.number === btn.dataset.number) {
                    todoCardPreview[i].style.display = 'none';
                    todoCardFullView[i].style.display = 'block';
                }
            }
        }
    });

    changeFullView.forEach((btn) => {
        btn.onclick = (event) => {
            event.preventDefault();
            for (let i = 0; i < todoCardFullView.length; i++) {
                if (todoCardFullView[i].dataset.number === btn.dataset.number) {
                    todoCardFullView[i].style.display = 'none';
                    todoCardPreview[i].style.display = 'block';
                }
            }
        }
    })
}