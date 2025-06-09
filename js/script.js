// Initialisation de la carte
const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1
});

// Taille de l'image
const imageWidth = 1500, imageHeight = 2000;
const bounds = [[0, 0], [imageHeight, imageWidth]];

// Ajout de l'image comme fond de carte
L.imageOverlay('img/bora_map.png', bounds).addTo(map);
map.fitBounds(bounds);

// Gestion du menu latéral
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

window.addEventListener('load', function() {
  sidebar.classList.remove('hidden');
  setTimeout(function() {
    sidebar.classList.add('hidden');
    menuToggle.classList.add('inactive');
  }, 1000);
  
  updateSidebarCategories(); // pour démarrer avec le menu clean
});

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
  menuToggle.classList.toggle('inactive');
});

// Gestion des boutons toggle
const toggleButtons = document.querySelectorAll('.toggle-btn');

toggleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;

    // Toggle la classe active sur le bouton
    button.classList.toggle('active');

    // Récupérer les catégories actives après toggle
    const activeCategories = Array.from(toggleButtons)
      .filter(btn => btn.classList.contains('active'))
      .map(btn => btn.dataset.category);

    // D'abord retirer tous les marqueurs
    for (let cat in categories) {
      categories[cat].forEach(marker => {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      });
    }

    if (activeCategories.length === 0) {
      // Option 1 : si aucune catégorie active, afficher tout
      for (let cat in categories) {
        categories[cat].forEach(marker => {
          map.addLayer(marker);
        });
      }

      // Option 2 (alternative) : si aucune catégorie active, afficher rien (ne rien faire)
      // Ici, on garde Option 1 pour l’exemple.
    } else {
      // Ajouter les marqueurs des catégories actives
      activeCategories.forEach(cat => {
        categories[cat].forEach(marker => {
          map.addLayer(marker);
        });
      });
    }

    // Mettre à jour le menu latéral
    updateSidebarCategories();
  });
});


// Gestion du bouton Tout afficher
const showAllButton = document.getElementById('show-all');

showAllButton.addEventListener('click', () => {
  const allActive = Array.from(toggleButtons).every(button => button.classList.contains('active'));

  if (allActive) {
    for (let cat in categories) {
      categories[cat].forEach(marker => {
        map.removeLayer(marker);
      });
    }

    toggleButtons.forEach(button => {
      button.classList.remove('active');
    });

    showAllButton.textContent = 'Tout afficher';

  } else {
    for (let cat in categories) {
      categories[cat].forEach(marker => {
        map.addLayer(marker);
      });
    }

    toggleButtons.forEach(button => {
      button.classList.add('active');
    });

    showAllButton.textContent = 'Tout masquer';
  }

  // ➝ Mettre à jour le menu latéral après action globale
  updateSidebarCategories();
});

    // Met à jour le texte du bouton
    showAllButton.textContent = 'Tout afficher';


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

function updateSidebarCategories() {
  const categoryDivs = document.querySelectorAll('#sidebar .category');
  const activeButtons = Array.from(toggleButtons).filter(button => button.classList.contains('active'));

  if (activeButtons.length === 0) {
    // Aucun bouton actif → cacher toutes les catégories avec animation
    categoryDivs.forEach(div => {
      div.classList.remove('visible');
    });
    return;
  }

  // Sinon, cacher toutes d'abord
  categoryDivs.forEach(div => {
    div.classList.remove('visible');
  });

  // Puis afficher celles des boutons actifs
  activeButtons.forEach(button => {
    const cat = button.dataset.category;
    const div = document.querySelector(`#sidebar .category[data-cat="${cat}"]`);
    if (div) {
      div.classList.add('visible');
    }
  });
}

// Logo des hotels - Marqueurs FIXE
const fixedHotelMarkers = L.layerGroup().addTo(map);

const fixedHotelIcon = L.icon({
  iconUrl: 'img/St Régis Bora.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

const hotelFixedMarker = L.marker([1189, 1430], { icon: fixedHotelIcon });
hotelFixedMarker.bindPopup("<b>Hôtel Bora Paradise</b>");
fixedHotelMarkers.addLayer(hotelFixedMarker);

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
  traveloffice: [],
  bank: [],
  wc: [],
  shop: [],
  art: [],
};

// Fonction pour créer un marqueur et l'ajouter dans la catégorie
function addSpot(lat, lng, popupContent, category, spotId, icon, images = []) {
  const marker = L.marker([lat, lng], { icon: icon });
  let fullPopupContent = `<div style="text-align:center;">${popupContent}</div>`;

  if (images.length > 0) {
    fullPopupContent += `<div style="margin-top:5px;">`;
    images.forEach(img => {
      fullPopupContent += `
        <img src="${img}" alt="Photo du lieu" style="width:100px; margin:3px; border-radius:8px;">`;
    });
    fullPopupContent += `</div>`;
  }

  marker.bindPopup(fullPopupContent);
  
  // Initialise la catégorie si elle n'existe pas encore
  if (!categories[category]) {
    categories[category] = [];
  }

  categories[category].push(marker);
  marker.spotId = spotId;
  map.addLayer(marker);
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

const iconAirtahiti = L.icon({
  iconUrl: 'img/marker-airtahiti.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconAirmoana = L.icon({
  iconUrl: 'img/marker-airmoana.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconBank = L.icon({
  iconUrl: 'img/marker-banques.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconWc = L.icon({
  iconUrl: 'img/marker-bleue-wc.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconArtisanat = L.icon({
  iconUrl: 'img/marker-rose-artisanat.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconShop = L.icon({
  iconUrl: 'img/marker-shop.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconValise = L.icon({
  iconUrl: 'img/marker-valise.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconArt = L.icon({
  iconUrl: 'img/marker-rose-art.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconAgencebateau = L.icon({
  iconUrl: 'img/marker-gris-agence-bateau.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const iconAirport= L.icon({
  iconUrl: 'img/markers-bleue-aéroport.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});


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
addSpot(974, 624, "<b>Aloe Café</b><br>Téléphone: +689 40 67 78 88", 'snack', 'Snack1', iconSnack, ["img_commerces/AloeCafe2.jpeg"]);
addSpot(990, 645, "<b>Pizzeria Paradisio</b><br>Téléphone: +689 40 67 59 83", 'snack', 'Snack2', iconSnack);
addSpot(983, 645, "<b>Snack Chez Lolo</b><br>Téléphone: +689 87 25 25 89", 'snack', 'Snack3', iconSnack, ["img_commerces/SnackChezLolo1.jpeg"]);
addSpot(550, 780, "<b>Snack Matira</b><br>Téléphone: +689 40 67 77 32", 'snack', 'Snack4', iconSnack);
addSpot(480, 825, "<b>Snack Monoihere</b><br>Téléphone: +689 87 74 03 02", 'snack', 'Snack5', iconSnack);
addSpot(480, 830, "<b>Snack Otoamana</b><br>Infos ici...", 'snack', 'Snack6', iconSnack);
addSpot(865, 694, "<b>Snack Irène</b><br>Téléphone: +689 87 79 26 35", 'snack', 'Snack7', iconSnack);
addSpot(1010, 630, "<b>Chez Nico</b><br>Infos Ici…", 'snack', 'Snack8', iconSnack);
addSpot(860, 870, "<b>Boulangerie Matira</b><br>Téléphone: +689 40 67 67 06", 'snack', 'Snack9', iconPatisserie);
addSpot(1025, 620, "<b>Pâtisserie St James</b><br>Téléphone: +689 40 67 64 62", 'snack', 'Snack10', iconPatisserie);
addSpot(900, 660, "<b>Iaorana Gelato</b><br>Téléphone: +689 89 50 42 52", 'snack', 'Snack11', iconGlacier);
addSpot(1015, 630, "<b>Bora Healthy</b><br>Téléphone: +689 87 27 73 41", 'snack', 'Snack12', iconSnack);
addSpot(950, 645, "<b>BobCat Wine & Cofee</b><br>Téléphone: +689 87 01 87 01", 'snack', 'Snack13', iconSnack, ["img_commerces/BobCat1.jpeg"]);
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
addSpot(976, 645, "<b>Chin Lee Market</b><br>Supermarché local", 'market', 'market1', iconMarket, ["img_commerces/chinlee1.jpeg"]);
addSpot(1030, 635, "<b>Super U Toa Amok</b><br>Supermarché local", 'market', 'market2', iconMarket);
addSpot(990, 1040, "<b>U Express Toa Areni</b><br>Supermarché local", 'market', 'market3', iconMarket);
addSpot(1140, 690, "<b>Hitiata</b><br>Supermarché local", 'market', 'market4', iconMarket);
addSpot(520, 835, "<b>Magasin Matira</b><br>Supermarché local", 'market', 'market5', iconMarket);
addSpot(590, 850, "<b>Tiare Market</b><br>Supermarché local", 'market', 'market6', iconMarket);
addSpot(910, 645, "<b>Bora Traiding</b><br>Supermarché local", 'market', 'market7', iconMarket);
addSpot(860, 710, "<b>Magasin Antoine</b><br>Supermarché local", 'market', 'market8', iconMarket);
addSpot(1230, 725, "<b>Magasin A'a</b><br>Supermarché local", 'market', 'market9', iconMarket);

// Pharmacy
addSpot(986, 645, "<b>Pharmacie Lafayette Bora Bora</b><br>Info ici…", 'pharmacy', 'pharmacy1', iconPharmacie, ["img_commerces/AlbertStore1.jpeg", "img_commerces/AlbertStore3.jpeg"]);
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
addSpot(940, 650, "<b>Albert Store</b><br>Téléphone: +689 40 67 5 55", 'rentcar', 'rentcar3', iconRentcar, ["img_commerces/PharmacieLafayette.jpeg", "img_commerces/PharmacieLafayette2.jpeg"]);
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
addSpot(976, 625, "<b>Mobile</b><br>Info ici…", 'essence', 'essence1', iconEssence, ["img_commerces/StationMobil.jpeg"]);
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
addSpot(940, 625, "<b>Mairie de Bora Bora</b><br>Infos Ici…", 'administrations', 'administrations1', iconMairie, ["img_commerces/Mairie2.jpeg"]);
addSpot(945, 645, "<b>Poste de Gendarmerie</b><br>Infos Ici…", 'administrations', 'administrations2', iconPolice);
addSpot(965, 624, "<b>Caserne Pompier</b><br>Infos Ici…", 'administrations', 'administrations3', iconPompier);
addSpot(930, 638, "<b>Poste</b><br>Infos Ici…", 'administrations', 'administrations4', iconPoste);
addSpot(940, 618, "<b>Office du Tourisme</b><br>Infos Ici…", 'administrations', 'administrations5', iconCTBB);
addSpot(1686, 540, "<b>Aéroport</b><br>Infos Ici…", 'administrations', 'administrations6', iconAirport);

// Agence de Voyage
addSpot(945, 620, "<b>Air Tahiti</b><br>Infos Ici…", 'traveloffice', 'traveloffice1', iconAirtahiti);
addSpot(923, 655, "<b>Air Moana</b><br>Infos Ici…", 'traveloffice', 'traveloffice2', iconAirmoana, ["img_commerces/AirMoana5.jpeg", "img_commerces/AirMoana6.jpeg"]);
addSpot(938, 618, "<b>Maupiti Express</b><br>Infos Ici…", 'traveloffice', 'traveloffice3', iconAgencebateau);
addSpot(1025, 625, "<b>Apetahi Express</b><br>Infos Ici…", 'traveloffice', 'traveloffice4', iconAgencebateau);

// Banques
addSpot(940, 630, "<b>Banque de Polynésie</b><br>Infos Ici…", 'bank', 'bank1', iconBank, ["img_commerces/BanquedePolynesie1.jpeg"]);
addSpot(1005, 630, "<b>Banque Socredo</b><br>Infos Ici…", 'bank', 'bank2', iconBank);
addSpot(895, 660, "<b>Banque de Tahiti</b><br>Infos Ici…", 'bank', 'bank2', iconBank);

// Toilettes Publique
addSpot(956, 620, "<b>Toilettes de Vaitape 1</b><br>Infos Ici…", 'wc', 'wc1', iconWc);
addSpot(965, 617, "<b>Toilettes de Vaitape 2</b><br>Infos Ici…", 'wc', 'wc2', iconWc);
addSpot(470, 840, "<b>Toilettes de Matira</b><br>Infos Ici…", 'wc', 'wc3', iconWc);

// Boutiques
addSpot(950, 620, "<b>Artisanat</b><br>Infos Ici…", 'shop', 'shop1', iconArtisanat);
addSpot(942, 647, "<b>Boutique Bora Bora</b><br>Infos Ici…", 'shop', 'shop2', iconShop, ["img_commerces/BoraBoraBoutique1.jpeg", "img_commerces/BoraBoraBoutique2.jpeg"]);
addSpot(924, 643, "<b>Bora Bora Original</b><br>Infos Ici…", 'shop', 'shop3', iconShop, ["img_commerces/BBO1.jpeg"]);
addSpot(997, 645, "<b>Consigne à Bagage</b><br>Infos Ici…", 'shop', 'shop3', iconValise, ["img_commerces/ArcEnCiel.jpeg"]);

// Galleries d'Art
addSpot(1000, 670, "<b>Art Gallery & Studio Alain Desoert</b><br>Infos Ici…", 'art', 'art1', iconArt);
addSpot(665, 835, "<b>Art Studia & Gallery Garick Yrondi</b><br>Infos Ici…", 'art', 'art2', iconArt);
addSpot(900, 645, "<b>Artist Studio Jean-Pierre Frey</b><br>Infos Ici…", 'art', 'art3', iconArt, ["img_commerces/GalerieDartJPFrey.jpeg"]);
addSpot(935, 635, "<b>Bora Art Upstairs</b><br>Infos Ici…", 'art', 'art4', iconArt, ["img_commerces/BoraArtUpstairs4.jpeg", "img_commerces/BoraArtUpstairs1.jpeg"]);
addSpot(1180, 815, "<b>Bora Bora Masson Art Gallery</b><br>Infos Ici…", 'art', 'art5', iconArt);
addSpot(935, 630, "<b>Bora Secret</b><br>Infos Ici…", 'art', 'art6', iconArt);

// Randonnées
addSpot(1040, 800, "<b>Mont Pahia</b><br>561 Mètres !", 'rando', 'hike1', iconRando);
addSpot(1020, 900, "<b>Mont Otemanu</b><br>727 Mètres !", 'rando', 'hike2', iconRando);





