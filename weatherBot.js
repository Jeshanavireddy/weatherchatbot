document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const API_KEY = '3b866d944054786850b43f45a2d6e29c';
    
    // Function to add message to chat box
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(`${sender}-message`);
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to display weather card
    function displayWeatherCard(data) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('weather-card');
        
        // Convert temperature from Kelvin to Celsius
        const tempC = (data.main.temp - 273.15).toFixed(1);
        const tempMinC = (data.main.temp_min - 273.15).toFixed(1);
        const tempMaxC = (data.main.temp_max - 273.15).toFixed(1);
        
        cardDiv.innerHTML = `
            <h5>Weather in ${data.name}, ${data.sys.country}</h5>
            <div class="weather-info">
                <span class="label">Description:</span>
                <span class="value">${data.weather[0].description}</span>
            </div>
            <div class="weather-info">
                <span class="label">Temperature:</span>
                <span class="value">${tempC}°C</span>
            </div>
            <div class="weather-info">
                <span class="label">Min/Max Temp:</span>
                <span class="value">${tempMinC}°C / ${tempMaxC}°C</span>
            </div>
            <div class="weather-info">
                <span class="label">Humidity:</span>
                <span class="value">${data.main.humidity}%</span>
            </div>
            <div class="weather-info">
                <span class="label">Wind Speed:</span>
                <span class="value">${data.wind.speed} m/s</span>
            </div>
        `;
        
        chatBox.appendChild(cardDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    // Function to fetch weather data
    async function fetchWeather(cityName) {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('City not found');
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }
    
    // Function to handle user input
    async function handleUserInput() {
        const cityName = userInput.value.trim();
        
        if (!cityName) return;
        
        // Add user message to chat
        addMessage(cityName, 'user');
        userInput.value = '';
        
        // Check if input is a valid city name (simple validation)
        if (!/^[a-zA-Z\s]+$/.test(cityName)) {
            addMessage("Please send correct city name!!!", 'bot');
            return;
        }
        
        // Show loading message
        const loadingMessage = document.createElement('div');
        loadingMessage.classList.add('bot-message');
        loadingMessage.textContent = "Fetching weather data...";
        chatBox.appendChild(loadingMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Fetch weather data
        const weatherData = await fetchWeather(cityName);
        
        // Remove loading message
        chatBox.removeChild(loadingMessage);
        
        if (weatherData) {
            displayWeatherCard(weatherData);
        } else {
            addMessage("Sorry, I couldn't find weather data for that city. Please try another city name.", 'bot');
        }
    }
    
    // Event listeners
    sendBtn.addEventListener('click', handleUserInput);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
});