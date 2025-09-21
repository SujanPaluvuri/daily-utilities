document.addEventListener("DOMContentLoaded", () => {
  console.log("Event Calendar Loaded ✅");

  const monthYear = document.getElementById("month-year");
  const dates = document.getElementById("dates");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const selectedDateText = document.getElementById("selected-date");
  const eventForm = document.getElementById("event-form");
  const eventInput = document.getElementById("event-input");
  const eventList = document.getElementById("event-list");

  let currentDate = new Date();
  let selectedDate = new Date();

  let events = JSON.parse(localStorage.getItem("events")) || {};

  // Format date key -> yyyy-mm-dd
  function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Save events
  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
  }

  // Render Calendar
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    dates.innerHTML = "";

    // Empty slots before month start
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      empty.classList.add("date");
      dates.appendChild(empty);
    }

    // Dates
    for (let date = 1; date <= lastDate; date++) {
      const dateEl = document.createElement("div");
      dateEl.classList.add("date");

      const dateKey = formatDateKey(year, month, date);

      // Today
      if (
        date === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
      ) {
        dateEl.classList.add("today");
      }

      // Selected date
      if (
        date === selectedDate.getDate() &&
        year === selectedDate.getFullYear() &&
        month === selectedDate.getMonth()
      ) {
        dateEl.classList.add("selected");
      }

      // Events marked
      if (events[dateKey]) {
        dateEl.classList.add("event-day");
      }

      dateEl.textContent = date;

      dateEl.addEventListener("click", () => {
        selectedDate = new Date(year, month, date);
        selectedDateText.textContent = selectedDate.toDateString();

        // Highlight selected date
        document.querySelectorAll(".date").forEach((d) =>
          d.classList.remove("selected")
        );
        dateEl.classList.add("selected");

        renderEvents();
      });

      dates.appendChild(dateEl);
    }
  }

  // Render Events
  function renderEvents() {
    const dateKey = formatDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    eventList.innerHTML = "";

    if (events[dateKey]) {
      events[dateKey].forEach((event, index) => {
        const li = document.createElement("li");
        li.textContent = event;

        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.addEventListener("click", () => {
          events[dateKey].splice(index, 1);
          if (events[dateKey].length === 0) delete events[dateKey];
          saveEvents();
          renderEvents();
          renderCalendar();
        });

        li.appendChild(delBtn);
        eventList.appendChild(li);
      });
    }

    // If no events → show message
    if (!events[dateKey] || events[dateKey].length === 0) {
      eventList.innerHTML = "<li>No events for this day</li>";
    }
  }

  // Add event
  eventForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventText = eventInput.value.trim();
    if (!eventText) return;

    const dateKey = formatDateKey(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );

    if (!events[dateKey]) {
      events[dateKey] = [];
    }

    events[dateKey].push(eventText);
    saveEvents();
    renderEvents();
    renderCalendar();
    eventForm.reset();
  });

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Initial Render
  selectedDateText.textContent = selectedDate.toDateString();
  renderCalendar();
  renderEvents();
});
