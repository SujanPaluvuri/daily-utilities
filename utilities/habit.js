let habits = JSON.parse(localStorage.getItem('habits')) || [];

const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');

// Add Habit
habitForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const habit = {
    id: Date.now(),
    name: habitInput.value,
    completed: false
  };
  habits.push(habit);
  localStorage.setItem('habits', JSON.stringify(habits));
  habitInput.value = '';
  renderHabits();
});

// Render Habits
function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach(habit => {
    const li = document.createElement('li');
    li.classList.toggle('completed', habit.completed);

    li.innerHTML = `
      <span>${habit.name}</span>
      <div class="habit-actions">
        <button class="complete-btn">${habit.completed ? 'Undo' : 'Done'}</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Complete button
    li.querySelector('.complete-btn').addEventListener('click', () => {
      habit.completed = !habit.completed;
      localStorage.setItem('habits', JSON.stringify(habits));
      renderHabits();
    });

    // Delete button
    li.querySelector('.delete-btn').addEventListener('click', () => {
      habits = habits.filter(h => h.id !== habit.id);
      localStorage.setItem('habits', JSON.stringify(habits));
      renderHabits();
    });

    habitList.appendChild(li);
  });
}

// Initial render
renderHabits();
