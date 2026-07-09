import { state, dispatch} from "./store.js";

const taskInput = document.querySelector(".input-add");
const addTaskSec = document.querySelector(".add-section");
const tasksFindInput = document.querySelector(".input-find");
const tasksList = document.querySelector(".todo-list");

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

        li.querySelector('.checkbox').addEventListener('change', () => {
            dispatch({ type: 'TOGGLE_TASK', payload: task.id });
        });

        li.querySelector('.button-delete').addEventListener('click', () => {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            renderTasks();
        });

        tasksList.appendChild(li);
    });

    updateTaskCount();
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


renderTasks();