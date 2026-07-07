
let state = {
    tasks : JSON.parse(localStorage.getItem('tasks')) || []
}

const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
}

const tasksReducer = (action) => {
    switch (action.type) {
        case 'ADD_TASK':
            state.tasks.push(action.payload)
            break
        case 'DELETE_TASK':
            state.tasks = state.tasks.filter((task) => task.id !== action.payload)
            break
        case 'TOGGLE_TASK':
            const task = state.tasks.find((task) => task.id === action.payload)
            if (task) task.completed = !task.completed
            break
        default:
            return
    }

    saveToLocalStorage()
    renderTasks()
}

export { state, tasksReducer as dispatch }