// forecast.js
document.getElementById('zipForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const zip = document.getElementById('zipCode').value;

    try {
        const response = await fetch(`/temperature?zip=${zip}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        displayForecast(data.daily);
    } catch (error) {
        document.getElementById('forecast-results').innerHTML = `<p class="error">${error.message}</p>`;
    }
});

function displayForecast(dailyForecast) {
    const forecastContainer = document.getElementById('forecast-results');
    forecastContainer.innerHTML = ''; // Clear previous results

    dailyForecast.slice(0, 7).forEach((day) => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        const tempDay = day.temp.day.toFixed(1);
        const tempNight = day.temp.night.toFixed(1);
        const weatherDescription = day.weather[0].description;
        const icon = day.weather[0].icon;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${weatherDescription}">
            <p>${weatherDescription}</p>
            <p>Day: ${tempDay}°F / Night: ${tempNight}°F</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}
