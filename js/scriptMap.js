const map = L.map("map").setView([-21.7811, -50.8797], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let marker;

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const provider = new GeoSearch.OpenStreetMapProvider();

async function performSearch() {
  const query = searchInput.value;
  if (!query) {
    alert("Por favor, digite um local para buscar.");
    return;
  }
  try {
    const results = await provider.search({ query: query });
    if (results && results.length > 0) {
      const firstResult = results[0];
      const latlng = { lat: firstResult.y, lng: firstResult.x };
      updateMarker(latlng);
      gravarLocalSototorage(latlng.lat.toFixed(6), latlng.lng.toFixed(6));
      console.log(`Local encontrado: `, latlng);
    } else {
      alert("Nenhum resultado encontrado para a sua busca.");
    }
  } catch (error) {
    console.error("Erro na busca:", error);
    alert("Ocorreu um erro ao buscar o local.");
  }
}

searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    performSearch();
  }
});

map.on('click', function(e) {
    const latlng = e.latlng;
    updateMarker(latlng);
    gravarLocalSototorage(latlng.lat.toFixed(6), latlng.lng.toFixed(6));
    console.log(`Clique no mapa:`, latlng);
});

function updateMarker(latlng) {
  if (marker) {
    marker.setLatLng(latlng);
  } else {
    marker = L.marker(latlng).addTo(map);
  }
  map.setView(latlng, 15);
}
function gravarLocalSototorage(latituide, longitude){
 
    sessionStorage.setItem("latituide", latituide)
    sessionStorage.setItem("longitude", longitude)
    console.log("Dados gravados na sessão atual")
}