"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const lastUpdate = document.querySelector(".weather_update_time");
    const currentTemp = document.querySelector(".current_temp");
    const currentTempFeelsLike = document.querySelector(".current_temp_feelslike");
    const currentCondition = document.querySelector(".current_condition");
    const todayTempMin = document.querySelector(".today_temp_min");
    const todayTempMax = document.querySelector(".today_temp_max");
    fetch("http://api.weatherapi.com/v1/forecast.json?key=c0bf2838ecf5423e9be101133232809&q=Semey&days=7&aqi=no&alerts=no&lang=ru").then(response => response.json()).then(json => {
        const apiLastUpdate = json["current"]["last_updated"];
        const apiCurrentTemp = json["current"]["temp_c"];
        const apiCurrentTempFeelsLike = json["current"]["feelslike_c"];
        const apiCurrentCondition = json["current"]["condition"]["text"];
        const apiTodayMinTemp = json["forecast"]["forecastday"][0]["day"]["mintemp_c"];
        const apiTodayMaxTemp = json["forecast"]["forecastday"][0]["day"]["maxtemp_c"];
        lastUpdate.innerHTML = apiLastUpdate;
        currentTemp.innerHTML = apiCurrentTemp;
        currentTempFeelsLike.innerHTML = apiCurrentTempFeelsLike;
        currentCondition.innerHTML = apiCurrentCondition;
        todayTempMin.innerHTML = apiTodayMinTemp;
        todayTempMax.innerHTML = apiTodayMaxTemp;
        console.log(apiCurrentTempFeelsLike);
    });
});
