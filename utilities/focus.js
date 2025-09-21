let focusTimeInput = document.getElementById('focusTime');
let breakTimeInput = document.getElementById('breakTime');

let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');
let resetBtn = document.getElementById('resetBtn');
let timeDisplay = document.getElementById('time');
let statusDisplay = document.getElementById('status');

let timer;
let totalSeconds = 25 * 60;
let isRunning = false;
let onBreak = false;

// Convert seconds to MM:SS
function formatTime(sec){
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// Update display
function updateDisplay(){
    timeDisplay.textContent = formatTime(totalSeconds);
    statusDisplay.textContent = onBreak ? "Break Time" : "Focus Time";
}

// Timer tick
function tick(){
    if(totalSeconds > 0){
        totalSeconds--;
        updateDisplay();
    } else {
        clearInterval(timer);
        isRunning = false;
        onBreak = !onBreak;
        totalSeconds = (onBreak ? parseInt(breakTimeInput.value) : parseInt(focusTimeInput.value)) * 60;
        alert(onBreak ? "Time for a Break!" : "Time to Focus!");
        updateDisplay();
        startTimer();
    }
}

// Start Timer
function startTimer(){
    if(!isRunning){
        timer = setInterval(tick, 1000);
        isRunning = true;
    }
}

// Pause Timer
function pauseTimer(){
    clearInterval(timer);
    isRunning = false;
}

// Reset Timer
function resetTimer(){
    clearInterval(timer);
    isRunning = false;
    onBreak = false;
    totalSeconds = parseInt(focusTimeInput.value) * 60;
    updateDisplay();
}

// Button Events
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize display
updateDisplay();
