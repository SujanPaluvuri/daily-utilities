const form = document.getElementById('sleep-form');
const bedtimeInput = document.getElementById('bedtime');
const wakeupInput = document.getElementById('wakeuptime');
const sleepDurationEl = document.getElementById('sleep-duration');
const sleepQualityEl = document.getElementById('sleep-quality');
const sleepHistory = document.getElementById('sleep-history');

let sleepRecords = JSON.parse(localStorage.getItem('sleepRecords')) || [];

// Display saved sleep records
function displayRecords() {
    sleepHistory.innerHTML = '';
    sleepRecords.forEach(record => {
        const li = document.createElement('li');
        li.textContent = `Bedtime: ${record.bedtime}, Wake Up: ${record.wakeup}, Duration: ${record.duration}h, Quality: ${record.quality}`;
        sleepHistory.appendChild(li);
    });
}

// Calculate sleep duration and quality
function calculateSleep(bedtime, wakeup) {
    const start = new Date(`1970-01-01T${bedtime}:00`);
    const end = new Date(`1970-01-01T${wakeup}:00`);
    let diff = (end - start) / (1000 * 60); // difference in minutes
    if(diff < 0) diff += 24*60; // handle overnight sleep

    const hours = Math.floor(diff / 60);
    const minutes = Math.floor(diff % 60);

    // Basic quality evaluation
    let quality;
    if(hours >= 7 && hours <= 9) quality = "Good";
    else if(hours < 7) quality = "Short Sleep";
    else quality = "Long Sleep";

    return { hours, minutes, quality };
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const bedtime = bedtimeInput.value;
    const wakeup = wakeupInput.value;

    const { hours, minutes, quality } = calculateSleep(bedtime, wakeup);

    sleepDurationEl.textContent = `Duration: ${hours} hours ${minutes} minutes`;
    sleepQualityEl.textContent = `Quality: ${quality}`;

    // Save to records
    sleepRecords.push({
        bedtime,
        wakeup,
        duration: `${hours}h ${minutes}m`,
        quality
    });

    localStorage.setItem('sleepRecords', JSON.stringify(sleepRecords));
    displayRecords();
});

// Initial load
displayRecords();
