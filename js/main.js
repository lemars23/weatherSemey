"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".wrapper");
    const currentTemp = document.querySelector(".weather_now_temp_number");
    const currentState = document.querySelector(".weather_now_state");
    const currentStateImage = document.querySelector(".weather_now_image");
    const currentDate = document.querySelector(".weather_now_date");
    const weatherWeek = document.querySelector(".weather_week");
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
        },
        getZeroMonth: function(date) {
            const day = (new Date(date)).getDate();
            const month = ("" + (new Date(date)).getMonth()).length > 1 ? new Date(date).getMonth() : "0" +  new Date(date).getMonth();
            return `${day}.${month}`;
        }
    };

    currentDate.innerHTML = `${todayDate.nowMonth()} ${todayDate.nowDay()}, ${todayDate.nowYear()}`;
    
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=1fa40841f1f04853aa0103738231210&q=Semey&days=7&aqi=no&alerts=no&lang=ru`).then(response => response.json()).then(json => {
        currentTemp.innerHTML = Math.floor(json.current.temp_c);
        currentState.innerHTML = json.current.condition.text;

        if(json.current.condition.text === "Местами дождь") {
            currentStateImage.src = "../images/rain.png";
        } else if(json.current.condition.text === "Ясно") {
            currentStateImage.src = "../images/clear.png";
        } else if(json.current.condition.text === "Солнечно") {
            currentStateImage.src = "../images/clear.png";
        } else if(json.current.condition.text === "Переменная облачность") {
            currentStateImage.src = "../images/cloudy.png";
        } else if(json.current.condition.text === "Пасмурно") {
            currentStateImage.src = "../images/cloudy.png";
        } else if(json.current.condition.text === "Облачно") {
            currentStateImage.src = "../images/cloudy.png";
        }

        for(let i = 0; i < 7; i++) {
            const weatherDay = document.createElement("li");
            weatherDay.classList.add("weather_day", `day-${i}`);
            weatherDay.innerHTML = `
                                        <div class="weather_day_date">
                                            <span>${todayDate.getZeroMonth(json.forecast.forecastday[i].date)}</span>
                                        </div>
                                        <div class="weather_day_name">
                                            <span>${todayDate.getDayOfWeek(new Date(json.forecast.forecastday[i].date).getDay())}</span>
                                        </div>
                                        <div class="weather_day_picture">
                                            <img
                                                src="${setImage(json.forecast.forecastday[i].day.condition.text)}"
                                                alt="weather_day_image"
                                                class="weather_day_image"
                                            />
                                        </div>
                                        <div class="weather_day_noon">
                                            <span>${Math.floor(json.forecast.forecastday[i].day.maxtemp_c)}&deg;C</span>
                                        </div>
                                        <div class="weather_day_night">
                                            <span>${Math.floor(json.forecast.forecastday[i].day.mintemp_c)}&deg;C</span>
                                        </div>
            `;
            weatherWeek.append(weatherDay);
        }

        setBackground(wrapper);

        weatherWeek.addEventListener("touchstart", (event) => {
            if(event.target && event.target.matches("li.weather_day *") || event.target.matches("li.weather_day * span") || event.target.matches("li.weather_day")) {
                let dataDay;
                if(event.target.parentElement.classList.item(1)) {
                    dataDay = json.forecast.forecastday[event.target.parentElement.classList.item(1).split("-")[1]];
                }
                if(event.target.parentElement.parentElement.classList.item(1)){
                    dataDay = json.forecast.forecastday[event.target.parentElement.parentElement.classList.item(1).split("-")[1]];
                }
                if(event.target.classList.item(1)) {
                    dataDay = json.forecast.forecastday[event.target.classList.item(1).split("-")[1]];
                }
                const weatherModal = document.createElement("div");
                const wrapper = document.querySelector(".wrapper > .container");
                weatherModal.classList.add("weather_opened");
                weatherModal.innerHTML = getWeatherModal(dataDay);
                wrapper.append(weatherModal);
                getWeatherOfHours(dataDay.hour);
                document.querySelector(".weather_closed").addEventListener("touchstart", () => {
                    document.querySelector(".weather_opened").remove();
                });
            }
        });
    });

    function getWeatherModal(dataDay) {
        return `
                <div class='weather_closed'>
                    <div class='closed_wrapper'>
                        <div class='closed_one'></div>
                        <div class='closed_two'></div>
                    </div>
                </div>
                <div class='weather_data'>
                    <div class='data_name'>${todayDate.getDayOfWeek(new Date(dataDay.date).getDay())}</div>
                    <table class='data_list'>
                        <thead class='data_head'>
                            <tr class='data_inline'>
                                <th class='data_column'>Время</th>
                                <th class='data_column'>Температура</th>
                                <th class='data_column'>Дождь</th>
                                <th class='data_column'>Состояние</th>
                                <th class='data_column'>Ветер</th>
                            </tr>
                        </thead>
                        <tbody class='data_body'>
                        </tbody>
                    </table>
                </div>
                
        `;
    }

    function getWeatherOfHours(data) {
        const period = document.querySelector(".data_body");
        data.forEach(item => {
            period.innerHTML += `<tr class='data_item'>
                                    <td class=''>${item.time.split(" ")[1]}</td>
                                    <td class=''>${Math.floor(item.temp_c)}&deg;C</td>
                                    <td class=''>${item.chance_of_rain}%</td>
                                    <td class=''>${item.condition.text}</td>
                                    <td class=''>${item.wind_kph}км/ч</td>
                                </tr>`;
        });
    }

    function setImage(text) {
        if(text === "Местами дождь") {
            return "../images/rain.png";
        } else if(text === "Солнечно") {
            return "../images/clear.png";
        } else if(text === "Переменная облачность") {
            return "../images/cloudy.png";
        } else if(text === "Пасмурно") {
            return "../images/cloudy.png";
        } else if(text === "Умеренный дождь") {
            return "../images/rain.png";
        } else if(text === "Облачно") {
            return "../images/cloudy.png";
        } 
    }

    function setBackground(bg,date = new Date()) {
        const hours = "" + (new Date()).getHours();
        if(16 > hours && hours > 5) {
           bg.classList.add("bg_noon");
        }
        if(16 <= hours && hours < 20) {
            bg.classList.add("bg_evening");
        }
        if(20 <= hours || hours <= 5) {
            bg.classList.add("bg_night");
        }
    }
});
