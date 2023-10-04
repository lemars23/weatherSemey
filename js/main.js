"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const currentTemp = document.querySelector(".weather_now_temp_number");
    const currentState = document.querySelector(".weather_now_state");
    const currentStateImage = document.querySelector(".weather_now_image");
    const currentDate = document.querySelector(".weather_now_date");
    const weatherWeek = document.querySelector(".weather_week");
    const todayMaxTemp = document.querySelector(".weather_today_max");
    const todayMinTemp = document.querySelector(".weather_today_min");
    
    const todayDate = {
        date: new Date(),
        week: [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
        ],
        nowYear: function() {
            return this.date.getFullYear();
        },
        nowMonth: function() {
            return this.date.toLocaleString("default", {month: "long"}).charAt(0).toUpperCase() + this.date.toLocaleString("default", {month: "long"}).slice(1);
        },
        nowDay: function() {
            return this.date.getDate();
        },
        getDayOfWeek: function(date) {
            return this.week[date];
        }
    };

    currentDate.innerHTML = `${todayDate.nowMonth()} ${todayDate.nowDay()}, ${todayDate.nowYear()}`;
    
    fetch("http://api.weatherapi.com/v1/forecast.json?key=c0bf2838ecf5423e9be101133232809&q=Semey&days=8&aqi=no&alerts=no&lang=ru").then(response => response.json()).then(json => {
        currentTemp.innerHTML = Math.floor(json.current.temp_c);
        currentState.innerHTML = json.current.condition.text;

        if(json.current.condition.text === "Местами дождь") {
            currentStateImage.src = "../images/rain.png";
        } else if(json.current.condition.text === "Солнечно") {
            currentStateImage.src = "../images/clear.png";
        } else if(json.current.condition.text === "Переменная облачность") {
            currentStateImage.src = "../images/cloudy.png";
        }

        for(let i = 0; i < 7; i++) {
            const weatherDay = document.createElement("li");
            weatherDay.classList.add("weather_day");
            weatherDay.innerHTML = `
                                        <div class="weather_day_name">${todayDate.getDayOfWeek(new Date(json.forecast.forecastday[i].date).getDay())}</div>
                                        <div class="weather_day_picture">
                                            <img
                                                src="${setImage(json.forecast.forecastday[i].day.condition.text)}"
                                                alt="weather_day_image"
                                                class="weather_day_image"
                                            />
                                        </div>
                                        <div class="weather_day_noon">${Math.floor(json.forecast.forecastday[i].day.maxtemp_c)}&deg;C</div>
                                        <div class="weather_day_night">${Math.floor(json.forecast.forecastday[i].day.mintemp_c)}&deg;C</div>
            `;
            weatherWeek.append(weatherDay);
        }
    });

    // console.log((new Date()).getDay());


    function setImage(text) {
        if(text === "Местами дождь") {
            return "../images/rain.png";
        } else if(text === "Солнечно") {
            return "../images/clear.png";
        } else if(text === "Переменная облачность") {
            return "../images/cloudy.png";
        }
    }
});
