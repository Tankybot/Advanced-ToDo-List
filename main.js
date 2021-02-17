//SEARCH ENGINE
const $searchInputText = document.querySelector('.search-form__text-input');
const $searchRadioByDate = document.querySelector('#radio1')
const $searchRadioByImportance = document.querySelector('#radio2')
const $searchSelect = document.querySelector('.search-form__select');
//TASK AREA
const $tasksArea = document.querySelector('.toDo__ul');
//ADD TASK FORM
const $addTextInput = document.querySelector('.add-task__text-input');
const $importantCheckbox = document.querySelector('.add-task__importance-input');
const $addError = document.querySelector('.add-task__error');
const $addTaskBtn = document.querySelector('.add-task__add-button');
//TASK COUNTERZZ
const $progressNumber = document.querySelector('.task-counter__progress-number');
const $importantNumber = document.querySelector('.task-counter__important-number');
const $allNumber = document.querySelector('.task-counter__all-number');
//GLOBAL LET VARIABLES 

let $progressAmount = 0;     // A number of tasks not done yet
let $importantAmount = 0;      // number of important tasks
let $allAmount = 0;         //number of all tasks 

/////////////////////////////////////////////////////////////////////////////////////

//ADD EVENT LISTENERS

const startDOMEvenets = () => {
    $addTaskBtn.addEventListener('click', e => {
        e.preventDefault();
        checkIfNotEmpty($addTextInput.value, $addError);
    });
    $tasksArea.addEventListener('click', event => {
        deleteTask(event, $tasksArea);
        turnImportant(event);
        turnDone(event);
    });
    $searchRadioByImportance.addEventListener('click', searchStart)
    $searchRadioByDate.addEventListener('click', searchStart)
    $searchInputText.addEventListener('change', searchStart)

};

//                          ADDING NEW TASK FORM
// CREATING NEW TASK 

const addNewTask = (taskArea, taskValue) => {
    const newTask = document.createElement('li');
    checkIfImportant(newTask, $importantCheckbox);
    setTaskInnerHtml(newTask, taskValue)

    newTask.classList.add(`toDo__li`);
    taskArea.appendChild(newTask);

    $progressAmount++;
    $allAmount++;
    countTasks();
    searchStart();
};

const setTaskInnerHtml = (newTask, taskValue) => {
    newTask.innerHTML = `
    <div class="task">
        <p class="task__text">${taskValue}</p>
        <p class="task__date">${setTime()}</p>
    </div>
    <div class="button-box">
        <button class="button-box__edit-button">EDIT</button>
        <button class="button-box__important"><i class="fas fa-exclamation"></i></button>
        <button class="button-box__done-button"><i class="fas fa-check"></i></button>
        <button class="button-box__delete-button"><i class="fas fa-times"></i></button>
    </div>`
};

//seting date of task
const setTime = () => {
    const newDate = new Date();
    const timeToString = (method) => {
        let time;
        method <= 9 ? time = `0${method}` : time = method;
        return time;
    };

    const month =  timeToString(newDate.getMonth()+1);
    const day = timeToString(newDate.getDate());
    const hour = timeToString(newDate.getHours());
    const minutes = timeToString(newDate.getMinutes());
    const seconds = timeToString(newDate.getSeconds());

    const dateString = `${day}.${month}  ${hour}:${minutes}:${seconds}`
    return dateString
};

// Checking if add input area is not empty 

const checkIfNotEmpty = (taskValue, error)=> {
    if(taskValue === ''){
        error.classList.add('add-task__error--visible');
        error.textContent = 'Enter the task!';
    } else {
        addNewTask($tasksArea, taskValue);
        clearAddInput(taskValue);
        error.classList.remove('add-task__error--visible');
    };
};

//checking if Important was selected in Adding task form

const checkIfImportant  = (newTask, checkbox) => {
    if(checkbox.checked === true) {
        newTask.classList.add('toDo__li--important');
        newTask.dataset.type = 'important'
        checkbox.checked = false;
        $importantAmount++;
    };
};

// Clearing input value in add section

const clearAddInput = () => $addTextInput.value = ''


//                           TASK COUNTER
//Counting tasks

const countTasks = () => {
    $progressNumber.textContent = $progressAmount;
    $importantNumber.textContent = $importantAmount;
    $allNumber.textContent = $allAmount;
};




//                           TASK buttons
// Delete task 

const deleteTask = (event, parent) => {
        if(event.target.closest('button').classList.contains(`button-box__delete-button`)){
            const deletedTask = event.target.closest('li');
            deleteTaskFromCounter(deletedTask);
            parent.removeChild(deletedTask);
        };
    };

//checking type 

const typeCheck = (targertedTask) => {
    return targertedTask.dataset.type;
};

// Deleting number from counter by type 
const deleteTaskFromCounter = (targetedTask) => {
    const typeOfTask = typeCheck(targetedTask);
    if(typeOfTask === 'important') {
        $importantAmount --;
        $progressAmount --;
    } else if(typeOfTask !== 'done') {
        $progressAmount --;
    };
    $allAmount --;

    countTasks()
};

//Turning important class on/off

const turnImportant = (event) => {
    const targetedTask = event.target.closest('li') 
    const targetedTaskType = typeCheck(targetedTask);
    if(event.target.closest('button').classList.contains('button-box__important')){
        if(targetedTaskType === 'important'){
            targetedTask.classList.remove('toDo__li--important');
            targetedTask.dataset.type = null
            $importantAmount --
        } else if(targetedTaskType === 'done') {
            targetedTask.classList.remove('toDo__li--done');
            targetedTask.classList.add('toDo__li--important');
            targetedTask.dataset.type = 'important'
            $importantAmount ++;
            $progressAmount ++;
        } else {
            targetedTask.classList.add('toDo__li--important');
            targetedTask.dataset.type = 'important';
            $importantAmount ++;
        };
    };

    countTasks()
    searchStart()
};


// TURNING on/off done class 
const turnDone = (event) => {
    const targetedTask = event.target.closest('li') 
    const targetedTaskType = typeCheck(targetedTask);
    if(event.target.closest('button').classList.contains('button-box__done-button')){
        if(targetedTaskType === 'done'){
            targetedTask.classList.remove('toDo__li--done');
            targetedTask.dataset.type = null
            $progressAmount ++
        } else if(targetedTaskType === 'important') {
            targetedTask.classList.remove('toDo__li--important');
            targetedTask.classList.add('toDo__li--done');
            targetedTask.dataset.type = 'done';
            $progressAmount --;
            $importantAmount --;
        } else {
            targetedTask.classList.add('toDo__li--done');
            targetedTask.dataset.type = 'done';
            $progressAmount --;
        };
    };

    countTasks()
    searchStart()
};



//                                               SEARCH ENGINE
//Start searching 
const searchStart = () => {
    const allTasks = document.querySelectorAll('.toDo__li')
    checkRadioOption(allTasks);
    checkSelectOption(allTasks);
    searchByInputText(allTasks);
};

// Checking which RADIO option is checked
const checkRadioOption = allTasks => {
    if($searchRadioByImportance.checked) {
        searchByImportance(allTasks);
    } else {
        searchByDate(allTasks);
    };
};

//checking which SELECT option is checked
const checkSelectOption = allTasks => {
    if($searchSelect.options[$searchSelect.selectedIndex].text === 'In Progress'){
        searchInProgressOnly(allTasks);
    } else if($searchSelect.options[$searchSelect.selectedIndex].text === 'Done'){
        searchDoneOnly(allTasks);
    } else {
        searchAll(allTasks);
    };
};


//Search by importance 

const searchByImportance = allTasks => {
    allTasks.forEach(function (element){
        if(element.dataset.type === 'important') {
            element.classList.add('toDo__li--ordered-two');
        } else if(element.dataset.type !== 'done') {
            element.classList.add('toDo__li--ordered-one');
        } else {
            element.classList.remove('toDo__li--ordered-two');
            element.classList.remove('toDo__li--ordered-one');
        }
    });
};

//Search by date 

const searchByDate = allTasks => {
    allTasks.forEach(function (element){
        if(element.dataset.type === 'important') {
            element.classList.remove('toDo__li--ordered-two');
        } else if(element.dataset.type !== 'done') {
            element.classList.remove('toDo__li--ordered-one');
        };
    });
};

//Search In progress only 
const searchInProgressOnly = allTasks => {
    allTasks.forEach(function (element){
        if(element.dataset.type === 'done') {
            element.classList.add('toDo__li--hidden');
        } else {
            element.classList.remove('toDo__li--hidden');
        };
    });
};

//Search Done only 

const searchDoneOnly = allTasks => {
    allTasks.forEach(function (element){
        if(element.dataset.type !== 'done') {
            element.classList.add('toDo__li--hidden');
        } else {
            element.classList.remove('toDo__li--hidden');
        };
    });
};

//Search all 
const searchAll = allTasks => {
    allTasks.forEach(function (element){
        element.classList.remove('toDo__li--hidden');
    });
};

//Search by input text
const searchByInputText = allTasks => {
    const searchInputValue = $searchInputText.value.toUpperCase()
    const allTaskTexts = document.querySelectorAll('.task__text')
    if(allTasks.length > 1){
        for(let i=0; i<=allTasks.length; i++){
            if(!(allTaskTexts[i].innerText.toUpperCase().includes(searchInputValue))){
                allTasks[i].classList.add('toDo__li--hidden');
            };
        };
    };
};









document.addEventListener('DOMContentLoaded', startDOMEvenets);








