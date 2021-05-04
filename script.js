// Function to display date
window.onload = pageReady;
function pageReady() {
    function showDate(dateToDisplay) {
        if (dateToDisplay) {
            var now = new Date(dateToDisplay);
            monthName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dates = [' ', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st', '32nd'];
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            month = now.getMonth();
            day = now.getDate();
            week = now.getDay();
            year = now.getFullYear();
            document.getElementById('days').innerHTML = weekDays[week] + ', ' + monthName[month] + ' ' + dates[day] + '' + ', ' + year;
        } else {
            var now = new Date();
            monthName = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dates = [' ', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st', '32nd'];
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            month = now.getMonth();
            day = now.getDate();
            week = now.getDay();
            year = now.getFullYear();
            document.getElementById('days').innerHTML = weekDays[week] + ', ' + monthName[month] + ' ' + dates[day] + '' + ', ' + year;
        }
    }

    showDate();//call function


    //Getting elements from HTML form
    var temparatureDescription = document.getElementById('temperature');
    var tempIcon = document.getElementById('icons');
    var tempDescription = document.getElementById('desc');
    var btnCity = document.getElementById('addcity');
    var cityTyped = document.getElementById('typedCity');
    var cityWeather = document.getElementById('cityname');
    var displayweather = document.getElementById('weather-display');
    let sunSet = document.getElementById('sunset');
    let sunRise = document.getElementById('sunrise');


    btnCity.addEventListener('click', addCity);//listener

    //function to add city on clicking
    function addCity() {
        displayWeather();
    }

    //function to display weather
    function displayWeather() {
        if (cityTyped.value != "") {
            let city = cityTyped.value;

            const API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=761183b6dff3a93d3629e93c24550e5b`;

            fetch(API)
                .then(result => result.json())
                .then(data => {

                    var temperature = ((data.main.temp) - 273.15).toFixed(1);
                    var {description, icon} = data.weather[0];

                    temparatureDescription.innerText = `${temperature} ºC`;
                    tempDescription.innerText = description;
                    tempIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;
                })


            const api = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=761183b6dff3a93d3629e93c24550e5b`;
            fetch(api)
                .then(result => result.json())
                .then(data => {
                    var string = "";
                    var i;
                    for (i = 0; i < data.list.length; i = i + 2) {
                        var temperature = ((data.list[i].main.temp) - 273.15).toFixed(1);
                        var {description, icon} = data.list[i].weather[0];
                        var date = data.list[i].dt_txt;

                        //Weather string to display
                        string += "<div class='weather image'><p class=\"descDay\" id=\"desc\">" + description + "</p>" +
                            "<div class=\"icon-div\" id=\"icons\">" + `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">` + "</div>" +
                            "<p class=\"temperatureDay\" id=\"temperature\">" + temperature + "ºC" + "</p>" +
                            "<p class=\"descDay\">" + date + "</p></div>";
                    }
                    displayweather.innerHTML = string;
                    cityWeather.innerHTML = data.city.name + "," + data.city.country;
                    var latitude = data.city.coord.lat;
                    var longitude = data.city.coord.lon;
                    console.log(latitude, longitude);
                    var sunrise = data.city.sunrise;
                    var sunset = data.city.sunset;

                    let hourSunset = new Date(sunset * 1000).toLocaleTimeString();
                    let hourSunrise = new Date(sunrise * 1000).toLocaleTimeString();
                    sunRise.innerText = `Sunrise: ${hourSunrise}`;
                    ;
                    sunSet.innerText = `Sunset: ${hourSunset}`;

                    //Api to display date of cities
                    const settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://geo-services-by-mvpc-com.p.rapidapi.com/timezone?location=" + latitude + "%2C" + longitude,
                        "method": "GET",
                        "headers": {
                            "x-rapidapi-key": "14f2e198bcmshb832de74ee0588bp1cd853jsn96b36343467a",
                            "x-rapidapi-host": "geo-services-by-mvpc-com.p.rapidapi.com"
                        }
                    };

                    $.ajax(settings).done(function (response) {
                        console.log(response.data.time_now);

                        showDate(response.data.time_now);

                        clockHour(response.data.time_now);
                    });
                })
        }
    }

    //Draw and display analog clock
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    setInterval(drawClock, 1000);

    function drawClock() {
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        drawTime(ctx, radius);
    }

    function drawFace(ctx, radius) {
        var grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = radius * 0.1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#333';
        ctx.fill();
    }

    function drawNumbers(ctx, radius) {
        var ang;
        var num;
        ctx.font = radius * 0.15 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.85);
            ctx.rotate(-ang);
            ctx.fillText(num.toString(), 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.85);
            ctx.rotate(-ang);
        }
    }

    function drawTime(ctx, radius) {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        //hour
        hour = hour % 12;
        hour = (hour * Math.PI / 6) +
            (minute * Math.PI / (6 * 60)) +
            (second * Math.PI / (360 * 60));
        drawHand(ctx, hour, radius * 0.5, radius * 0.07);
        //minute
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        drawHand(ctx, minute, radius * 0.8, radius * 0.07);
        // second
        second = (second * Math.PI / 30);
        drawHand(ctx, second, radius * 0.9, radius * 0.02);
    }

    function drawHand(ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }


//Digital clock
    const clock = document.getElementById('watch');

    function clockHour(timeToDisplay) {
        if (timeToDisplay) {

            var today = new Date(timeToDisplay);
            console.log(today);
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);

            var clockHourStr = h + ":" + m + ":" + s;
            clock.innerHTML = clockHourStr;
        } else {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            h = checkTime(h);
            m = checkTime(m);
            s = checkTime(s);

            var clockHourStr = h + ":" + m + ":" + s;
            clock.innerHTML = clockHourStr;
        }
    }

    setInterval(clockHour, 1000);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

