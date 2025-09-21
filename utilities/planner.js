let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const form = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const timeInput = document.getElementById('task-time');
const taskList = document.getElementById('task-list');
const filter = document.getElementById('filter');

// Add task
form.addEventListener('submit', function(e){
    e.preventDefault();
    const task = {
        id: Date.now(),
        title: titleInput.value,
        description: descInput.value,
        time: timeInput.value,
        completed: false
    };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
    form.reset();
});

// Filter tasks
filter.addEventListener('change', renderTasks);

// Render tasks
function renderTasks(){
    taskList.innerHTML = '';
    let filtered = filter.value === 'all' ? tasks : tasks.filter(t => filter.value === 'completed' ? t.completed : !t.completed);

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.classList.toggle('completed', task.completed);

        li.innerHTML = `
            <div class="task-info">
                <strong>${task.title} (${task.time})</strong>
                <p>${task.description}</p>
            </div>
            <div class="task-actions">
                <button onclick="toggleComplete(${task.id})"><i class="fa-solid fa-check"></i></button>
                <button onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Toggle complete
function toggleComplete(id){
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Delete task
function deleteTask(id){
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

// Initial render
renderTasks();
