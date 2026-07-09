import { state, dispatch} from "./store.js";

const taskInput = document.querySelector(".input-add");
const addTaskSec = document.querySelector(".add-section");
const tasksFindInput = document.querySelector(".input-find");
const tasksList = document.querySelector(".todo-list");
const findSection = document.querySelector(".find-section");

// Render tasks based on the current state and search input
const renderTasks = () => {
    const searchText = tasksFindInput.value.trim().toLowerCase();
    const filteredTasks = state.tasks.filter(task => task.desc.toLowerCase().includes(searchText));
    tasksList.innerHTML = '';

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `todo-item border-box${task.completed ? " completed" : ""}`;
        li.innerHTML = `
            <input
                type="checkbox"
                id="checkbox-${task.id}"
                class="checkbox"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
              />

            <p class="todo-desc">
                <span class="todo-desc-text">
                    ${task.desc}
                </span>
            </p>

            <button
                class="button-delete"
            >
                <span
                    class="material-symbols-outlined delete-icon"
                    data-icon="delete"
                    data-id="${task.id}"
                    >delete</span
                >
            </button>
        `;

        const checkbox = li.querySelector('.checkbox');
        checkbox.addEventListener('change', (event) => {
            dispatch({
                type: 'TOGGLE_TASK',
                payload: task.id
            });

            li.classList.toggle('completed', event.currentTarget.checked);
        });

        li.querySelector('.button-delete').addEventListener('click', () => {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            renderTasks();
        });

        tasksList.appendChild(li);
    });

    updateTaskCount();
    hideButtonsIfNoTasks();
}

// Add new task use redux fake
addTaskSec.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (!text) return;

    dispatch({
        type: 'ADD_TASK',
        payload: { id: Date.now(), desc: text, completed: false }
    });

    taskInput.value = '';
    renderTasks();
});

// Find task call renderTasks on input change
tasksFindInput.addEventListener('input', () => {
    renderTasks();
});

// Count tasks
const infoCount = document.querySelector(".info-count");
const updateTaskCount = () => {
    const totalTasks = state.tasks.length;
    infoCount.textContent = `${totalTasks}`;
};

// Mark all tasks as completed
const buttonDoneAll = document.querySelector(".button-done");
buttonDoneAll.addEventListener('click', () => {
    dispatch({ type: 'MARK_ALL_TASKS_COMPLETED' });
    const taskItems = tasksList.querySelectorAll('.todo-item');

    taskItems.forEach((item) => {
        const checkbox = item.querySelector('.checkbox');

        if (!checkbox.checked) {
            checkbox.checked = true;
            item.classList.add('completed');
        }
    });
});

// Clear all tasks
const buttonClearAll = document.querySelector(".button-clear");
buttonClearAll.addEventListener('click', () => {
    dispatch({ type: 'DELETE_ALL_TASKS' });
    renderTasks();
});

// Hide funtions if there are no tasks
const hideButtonsIfNoTasks = () => {
    const totalTasks = state.tasks.length;
    buttonDoneAll.style.display = totalTasks > 0 ? 'inline-block' : 'none';
    buttonClearAll.style.display = totalTasks > 0 ? 'inline-block' : 'none';
    findSection.style.display = totalTasks > 0 ? 'block' : 'none';
};

// Initial render
renderTasks();