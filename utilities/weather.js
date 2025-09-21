const apiKey = "407b64a53b3af245479fc4bd7520d276";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();

        document.querySelector(".city").textContent = data.name;
        document.querySelector(".temp").textContent = `${Math.round(data.main.temp)}°C`;
        document.querySelector(".humidity").textContent = `${data.main.humidity}%`;
        document.querySelector(".wind").textContent = `${data.wind.speed} km/h`;

        const condition = data.weather[0].main.toLowerCase();
        if (condition.includes("cloud")) weatherIcon.className = "fa-solid fa-cloud weather-icon";
        else if (condition.includes("rain")) weatherIcon.className = "fa-solid fa-cloud-showers-heavy weather-icon";
        else if (condition.includes("clear")) weatherIcon.className = "fa-solid fa-sun weather-icon";
        else weatherIcon.className = "fa-solid fa-cloud-sun-rain weather-icon";
    } catch (error) {
        document.querySelector(".city").textContent = "Invalid City";
        document.querySelector(".temp").textContent = "--°C";
        document.querySelector(".humidity").textContent = "--%";
        document.querySelector(".wind").textContent = "-- km/h";
        weatherIcon.className = "fa-solid fa-triangle-exclamation weather-icon";
    }
}

searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") checkWeather(searchBox.value.trim());
});

// Optionally: Enter key support
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && searchBox.value.trim() !== "") {
        checkWeather(searchBox.value.trim());
    }
});
