const API_KEY = '5ST1A63YVLQ2';
const timeDate = document.getElementById("timeDate");
const cidade = document.getElementById("location");

function getCurrentDateTime(lat, lon) {

  const apiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

  fetch(apiUrl)
    .then(response => response.json()) 
    .then(data => {
      const dateTime = data.formatted.split(" ");
      const hora = dateTime[1].substring(0, 5);
      const dataFormatada = dateTime[0];
      console.log(data)
      timeDate.innerHTML = `
        <h1>${hora}</h1>
        <h4>${dataFormatada}</h4>`;
      cidade.innerHTML = `${data.cityName} - ${data.countryCode} <br> ${data.zoneName}`;

      timeDate.style.fontSize = "3rem";
      timeDate.style.textAlign = "center";
      timeDate.style.marginTop = "80px";
    })
    .catch(error => {
      console.error('Houve um problema com a requisição:', error);
    });
}
