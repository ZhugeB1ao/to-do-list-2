import { state, dispatch} from "./store.js";

const taskInput = document.querySelector(".input-add");
const addTaskBtn = document.querySelector("#button-add");
const tasksFindInput = document.querySelector(".input-find");
const tasksList = document.querySelector(".todo-list");

// Render tasks based on the current state and search input
const renderTasks = () => {
    const searchText = tasksFindInput.value.trim().toLowerCase();
    const filteredTasks = state.tasks.filter(task => task.desc.toLowerCase().includes(searchText));
    tasksList.innerHTML = '';

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
          <div class="todo-item">
            <p class="todo-desc">${task.desc}</p>
            <div class="todo-actions">
                <input type="checkbox" id="checkbox-1" class="checkbox" data-id="${task.id}">
                <button class="button-delete" data-id="${task.id}">x</button>
            </div>
          </div>
        `;

        li.querySelector('.checkbox').addEventListener('change', () => {
            dispatch({ type: 'TOGGLE_TASK', payload: task.id });
            renderTasks();
        });

        li.querySelector('.button-delete').addEventListener('click', () => {
            dispatch({ type: 'DELETE_TASK', payload: task.id });
            renderTasks();
        });

        tasksList.appendChild(li);
    });
}

// Add new task use redux fake
addTaskBtn.addEventListener('click', () => {
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

renderTasks();