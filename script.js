class TheWeatherApp
{
    constructor()
    {
        this.apiKey = "a1364ebf8f2ce633455c3cd33581d44d";
        this.currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconUrl = "https://openweathermap.org/img/wn/{iconName}@2x.png";
        this.currentWeatherUrl = this.currentWeatherUrl.replace("{apiKey}", this.apiKey);
        this.forecastUrl = this.forecastUrl.replace("{apiKey}", this.apiKey);
        this.setupEventListeners();
    }
    setupEventListeners()
    {
        document.getElementById("weatherButton").addEventListener("click", () =>
        {
            this.getWeather();
        });
    }
    getWeather()
    {
        const chosenCity = document.getElementById("cityInput").value.trim();
        
        if (!chosenCity)
        {
            alert("Proszę wprowadzić nazwę miasta");
            return;
        }
        this.getCurrentWeather(chosenCity);
        this.getForecast(chosenCity);
    }
    getCurrentWeather(city)
    {
        const url = this.currentWeatherUrl.replace("{query}", city);
        const request = new XMLHttpRequest();
        
        request.open("GET", url, true);
        request.onload = () =>
        {
            this.currentData = JSON.parse(request.responseText);
			console.log(this.currentData);
            this.displayWeather();
        };
        request.send();
    }
    getForecast(city)
    {
        const url = this.forecastUrl.replace("{query}", city);
        
        fetch(url).then(response => response.json()).then(data =>
        {
            this.forecastData = data.list;
			console.log(data);
            this.displayWeather();
        });
    }
    displayWeather()
    {
        const currentDataElement = document.getElementById("currentData");
        const forecastDataElement = document.getElementById("forecastData");

        currentDataElement.innerHTML = "";
        forecastDataElement.innerHTML = "";

        if (this.currentData)
        {
            this.displayCurrentWeather(this.currentData, currentDataElement);
        }
        if (this.forecastData)
        {
            this.displayForecastWeather(this.forecastData, forecastDataElement);
        }
    }
    displayCurrentWeather(data, container)
    {
        const date = new Date(data.dt * 1000);
        const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const iconName = data.weather[0].icon;
        const description = data.weather[0].description;
        const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLike, iconName, description);
        container.appendChild(weatherBlock);
    }
    displayForecastWeather(data, container)
    {
        for (let i = 0; i < data.length; i++)
        {
            const weather = data[i];
            const date = new Date(weather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`
            const temperature = weather.main.temp;
            const feelsLike = weather.main.feels_like;
            const iconName = weather.weather[0].icon;
            const description = weather.weather[0].description;
            const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLike, iconName, description);
            container.appendChild(weatherBlock);
        }
    }
    createWeatherBlock(dateString, temperature, feelsLike, iconName, description)
    {
        const weatherBlock = document.createElement("div");
        weatherBlock.className = "weather-block";

        const dateBlock = document.createElement("div");
        dateBlock.className = "weather-date";
        dateBlock.textContent = dateString;
        weatherBlock.appendChild(dateBlock);

        const temperatureBlock = document.createElement("div");
        temperatureBlock.className = "weather-temperature";
        temperatureBlock.innerHTML = `${temperature} &deg;C`;
        weatherBlock.appendChild(temperatureBlock);

        const feelsLikeBlock = document.createElement("div");
        feelsLikeBlock.className = "weather-feels-like";
        feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLike} &deg;C`;
        weatherBlock.appendChild(feelsLikeBlock);

        const weatherIcon = document.createElement("img");
        weatherIcon.className = "weather-icon";
        weatherIcon.src = this.iconUrl.replace("{iconName}", iconName);
        weatherBlock.appendChild(weatherIcon);

        const weatherDescription = document.createElement("div");
        weatherDescription.className = "weather-description";
        weatherDescription.textContent = description;
        weatherBlock.appendChild(weatherDescription);
		
        return weatherBlock;
    }
}
const weatherAppInstance = new TheWeatherApp();