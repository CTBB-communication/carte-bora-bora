// Initialisation de la carte
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1
});

// Taille de l'image (par exemple 1500 x 2000 — à adapter selon ton image)
const imageWidth = 1500, imageHeight = 2000;
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Ajout de l'image comme fond de carte
L.imageOverlay('img/bora_map.png', bounds).addTo(map);
map.fitBounds(bounds);

// Gestion du menu latéral
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});

// Déclaration des groupes de catégories
const categories = {
  restaurant: [],
  snack: [],
  hotels: [],
  hebergement: [],
  rando: [],
  market: [],
  pharmacy: [],
  medical: [],
  rentcar: [],
  essence: [],
  church: [],
  sites: [],
  administrations: [],
};

// Fonction pour créer un marqueur et l'ajouter dans la catégorie
function addSpot(lat, lng, popupText, category, spotId, icon = null) {
  const options = icon ? { icon: icon } : {};
  const marker = L.marker([lat, lng], options).addTo(map)
    .bindPopup(popupText);
  marker.spotId = spotId;

  // Initialise la catégorie si elle n'existe pas encore
  if (!categories[category]) {
    categories[category] = [];
  }

  categories[category].push(marker);
}
const iconRestaurant = L.icon({
  iconUrl: 'img/marker-rouge-restaurants.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconSnack = L.icon({
  iconUrl: 'img/marker-orange-snacks.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconHotel = L.icon({
  iconUrl: 'img/markers-rouge-hotels.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconHebergement = L.icon({
  iconUrl: 'img/markers-rose-hébergements.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconMarket = L.icon({
  iconUrl: 'img/markers-rose-market.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPharmacie = L.icon({
  iconUrl: 'img/markers-vert-pharmacie.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconMedical = L.icon({
  iconUrl: 'img/markers-rouge-dispensaire.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconRentcar = L.icon({
  iconUrl: 'img/markers-violet-location-voiture.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPatisserie = L.icon({
  iconUrl: 'img/markers-orange-patisserie.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconGlacier = L.icon({
  iconUrl: 'img/markers-orange-glacier.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconEssence = L.icon({
  iconUrl: 'img/markers-bleue-station-essence-marine.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconChurch = L.icon({
  iconUrl: 'img/markers-bleue-église.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconSites = L.icon({
  iconUrl: 'img/markers-bleu-site historiques.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconCanon = L.icon({
  iconUrl: 'img/markers-bleue-canons.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconMairie = L.icon({
  iconUrl: 'img/marker-mairie.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPoste = L.icon({
  iconUrl: 'img/marker-jaune-poste.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPolice = L.icon({
  iconUrl: 'img/marker-police.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconPompier = L.icon({
  iconUrl: 'img/marker-rouge-pompier.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconCTBB = L.icon({
  iconUrl: 'img/marker-tourism-office.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconRando = L.icon({
  iconUrl: 'img/marker-rando.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

// Fonction focus sur un spot par ID
function focusOnSpot(spotId) {
  for (let cat in categories) {
    for (let marker of categories[cat]) {
      if (marker.spotId === spotId) {
        map.setView(marker.getLatLng(), 1);
        marker.openPopup();
        return;
      }
    }
  }
}

// Fonction pour afficher une seule catégorie
  function showCategory(category) {
  // Cacher tous les marqueurs
  for (let cat in categories) {
    for (let marker of categories[cat]) {
      map.removeLayer(marker);
    }
  }
  // Afficher uniquement les marqueurs de la catégorie sélectionnée
  for (let marker of categories[category]) {
    map.addLayer(marker);
  }

  // Cacher toutes les catégories du menu latéral
  const categoryDivs = document.querySelectorAll('#sidebar .category');
  categoryDivs.forEach(div => div.style.display = 'none');

  // Afficher uniquement la catégorie sélectionnée dans le menu
  const selectedCategoryDiv = document.querySelector(`#sidebar .category[data-cat="${category}"]`)
  if (selectedCategoryDiv) {
    selectedCategoryDiv.style.display = 'block';
  }
}

// Fonction pour afficher tous les spots
function showAllSpots() {
  // Afficher tous les marqueurs
  for (let cat in categories) {
    for (let marker of categories[cat]) {
      map.addLayer(marker);
    }
  }

  // Afficher toutes les catégories dans le menu latéral
  const categoryDivs = document.querySelectorAll('#sidebar .category');
  categoryDivs.forEach(div => div.style.display = 'block');
}

// Ajout des spots par catégorie

// Restaurants
addSpot(1025, 620, "<b>Restaurant St James</b><br>Restaurant-bar offrant une cuisine française moderne avec des saveurs polynésiennes. Téléphone: +689 40 67 64 62", 'restaurant', 'restaurant1', iconRestaurant);
addSpot(640, 725, "<b>Restaurant Bloody Mary's</b><br>Actuellement FERMÉ. Restaurant emblématique de Bora Bora, connu pour sa cuisine de fruits de mer et son ambiance décontractée", 'restaurant', 'restaurant2', iconRestaurant);
addSpot(1040, 625, "<b>Le Panda D'Or</b><br>Restaurant chinois proposant une fusion de spécialités polynésiennes et chinoises. Téléphone: +689 40 67 62 81", 'restaurant', 'restaurant3', iconRestaurant);
addSpot(1040, 574, "<b>Le Gecko</b><br>Restaurant offrant une cuisine locale avec une touche moderne. Téléphone: +689 87 32 08 60", 'restaurant', 'restaurant4', iconRestaurant);
addSpot(670, 830, "<b>Villa Mahana</b><br>Restaurant gastronomique intime avec seulement huit tables, offrant une cuisine française raffinée. Téléphone: +689 40 67 50 63", 'restaurant', 'restaurant5', iconRestaurant);
addSpot(500, 805, "<b>Bora Bora Beach Club</b><br>Restaurant décontracté en bord de mer, servant une cuisine française-polynésienne. Téléphone: +689 40 67 52 50", 'restaurant', 'restaurant6', iconRestaurant);
addSpot(500, 847, "<b>The Lucky House - Fare Manuia</b><br>IRestaurant et bar avec piscine, proposant des pizzas, des hamburgers et des plats locaux. Téléphone: +689 40 67 68 08", 'restaurant', 'restaurant7', iconRestaurant);
addSpot(1160, 532, "<b>Bora Bora Yacht Club</b><br>Club nautique avec restaurant, offrant une cuisine française et des vues sur le lagon. Téléphone: +689 40 67 60 47", 'restaurant', 'restaurant8', iconRestaurant);
addSpot(545, 850, "<b>Restaurant Tama'a Maitai</b><br>Infos Ici…", 'restaurant', 'restaurant9', iconRestaurant);

// Snacks
addSpot(974, 624, "<b>Aloe Café</b><br>ITéléphone: +689 40 67 78 88", 'snack', 'Snack1', iconSnack);
addSpot(990, 645, "<b>Pizzeria Paradisio</b><br>Téléphone: +689 40 67 59 83", 'snack', 'Snack2', iconSnack);
addSpot(986, 645, "<b>Snack Lolo</b><br>Téléphone: +689 87 25 25 89", 'snack', 'Snack3', iconSnack);
addSpot(550, 780, "<b>Snack Matira</b><br>Téléphone: +689 40 67 77 32", 'snack', 'Snack4', iconSnack);
addSpot(480, 825, "<b>Snack Monoihere</b><br>Téléphone: +689 87 74 03 02", 'snack', 'Snack5', iconSnack);
addSpot(480, 830, "<b>Snack Otoamana</b><br>Infos ici...", 'snack', 'Snack6', iconSnack);
addSpot(865, 694, "<b>Snack Irène</b><br>Téléphone: +689 87 79 26 35", 'snack', 'Snack7', iconSnack);
addSpot(1010, 630, "<b>Chez Nico</b><br>Infos Ici…", 'snack', 'Snack8', iconSnack);
addSpot(860, 870, "<b>Boulangerie Matira</b><br>Téléphone: +689 40 67 67 06", 'snack', 'Snack9', iconPatisserie);
addSpot(1025, 620, "<b>Pâtisserie St James</b><br>Téléphone: +689 40 67 64 62", 'snack', 'Snack10', iconPatisserie);
addSpot(900, 660, "<b>Iaorana Gelato</b><br>Téléphone: +689 89 50 42 52", 'snack', 'Snack11', iconGlacier);
addSpot(1015, 630, "<b>Bora Healthy</b><br>Téléphone: +689 87 27 73 41", 'snack', 'Snack12', iconSnack);
addSpot(950, 645, "<b>BobCat Wine & Cofee</b><br>Téléphone: +689 87 01 87 01", 'snack', 'Snack13', iconSnack);
addSpot(825, 825, "<b>Kai Kai Bora</b><br>Téléphone: +689 87 26 92 81", 'snack', 'Snack14', iconSnack);
addSpot(780, 890, "<b>Hello Shunshine</b><br>Overt tous les jours de 11h30 à 18h00", 'snack', 'Snack15', iconSnack);
addSpot(840, 840, "<b>Tchoutchou Churros</b><br>Info ici…", 'snack', 'Snack16', iconSnack);
addSpot(995, 625, "<b>Chez Penu</b><br>Info ici…", 'snack', 'Snack17', iconSnack);

// Hôtels
addSpot(650, 400, "<b>Conrad Bora Bora Nui</b><br>Infos ici...", 'hotels', 'hotel1',iconHotel);
addSpot(1375, 1250, "<b>Four Seasons</b><br>Infos ici...", 'hotels', 'hotel2', iconHotel);
addSpot(480, 830, "<b>Hotel Matira</b><br>Infos ici...", 'hotels', 'hotel3', iconHotel);
addSpot(470, 848, "<b>Intercontinental Le Moana</b><br>Infos ici...", 'hotels', 'hotel4', iconHotel);
addSpot(1075, 1290, "<b>The Westin Bora Bora Resort & Spa</b><br>Infos ici...", 'hotels', 'hotel5', iconHotel);
addSpot(1330, 340, "<b>Le Bora Bora by Pearl</b><br>Infos ici...", 'hotels', 'hotel6', iconHotel);
addSpot(995, 1305, "<b>Intercontinental Thalasso Spa</b><br>Infos ici...", 'hotels', 'hotel7', iconHotel);
addSpot(550, 850, "<b>Maitai Polynesia</b><br>Infos ici...", 'hotels', 'hotel8', iconHotel);
addSpot(600, 900, "<b>Royal Bora Bora</b><br>Infos ici...", 'hotels', 'hotel9', iconHotel);
addSpot(1189, 1360, "<b>Saint Regis</b><br>Infos ici...", 'hotels', 'hotel10', iconHotel);

// Hébergements
addSpot(440, 845, "<b>Pension Chez Nono</b><br>Infos ici...", 'hebergement', 'fare1', iconHebergement);
addSpot(1150, 550, "<b>Bora Bora Holiday's Lodge</b><br>Infos ici...", 'hebergement', 'fare2', iconHebergement);
addSpot(1220, 736, "<b>Bora Bungalove</b><br>Infos ici...", 'hebergement', 'fare3', iconHebergement);
addSpot(1370, 785, "<b>Bora Vaite Lodge</b><br>Infos ici...", 'hebergement', 'fare4', iconHebergement);
addSpot(1686, 830, "<b>Chez Alice et Raphael</b><br>Infos ici...", 'hebergement', 'fare5', iconHebergement);
addSpot(430, 870, "<b>Chez Robert et Tina - Fare Rohivai</b><br>Infos ici...", 'hebergement', 'fare6', iconHebergement);
addSpot(660, 820, "<b>Chez Rosina</b><br>Infos ici...", 'hebergement', 'fare7', iconHebergement);
addSpot(730, 1260, "<b>Eden Beach Hotel Bora Bora</b><br>Infos ici...", 'hebergement', 'fare8', iconHebergement);
addSpot(1040, 574, "<b>Oa Oa Lodge</b><br>Infos ici...", 'hebergement', 'fare9', iconHebergement);
addSpot(740, 900, "<b>Rohotu Fare Lodge</b><br>Infos ici...", 'hebergement', 'fare10', iconHebergement);
addSpot(1055, 585, "<b>Sunset Hill Lodge</b><br>Infos ici...", 'hebergement', 'fare11', iconHebergement);
addSpot(500, 847, "<b>Village Temanuata</b><br>Infos ici...", 'hebergement', 'fare12', iconHebergement);
addSpot(1130, 1350, "<b>Camping Motu Ecologique</b><br>Infos ici...", 'hebergement', 'fare13', iconHebergement);
addSpot(600, 920, "<b>Fare Rohivai</b><br>Infos ici...", 'hebergement', 'fare14', iconHebergement);
addSpot(1180, 745, "<b>Oa Oa Village</b><br>Infos ici...", 'hebergement', 'fare15', iconHebergement);

// Supérettes
addSpot(976, 645, "<b>Chin Lee Market</b><br>Supermarché local", 'market', 'market1', iconMarket);
addSpot(1030, 635, "<b>Super U Toa Amok</b><br>Supermarché local", 'market', 'market2', iconMarket);
addSpot(990, 1040, "<b>U Express Toa Areni</b><br>Supermarché local", 'market', 'market3', iconMarket);
addSpot(1140, 690, "<b>Hitiata</b><br>Supermarché local", 'market', 'market4', iconMarket);
addSpot(520, 835, "<b>Magasin Matira</b><br>Supermarché local", 'market', 'market5', iconMarket);
addSpot(590, 850, "<b>Tiare Market</b><br>Supermarché local", 'market', 'market6', iconMarket);
addSpot(920, 645, "<b>Bora Traiding</b><br>Supermarché local", 'market', 'market7', iconMarket);
addSpot(860, 710, "<b>Magasin Antoine</b><br>Supermarché local", 'market', 'market8', iconMarket);
addSpot(1230, 725, "<b>Magasin A'a</b><br>Supermarché local", 'market', 'market9', iconMarket);

// Pharmacy
addSpot(986, 645, "<b>Pharmacie Lafayette Bora Bora</b><br>Info ici…", 'pharmacy', 'pharmacy1', iconPharmacie);
addSpot(650, 800, "<b>Pharmacie Te Ora Bora Bora</b><br>Info ici…", 'pharmacy', 'pharmacy2', iconPharmacie);

// Medecins
addSpot(870, 705, "<b>Dispensaire</b><br>Info ici…", 'medical', 'medical1', iconMedical);
addSpot(1000, 620, "<b>Dr Duval</b><br>Info ici…", 'medical', 'medical2', iconMedical);
addSpot(1000, 620, "<b>Dr Kelly</b><br>Info ici…", 'medical', 'medical3', iconMedical);
addSpot(900, 665, "<b>Dr Justine</b><br>Info ici…", 'medical', 'medical4', iconMedical);
addSpot(890, 670, "<b>Dr Azad</b><br>Info ici…", 'medical', 'medical5', iconMedical);
addSpot(865, 690, "<b>Dr Maria</b><br>Info ici…", 'medical', 'medical6', iconMedical);

// Location de Voiture
addSpot(945, 624, "<b>Avis Bora Bora Agence Vaitape</b><br>Téléphone: +689 40 67 70 15", 'rentcar', 'rentcar1', iconRentcar);
addSpot(875, 745, "<b>Happy Rent</b><br>Téléphone: +689 89 33 65 07", 'rentcar', 'rentcar2', iconRentcar);
addSpot(940, 650, "<b>Albert Store</b><br>Téléphone: +689 40 67 5 55", 'rentcar', 'rentcar3', iconRentcar);
addSpot(840, 810, "<b>Heitaki Bora Rental Cars</b><br>Téléphone: +689 87 05 46 12", 'rentcar', 'rentcar4', iconRentcar);
addSpot(567, 770, "<b>Matira Location</b><br>Téléphone: +689 89 28 31 07", 'rentcar', 'rentcar5', iconRentcar);
addSpot(530, 850, "<b>Avis Matira</b><br>Téléphone: +689 40 67 70 15", 'rentcar', 'rentcar6', iconRentcar);
addSpot(436, 860, "<b>MRC Rent Bora Bora</b><br>Téléphone: +689 87 73 95 71", 'rentcar', 'rentcar7', iconRentcar);
addSpot(560, 840, "<b>Maitai Electric Bicycle & Moped Rentals</b><br>Info ici…", 'rentcar', 'rentcar8', iconRentcar);
addSpot(580, 845, "<b>Hanihere Location</b><br>Téléphone: +689 40 04 26",'rentcar', 'rentcar9', iconRentcar);
addSpot(760, 1000, "<b>Tangi Location</b><br>Téléphone: +689 87 32 30 79",'rentcar', 'rentcar10', iconRentcar);
addSpot(840, 1055, "<b>Bora Bora Best Rent</b><br>Téléphone: +689 87 36 43 41",'rentcar', 'rentcar11', iconRentcar);
addSpot(1360, 505, "<b>Bora Rent</b><br>Téléphone: +689 89 29 99 21",'rentcar', 'rentcar12', iconRentcar);
addSpot(1175, 760, "<b>Raimoana Location</b><br>Téléphone: +689 89 70 57 81",'rentcar', 'rentcar13', iconRentcar);
addSpot(1165, 544, "<b>Teretere Location Bora</b><br>Téléphone: +689 87 20 67 72",'rentcar', 'rentcar14', iconRentcar);
addSpot(935, 680, "<b>Bora Bora K&L Rent a Car</b><br>Téléphone: +689 87 77 21 07",'rentcar', 'rentcar15', iconRentcar);

// Stations Essence
addSpot(976, 625, "<b>Mobile</b><br>Info ici…", 'essence', 'essence1', iconEssence);
addSpot(1040, 584, "<b>Total</b><br>Info ici…", 'essence', 'essence2', iconEssence);
addSpot(990, 1043, "<b>Pacific</b><br>Info ici…", 'essence', 'essence3', iconEssence);
addSpot(840, 1060, "<b>Pacific</b><br>Info ici…", 'essence', 'essence4', iconEssence);

// Églises
addSpot(970, 645, "<b>Temple Protestant de Vaitape</b><br>Info ici…", 'church', 'church1', iconChurch);
addSpot(1210, 755, "<b>Temple Protestant de Faanui</b><br>Info ici…", 'church', 'church2', iconChurch);
addSpot(1000, 1060, "<b>Temple Protestant de Anau</b><br>Info ici…", 'church', 'church3', iconChurch);
addSpot(930, 655, "<b>Église Catholique</b><br>Info ici…", 'church', 'church4', iconChurch);


// Sites Historiques
addSpot(1085, 574, "<b>Canon de Farepiti</b><br>Infos Ici…", 'sites', 'sites1', iconCanon);
addSpot(1390, 510, "<b>Canon du Pearl Beach</b><br>Infos Ici…", 'sites', 'sites2', iconCanon);
addSpot(1160, 1075, "<b>Canon de Anau</b><br>Infos Ici…", 'sites', 'sites3', iconCanon);
addSpot(1155, 1040, "<b>Marae de Anau</b><br>Infos Ici…", 'sites', 'sites4', iconSites);
addSpot(1310, 570, "<b>Marae Fare-Opu</b><br>Infos Ici…", 'sites', 'sites5', iconSites);

// Administrations
addSpot(940, 625, "<b>Mairie de Bora Bora</b><br>Infos Ici…", 'administrations', 'administrations1', iconMairie);
addSpot(945, 645, "<b>Poste de Gendarmerie</b><br>Infos Ici…", 'administrations', 'administrations2', iconPolice);
addSpot(965, 624, "<b>Caserne Pompier</b><br>Infos Ici…", 'administrations', 'administrations3', iconPompier);
addSpot(930, 638, "<b>Poste</b><br>Infos Ici…", 'administrations', 'administrations4', iconPoste);
addSpot(940, 618, "<b>Office du Tourisme</b><br>Infos Ici…", 'administrations', 'administrations5', iconCTBB);

// Randonnées
addSpot(1040, 800, "<b>Mont Pahia</b><br>561 Mètres !", 'rando', 'hike1', iconRando);
addSpot(1020, 900, "<b>Mont Otemanu</b><br>727 Mètres !", 'rando', 'hike2', iconRando);





