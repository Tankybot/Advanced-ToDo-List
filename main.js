//SEARCH ENGINE
const $searchInputText = document.querySelector('.search-form__text-input');
const $searchRadioByDate = document.querySelector('#radio1')
const $searchRadioByImportance = document.querySelector('#radio2')
const $searchSelect = document.querySelector('.search-form__select');
//TASK AREA
const $tasksArea = document.querySelector('.toDo__ul');
const $deleteAllButton = document.querySelector('.toDo__delete-all');
//ADD TASK FORM
const $addTextInput = document.querySelector('.add-task__text-input');
const $importantCheckbox = document.querySelector('.add-task__importance-input');
const $addError = document.querySelector('.add-task__error');
const $addTaskBtn = document.querySelector('.add-task__add-button');
//TASK COUNTER
const $progressNumber = document.querySelector('.task-counter__progress-number');
const $importantNumber = document.querySelector('.task-counter__important-number');
const $allNumber = document.querySelector('.task-counter__all-number');
//COLOR CHANGE
const $ligtButton = document.querySelector('.color-select__ligt');
const $darkButton  = document.querySelector('.color-select__dark');
//EDIT POPUP
const $popup = document.querySelector('.popup');
const $popupInput = document.querySelector('.popup__input');
const $popupAccept  = document.querySelector('.popup__accept');
const $popupCancel = document.querySelector('.popup__cancel');
const $popupError = document.querySelector('.popup__error');

//GLOBAL LET VARIABLES 

let $progressAmount = 0;     // A number of tasks not done yet
let $importantAmount = 0;      // number of important tasks
let $allAmount = 0;         //number of all tasks 
let root = document.documentElement;

///////////////////////////////////////////////////////////////////////////////////// 

//ADD EVENT LISTENERS

const startDOMEvenets = () => {
    $addTaskBtn.addEventListener('click', e => {
        e.preventDefault();
        const taskValue = $addTextInput.value
        if(checkIfNotEmpty(taskValue, $addError)){
            addNewTask($tasksArea, taskValue);
            clearInput($addTextInput)
        };
        
    });
    $tasksArea.addEventListener('click', event => {
        deleteTask(event, $tasksArea);
        turnImportant(event);
        turnDone(event);
        editTask(event);
    });
    $popupAccept.addEventListener('click', e => {
        e.preventDefault();
        repleceTask($popupInput)
    });
    $searchRadioByImportance.addEventListener('click', searchStart);
    $searchRadioByDate.addEventListener('click', searchStart);
    $searchInputText.addEventListener('keyup', searchStart);
    $ligtButton.addEventListener('click', changeOnLight);
    $darkButton.addEventListener('click', changeOnDark);
    $deleteAllButton.addEventListener('click', deleteAllTasks);
    $popupCancel.addEventListener('click', closePopup);
};


//                          GLOBAL FUNCTIONS 
// Checking if input is not empty

const checkIfNotEmpty = (taskValue, error)=> {
    if(taskValue === ''){
        error.classList.add('visible');
        error.textContent = 'Enter the task!';
    } else {
        error.classList.remove('visible');
        return true;
    };
};

//CLEARING INPUT
const clearInput = (input) => input.value = ''

//SHOW ITEM
const showItem = (item) => {
    item.classList.add('visible');
}

//HIDE ITEM
const hideItem = (item) => {
    item.classList.remove('visible');
};

//CAPITALIZE FIRST LETTER IN TEXT
const capitalizeFirstLetter = (text) => {
    const newText = text.charAt(0).toUpperCase() + text.slice(1)
    return newText;
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
    showDeleteAllButton();
};

const setTaskInnerHtml = (newTask, taskValue) => {
    newTask.innerHTML = `
    <div class="task">
        <p class="task__text">${capitalizeFirstLetter(taskValue)}</p>
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


//checking if Important was selected in Adding task form

const checkIfImportant  = (newTask, checkbox) => {
    if(checkbox.checked === true) {
        newTask.classList.add('toDo__li--important');
        newTask.dataset.type = 'important'
        checkbox.checked = false;
        $importantAmount++;
    };
};


//                          DELETING ALL TASKS 
const deleteAllTasks = () => {
    $tasksArea.innerHTML = '';
    $progressAmount = 0 ;
    $allAmount = 0;
    $importantAmount = 0;
    countTasks();
    showDeleteAllButton()
};


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
        showDeleteAllButton();
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
//EDIT BUTTON 
const editTask = event => {
    if(event.target.closest('button').classList.contains(`button-box__edit-button`)){
        const editedTask = event.target.closest('li');
        editedTask.dataset.editProgress = 'inProgress';
        openPopup()
    };
};



//                                  SEARCH ENGINE
//Start searching 
const searchStart = () => {
    const allTasks = document.querySelectorAll('.toDo__li')
    checkRadioOption(allTasks);
    checkSelectOption(allTasks);
    CheckTextInput($searchInputText);
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

//Checking if input text is not empty 
const CheckTextInput = (textInput) => {
    if(textInput !== ''){
        searchByInputText(textInput);
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
const searchByInputText = (textInput) => {
    const searchInputValue = textInput.value.toUpperCase();
    const allTaskTexts = document.querySelectorAll('.task__text');

    allTaskTexts.forEach(function (text){
        if(!(text.innerText.toUpperCase().includes(searchInputValue))){
            text.parentElement.parentElement.classList.add('toDo__li--hidden-textInput');
        }else {
            text.parentElement.parentElement.classList.remove('toDo__li--hidden-textInput');
        }
    });
};


//                             CHANGING COLOR 

const changeOnLight = () => {
    root.style.setProperty('--main-color', '#ADD8E6');
    root.style.setProperty('--second-color', '#F5F5F5');
    root.style.setProperty('--border-color', 'rgb(60, 87, 177)');
    root.style.setProperty('--button-color', 'rgb(118, 144, 233)');
    root.style.setProperty('--fourth-color', 'rgb(88, 121, 230)');
    root.style.setProperty('--font-color', 'black');
    root.style.setProperty('--gradient-color', 'rgba(70,166,252)');
    root.style.setProperty('--input-color', 'white');
    root.style.setProperty('--todobutton-color', 'rgb(239, 239, 239)');
    root.style.setProperty('--body-color', 'white');
    root.style.setProperty('--progress-color', '#32CD32')
};

const changeOnDark = () => {
    console.log('ok')
    root.style.setProperty('--main-color', '#888888');
    root.style.setProperty('--second-color', '#B8B8B8');
    root.style.setProperty('--border-color', 'black');
    root.style.setProperty('--button-color', '#686868');
    root.style.setProperty('--fourth-color', '#787878');
    root.style.setProperty('--font-color', 'black');
    root.style.setProperty('--gradient-color', '#585858');
    root.style.setProperty('--input-color', '#E8E8E8');
    root.style.setProperty('--todobutton-color', '#E8E8E8');
    root.style.setProperty('--body-color', '#E8E8E8');
    root.style.setProperty('--progress-color', '#008000')
    root.style.setProperty('--popunderline-color', '#585858')
};

//                                EDITING TASK 
//Closing popup 
const closePopup = () => {  
    hideItem($popup);
    clearInput($popupInput);
    removeEditData();
};

//Removing data edit progress 
const removeEditData = () => {
    const allTasks = document.querySelectorAll('.toDo__li')
    allTasks.forEach(function (element) {
        if(element.dataset.editProgress === 'inProgress') {
            element.dataset.editProgress = null;
        }; 
    });
};

//Opening popup
const openPopup = () => {
    showItem($popup)
};

//Replecing Task content

const repleceTask = (popupInput) => {
    const allTasks = document.querySelectorAll('.toDo__li')
    const newTask = popupInput.value 
    if(checkIfNotEmpty(newTask, $popupError)){
        allTasks.forEach(function (element){
            if(element.dataset.editProgress === 'inProgress') {
                element.childNodes[1].childNodes[1].innerText = capitalizeFirstLetter(newTask);
                element.dataset.editProgress = null;
            };   
        });

        closePopup();
    };
};

//                  Show and hide delete all button

const showDeleteAllButton = () => {
    if($allAmount >= 1){
        showItem($deleteAllButton);
    } else {
        hideItem($deleteAllButton);
    };
};







document.addEventListener('DOMContentLoaded', startDOMEvenets);








