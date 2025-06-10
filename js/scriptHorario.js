const lat = sessionStorage.getItem("latitude")
const lon = sessionStorage.getItem("logitude")
const API_KEY = '5ST1A63YVLQ2'
const apiUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;
console.log(lon)

fetch(apiUrl)
  .then(response => response.json()) 
  .then(data => {

    console.log('Dados recebidos com sucesso:');
    console.log(data);

    console.log('A data e hora atual em São Paulo é:', data);
  })
  .catch(error => {
    console.error('Houve um problema com a requisição:', error);
  });