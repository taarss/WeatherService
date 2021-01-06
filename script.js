let weatherForecast = new Object();
function getLocation(params) {
    fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=6631189809904529adb8519c82233ecd`)
    .then(response => response.json())
    .then(geoData => {
        let city = geoData['city'];
        showData(city, geoData['longitude'], geoData['latitude']);
        document.querySelector(".searchInput").value = city;
    });
}
fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=6631189809904529adb8519c82233ecd`)
.then(response => response.json())
.then(geoData => {
    let city = geoData['city'];
    showData(city, geoData['longitude'], geoData['latitude']);
    document.querySelector(".searchInput").value = city;
});
document.querySelector(".searchBtn").addEventListener("click", function (params) {
    var paras = document.getElementsByClassName('forecastContainerBox');
    while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }
    var paras = document.getElementsByClassName('loadMoreBtn');
    while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }
    var paras = document.getElementsByClassName('loadLessBtn');
    while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
    }
    let city = document.querySelector(".searchInput").value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e9ea7f8ddd5a9cc3c39b25468f232917`)
    .then(response => response.json())
    .then(data => {
       showData(city, data['coord']['lon'], data['coord']['lat']);
    });
})
function formatUnixTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}
function showData(city, long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e9ea7f8ddd5a9cc3c39b25468f232917`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    document.querySelector(".currentWeatherCityName").innerHTML = "Weather in "+city;
                    let currentDate = new Date().toLocaleTimeString();;
                    var split = currentDate.split(".");
                    var x = split.slice(0, split.length - 1).join(".");
                    document.querySelector(".currentWeatherTime").innerHTML = "as of "+x.replace(".", ":");
                    document.querySelector(".currentWeatherTemp").innerHTML = data['main']['temp']+"°";
                    document.querySelector(".currentWeatherDes").innerHTML = data['weather'][0]['description'];
                    document.querySelector(".currentWeatherFeelsLike").innerHTML = "Feels like: "+data['main']['feels_like']+"°";
                    document.querySelector(".weatherIcon").src="http://openweathermap.org/img/wn/"+data['weather'][0]['icon']+"@4x.png";
                    document.querySelector(".weatherForecastTitle").innerHTML = "Weather Forecast for "+city;
                    document.querySelector(".humidity").innerHTML = "Humidity: "+data['main']['humidity']+"%";
                    document.querySelector(".pressure").innerHTML = "Pressure: "+data['main']['pressure']+" hPa";
                    document.querySelector(".wind").innerHTML = "Wind speed: "+data['wind']['speed']+" meter/sec";

                });
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=&appid=e9ea7f8ddd5a9cc3c39b25468f232917`, {    
        })
        .then(response => response.json())
        .then(data2 => {
            let timeStamps = new Array();
            let degreeStamps = new Array(); 
                weatherForecast = data2['list'];
                for (let index = 0; index < 10; index++) {
                    let parrent = document.querySelector(".forecastBox");
                    let container = document.createElement("div");
                    let time = document.createElement("p");
                    let degrees = document.createElement("p");
                    let weatherDescription = document.createElement("p");
                    let weatherIcon = document.createElement("img");
                    weatherDescription.innerHTML = data2['hourly'][index]['weather'][0]['description'];
                    time.innerHTML = formatUnixTime(data2['hourly'][index]['dt']);
                    timeStamps.push(formatUnixTime(data2['hourly'][index]['dt']));
                    degrees.innerHTML = data2['hourly'][index]['temp']+"°";
                    degreeStamps.push(data2['hourly'][index]['temp']);
                    weatherIcon.src = "http://openweathermap.org/img/wn/"+data2['hourly'][index]['weather'][0]['icon']+".png";
                    container.appendChild(time);
                    container.appendChild(degrees);
                    container.appendChild(weatherDescription);
                    container.appendChild(weatherIcon);
                    container.classList.add("forecastContainerBox");
                    parrent.appendChild(container);
                }             
            let loadMoreBtn = document.createElement("button");
            loadMoreBtn.innerHTML = "+";
            loadMoreBtn.classList.add("loadMoreBtn");
            loadMoreBtn.addEventListener("click", function (params) {
                generateForecast(data2);
                this.parentNode.removeChild(this);
            })
            document.querySelector(".forecastBox").appendChild(loadMoreBtn);
            createGraph(degreeStamps, timeStamps)  

        });
}
function generateForecast(data) {
    let timeStamps = new Array();
    let degreeStamps = new Array(); 
    for (let index = 0; index < data['hourly'].length; index++) {
        if (index < 10) {
            timeStamps.push(formatUnixTime(data['hourly'][index]['dt']));
            degreeStamps.push(data['hourly'][index]['temp']);
        }
        else{
            let parrent = document.querySelector(".forecastBox");
            let container = document.createElement("div");
            let time = document.createElement("p");
            let degrees = document.createElement("p");
            let weatherDescription = document.createElement("p");
            let weatherIcon = document.createElement("img");
            weatherDescription.innerHTML = data['hourly'][index]['weather'][0]['description'];
            time.innerHTML = formatUnixTime(data['hourly'][index]['dt']);
            timeStamps.push(formatUnixTime(data['hourly'][index]['dt']));
            degrees.innerHTML = data['hourly'][index]['temp']+"°";
            degreeStamps.push(data['hourly'][index]['temp']);
            weatherIcon.src = "http://openweathermap.org/img/wn/"+data['hourly'][index]['weather'][0]['icon']+".png";
            container.appendChild(time);
            container.appendChild(degrees);
            container.appendChild(weatherDescription);
            container.appendChild(weatherIcon);
            container.classList.add("forecastContainerBox");
            parrent.appendChild(container);
        }   
    }
    let loadLessBtn = document.createElement("button");
    loadLessBtn.innerHTML = "-";
    loadLessBtn.classList.add("loadLessBtn");
    loadLessBtn.addEventListener("click", function (params) {
        removeForecasts(data);
        this.parentNode.removeChild(this);
    });
    document.querySelector(".forecastBox").appendChild(loadLessBtn);
    createGraph(degreeStamps, timeStamps);
}
function removeForecasts(data2) {
    let parrent = document.querySelector(".forecastBox");
    for (let index = 0; index < 39; index++) {
        parrent.removeChild(parrent.lastChild);
    }
    let loadMoreBtn = document.createElement("button");
    loadMoreBtn.innerHTML = "+";
    loadMoreBtn.classList.add("loadMoreBtn");
    loadMoreBtn.addEventListener("click", function (params) {
        generateForecast(data2);
        this.parentNode.removeChild(this);
    })
    document.querySelector(".forecastBox").appendChild(loadMoreBtn);
}
function createGraph(degreeStamps, timeStamps) {
    var options = {
        chart: {
          type: 'line'
        },
        series: [{
          name: 'Degrees',
          data: degreeStamps
        }],
        xaxis: {
          categories: timeStamps
        }  
      }
      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
}