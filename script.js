function ClickMe() {
    const location    = document.getElementById("answer").value.trim();
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.style.display = "block";
    forecastDiv.innerHTML = "Loading...";

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;

                return fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
            } else {
                throw new Error("Location not found");
            }
        })
        .then(response => response.json())
        .then(locationData => {
            const forecastUrl = locationData.properties.forecastHourly || locationData.properties.forecast;
            if (!forecastUrl) {
                throw new Error("Hourly forecast not available for this location");
            }
            return fetch(forecastUrl);
        })
        .then(response => response.json())
        .then(forecastData => {
            if (
                forecastData &&
                forecastData.properties &&
                forecastData.properties.periods &&
                forecastData.properties.periods.length > 0
            ) {
                const temp = forecastData.properties.periods[0].temperature;
                forecastDiv.innerHTML = `Current temperature: ${temp}°F`;
            } else {
                throw new Error("Forecast data is unavailable");
            }
        })
        .catch(error => {
            forecastDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        });
}