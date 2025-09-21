let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

const form = document.getElementById('reminder-form');
const titleInput = document.getElementById('title');
const datetimeInput = document.getElementById('datetime');
const reminderList = document.getElementById('reminder-list');
const emptyMsg = document.getElementById('empty-msg');

form.addEventListener('submit', e => {
    e.preventDefault();
    const now = new Date();
    const target = new Date(datetimeInput.value);
    if(target <= now){
        alert("Please choose a future date/time!");
        return;
    }
    const reminder = {
        id: Date.now(),
        title: titleInput.value,
        datetime: datetimeInput.value
    };
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    titleInput.value = '';
    datetimeInput.value = '';
    renderReminders();
});

function renderReminders(){
    reminderList.innerHTML = '';
    if(reminders.length === 0){
        emptyMsg.style.display = 'block';
        return;
    } else emptyMsg.style.display = 'none';

    reminders.forEach(reminder => {
        const li = document.createElement('li');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('reminder-info');
        const title = document.createElement('span');
        title.classList.add('reminder-title');
        title.textContent = reminder.title;
        const countdown = document.createElement('span');
        countdown.classList.add('reminder-countdown');
        infoDiv.appendChild(title);
        infoDiv.appendChild(countdown);

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('reminder-actions');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteReminder(reminder.id));
        actionsDiv.appendChild(deleteBtn);

        li.appendChild(infoDiv);
        li.appendChild(actionsDiv);
        reminderList.appendChild(li);

        reminder.countdownEl = countdown;
    });
}

function deleteReminder(id){
    reminders = reminders.filter(r => r.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
}

function updateAllCountdowns(){
    const now = new Date().getTime();
    reminders.forEach(reminder => {
        const target = new Date(reminder.datetime).getTime();
        const diff = target - now;
        if(diff <= 0){
            reminder.countdownEl.textContent = "⏰ Time's up!";
        } else {
            const days = Math.floor(diff / (1000*60*60*24));
            const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
            const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
            const seconds = Math.floor((diff % (1000*60)) / 1000);
            reminder.countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    });
}

renderReminders();
setInterval(updateAllCountdowns, 1000);
