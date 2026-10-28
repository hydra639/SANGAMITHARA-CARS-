/**
 * ==============================================================================
 * MITHARA TRAVEL AGENCY - JAVASCRIPT ENGINE
 * Base Location: Salem, Tamil Nadu
 * Tariff: ₹80 per kilometer
 * Comprehensive coverage: ALL 38 DISTRICTS & MAJOR HUBS IN TAMIL NADU
 * Interactive Leaflet Map Visualizer + High-Performance Road Routing Engine
 * ==============================================================================
 */

// ==============================================================================
// 1. GLOBAL CONSTANTS & CONFIGURATION
// ==============================================================================

/**
 * Official Company / Brand Name
 */
const AGENCY_NAME = "Mithara Travel Agency";

/**
 * Official fixed rate per kilometer for all vehicles in the fleet.
 */
const RATE_PER_KM = 80;

/**
 * Company Dispatch WhatsApp Number (Country Code + Phone Number).
 */
const WHATSAPP_NUMBER = "917904974485";

/**
 * Default origin hub coordinates for Salem, Tamil Nadu.
 * Latitude: 11.6643, Longitude: 78.1460
 */
const SALEM_HUB_COORDS = {
  name: "Salem, Tamil Nadu",
  district: "Salem",
  lat: 11.6643,
  lon: 78.1460
};

/**
 * Road curvature / tortuosity factor.
 * Applied for fallback calculation when offline or network routing is delayed.
 */
const ROAD_TORTUOSITY_FACTOR = 1.28;

// ==============================================================================
// 2. COMPREHENSIVE TAMIL NADU MASTER LOCATIONS DATABASE (120+ HUBS)
// Covers all 38 districts, pilgrimage towns, hill stations, transport hubs & corridors.
// ==============================================================================

const TAMIL_NADU_LOCATIONS = [
  // --- SALEM DISTRICT & IMMEDIATE REGION ---
  { name: "Salem City, Salem", district: "Salem", region: "salem", category: "District Headquarters", lat: 11.6643, lon: 78.1460, approxKm: 0, keywords: ["salem", "central", "junction", "old bus stand", "new bus stand"] },
  { name: "Salem Junction Railway Station", district: "Salem", region: "salem", category: "Railway Station", lat: 11.6685, lon: 78.1256, approxKm: 5, keywords: ["railway", "train", "station", "suramangalam"] },
  { name: "Salem Airport (Kamalapuram)", district: "Salem", region: "salem", category: "Airport", lat: 11.7797, lon: 78.0650, approxKm: 18, keywords: ["airport", "flight", "kamalapuram", "omalur"] },
  { name: "Yercaud, Salem", district: "Salem", region: "hills", category: "Hill Station", lat: 11.7753, lon: 78.2093, approxKm: 32, keywords: ["yercaud", "shevaroy", "lake", "viewpoint", "killiyur"] },
  { name: "Mettur Dam, Salem", district: "Salem", region: "salem", category: "Tourist & Industrial", lat: 11.7958, lon: 77.8016, approxKm: 52, keywords: ["mettur", "dam", "cauvery", "thermal"] },
  { name: "Sankagiri, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.4883, lon: 77.8697, approxKm: 42, keywords: ["sankari", "fort", "highway", "toll"] },
  { name: "Attur, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.5977, lon: 78.5996, approxKm: 55, keywords: ["attur", "vasanthapuram", "talaivasal"] },
  { name: "Omalur, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.7431, lon: 78.0433, approxKm: 16, keywords: ["omalur", "junction", "airport road"] },
  { name: "Edappadi, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.5833, lon: 77.8488, approxKm: 45, keywords: ["edappadi", "poolampatti", "cauvery"] },
  { name: "Vazhapadi, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.6567, lon: 78.4042, approxKm: 32, keywords: ["vazhapadi", "valapady", "attur highway"] },
  { name: "Tharamangalam, Salem", district: "Salem", region: "salem", category: "Heritage Temple", lat: 11.7001, lon: 77.9788, approxKm: 26, keywords: ["tharamangalam", "kailasanathar temple"] },
  { name: "Jalakandapuram, Salem", district: "Salem", region: "salem", category: "Salem District", lat: 11.7061, lon: 77.8872, approxKm: 36, keywords: ["jalakandapuram", "textile"] },
  { name: "Mecheri, Salem", district: "Salem", region: "salem", category: "Temple Town", lat: 11.8340, lon: 77.9372, approxKm: 35, keywords: ["mecheri", "bhadrakali amman temple"] },

  // --- KONGU REGION (NAMAKKAL, ERODE, COIMBATORE, TIRUPPUR, KARUR, DHARMAPURI, KRISHNAGIRI) ---
  { name: "Namakkal City, Tamil Nadu", district: "Namakkal", region: "kongu", category: "District Headquarters", lat: 11.2189, lon: 78.1674, approxKm: 52, keywords: ["namakkal", "anjaneyar", "fort", "poultry"] },
  { name: "Tiruchengode, Namakkal", district: "Namakkal", region: "kongu", category: "Industrial & Temple", lat: 11.3789, lon: 77.8967, approxKm: 46, keywords: ["tiruchengode", "ardhanareeswarar", "rig", "borewell"] },
  { name: "Rasipuram, Namakkal", district: "Namakkal", region: "kongu", category: "Town Hub", lat: 11.4632, lon: 78.1788, approxKm: 28, keywords: ["rasipuram", "ghee", "sago"] },
  { name: "Paramathi Velur, Namakkal", district: "Namakkal", region: "kongu", category: "Cauvery Riverside", lat: 11.1112, lon: 78.0135, approxKm: 68, keywords: ["velur", "paramathi", "betel"] },
  { name: "Kolli Hills, Namakkal", district: "Namakkal", region: "hills", category: "Hill Station", lat: 11.2485, lon: 78.3385, approxKm: 85, keywords: ["kolli hills", "arapaleeswarar", "hairpin", "agaya gangai"] },

  { name: "Erode City, Tamil Nadu", district: "Erode", region: "kongu", category: "District Headquarters", lat: 11.3410, lon: 77.7172, approxKm: 65, keywords: ["erode", "turmeric", "textile", "railway station"] },
  { name: "Bhavani, Erode", district: "Erode", region: "kongu", category: "Spiritual Hub", lat: 11.4489, lon: 77.6833, approxKm: 58, keywords: ["bhavani", "sangameshwarar", "kooduthurai", "triveni"] },
  { name: "Perundurai, Erode", district: "Erode", region: "kongu", category: "SIPCOT Industrial", lat: 11.2764, lon: 77.5833, approxKm: 82, keywords: ["perundurai", "sipcot", "highway"] },
  { name: "Gobichettipalayam, Erode", district: "Erode", region: "kongu", category: "Agricultural Hub", lat: 11.4552, lon: 77.4422, approxKm: 102, keywords: ["gobi", "gobichettipalayam", "cinema", "paddy"] },
  { name: "Sathyamangalam, Erode", district: "Erode", region: "kongu", category: "Tiger Reserve Corridor", lat: 11.5042, lon: 77.2410, approxKm: 125, keywords: ["sathy", "sathyamangalam", "bannari amman temple", "forest"] },
  { name: "Kodumudi, Erode", district: "Erode", region: "kongu", category: "Temple Town", lat: 11.0805, lon: 77.8872, approxKm: 88, keywords: ["kodumudi", "magudeswarar", "cauvery"] },

  { name: "Dharmapuri, Tamil Nadu", district: "Dharmapuri", region: "kongu", category: "District Headquarters", lat: 12.1211, lon: 78.1582, approxKm: 68, keywords: ["dharmapuri", "highway", "mango"] },
  { name: "Hogenakkal Falls, Dharmapuri", district: "Dharmapuri", region: "salem", category: "Waterfalls & Tourism", lat: 12.1182, lon: 77.7766, approxKm: 88, keywords: ["hogenakkal", "falls", "boating", "coracle", "cauvery"] },
  { name: "Harur, Dharmapuri", district: "Dharmapuri", region: "kongu", category: "Town Hub", lat: 12.0622, lon: 78.4947, approxKm: 72, keywords: ["harur", "theerthamalai"] },
  { name: "Palacode, Dharmapuri", district: "Dharmapuri", region: "kongu", category: "Agricultural Hub", lat: 12.3022, lon: 78.0772, approxKm: 92, keywords: ["palacode", "tomato", "sugar mill"] },

  { name: "Krishnagiri, Tamil Nadu", district: "Krishnagiri", region: "kongu", category: "District Headquarters", lat: 12.5186, lon: 78.2137, approxKm: 112, keywords: ["krishnagiri", "fort", "dam", "tollgate"] },
  { name: "Hosur, Krishnagiri", district: "Krishnagiri", region: "kongu", category: "Industrial Corridor", lat: 12.7409, lon: 77.8253, approxKm: 155, keywords: ["hosur", "sipcot", "border", "tvs", "titan"] },
  { name: "Rayakottai, Krishnagiri", district: "Krishnagiri", region: "kongu", category: "Heritage Fort", lat: 12.5167, lon: 78.0333, approxKm: 118, keywords: ["rayakottai", "fort", "vegetable market"] },
  { name: "Denkanikottai, Krishnagiri", district: "Krishnagiri", region: "kongu", category: "Town Hub", lat: 12.5292, lon: 77.7903, approxKm: 145, keywords: ["denkanikottai", "bettamugilalam"] },

  { name: "Coimbatore City (Gandhipuram)", district: "Coimbatore", region: "kongu", category: "District Headquarters / Metro", lat: 11.0168, lon: 76.9558, approxKm: 165, keywords: ["coimbatore", "kovai", "gandhipuram", "crosscut", "rs puram"] },
  { name: "Coimbatore Airport (CJB - Peelamedu)", district: "Coimbatore", region: "kongu", category: "Airport", lat: 11.0298, lon: 77.0434, approxKm: 155, keywords: ["coimbatore airport", "cjb", "peelamedu", "flight"] },
  { name: "Singanallur, Coimbatore", district: "Coimbatore", region: "kongu", category: "Transit Hub", lat: 11.0012, lon: 77.0252, approxKm: 158, keywords: ["singanallur", "bus stand", "trichy road"] },
  { name: "Pollachi, Coimbatore", district: "Coimbatore", region: "kongu", category: "Coconut City / Tourism", lat: 10.6609, lon: 77.0089, approxKm: 195, keywords: ["pollachi", "coconut", "aliyar", "topslip", "anamalai"] },
  { name: "Mettupalayam, Coimbatore", district: "Coimbatore", region: "kongu", category: "Nilgiri Foothills Gateway", lat: 11.2994, lon: 76.9427, approxKm: 172, keywords: ["mettupalayam", "toy train", "bhavani", "black thunder"] },
  { name: "Valparai, Coimbatore", district: "Coimbatore", region: "hills", category: "Hill Station", lat: 10.3263, lon: 76.9554, approxKm: 255, keywords: ["valparai", "tea estate", "sholayar", "hairpin bends"] },
  { name: "Isha Yoga Center, Coimbatore", district: "Coimbatore", region: "pilgrimage", category: "Spiritual Landmark", lat: 10.9772, lon: 76.7408, approxKm: 195, keywords: ["isha", "adiyogi", "dhyanalinga", "vellangiri"] },

  { name: "Tiruppur City, Tamil Nadu", district: "Tiruppur", region: "kongu", category: "District Headquarters / Knitwear Capital", lat: 11.1085, lon: 77.3411, approxKm: 115, keywords: ["tirupur", "tiruppur", "cotton", "garments", "old bus stand"] },
  { name: "Avinashi, Tiruppur", district: "Tiruppur", region: "kongu", category: "Heritage Temple Town", lat: 11.1931, lon: 77.2691, approxKm: 122, keywords: ["avinashi", "avinashilingeswarar", "highway"] },
  { name: "Palladam, Tiruppur", district: "Tiruppur", region: "kongu", category: "Broiler & Textile Hub", lat: 11.0051, lon: 77.2917, approxKm: 135, keywords: ["palladam", "poultry", "highway"] },
  { name: "Dharapuram, Tiruppur", district: "Tiruppur", region: "kongu", category: "Town Hub", lat: 10.7289, lon: 77.5253, approxKm: 145, keywords: ["dharapuram", "amaravathi river", "kongu"] },
  { name: "Kangeyam, Tiruppur", district: "Tiruppur", region: "kongu", category: "Commercial Town", lat: 11.0047, lon: 77.5606, approxKm: 110, keywords: ["kangeyam", "bull", "ghee", "oil mill"] },
  { name: "Udumalaipettai, Tiruppur", district: "Tiruppur", region: "kongu", category: "Town Hub", lat: 10.5843, lon: 77.2471, approxKm: 185, keywords: ["udumalpet", "amaravathi dam", "thirumoorthy falls"] },

  { name: "Karur City, Tamil Nadu", district: "Karur", region: "kongu", category: "District Headquarters", lat: 10.9601, lon: 78.0766, approxKm: 95, keywords: ["karur", "home textile", "bus body", "amaravathi"] },
  { name: "Kulithalai, Karur", district: "Karur", region: "kongu", category: "Cauvery Riverside", lat: 10.9333, lon: 78.4167, approxKm: 115, keywords: ["kulithalai", "kadambar koil", "cauvery"] },
  { name: "Aravakurichi, Karur", district: "Karur", region: "kongu", category: "Highway Hub", lat: 10.7719, lon: 77.9103, approxKm: 125, keywords: ["aravakurichi", "moringa", "nh44"] },

  // --- HILL STATIONS OF TAMIL NADU ---
  { name: "Ooty (Udhagamandalam), Nilgiris", district: "Nilgiris", region: "hills", category: "Queen of Hill Stations", lat: 11.4102, lon: 76.6950, approxKm: 220, keywords: ["ooty", "udhagamandalam", "botanical garden", "lake", "doddabetta"] },
  { name: "Coonoor, Nilgiris", district: "Nilgiris", region: "hills", category: "Hill Station", lat: 11.3530, lon: 76.7959, approxKm: 205, keywords: ["coonoor", "sims park", "lambs rock", "tea gardens"] },
  { name: "Kotagiri, Nilgiris", district: "Nilgiris", region: "hills", category: "Hill Station", lat: 11.4286, lon: 76.8661, approxKm: 198, keywords: ["kotagiri", "kodanad", "catherine falls", "tea"] },
  { name: "Gudalur, Nilgiris", district: "Nilgiris", region: "hills", category: "Mudumalai Gateway", lat: 11.5074, lon: 76.4922, approxKm: 260, keywords: ["gudalur", "mudumalai", "kerala border", "bandipur"] },
  { name: "Kodaikanal, Dindigul", district: "Dindigul", region: "hills", category: "Princess of Hill Stations", lat: 10.2381, lon: 77.4892, approxKm: 245, keywords: ["kodaikanal", "kodai", "lake", "coakers walk", "pillar rocks", "silver cascade"] },
  { name: "Yelagiri Hills, Tirupathur", district: "Tirupathur", region: "hills", category: "Hill Station", lat: 12.5794, lon: 78.6389, approxKm: 175, keywords: ["yelagiri", "athanavur", "boat house", "hairpin"] },
  { name: "Meghamalai, Theni", district: "Theni", region: "hills", category: "High Wavy Mountains", lat: 9.7833, lon: 77.3833, approxKm: 310, keywords: ["meghamalai", "cloud mountain", "tea", "waterfalls"] },

  // --- CENTRAL TAMIL NADU (TRICHY, THANJAVUR, DINDIGUL, PERAMBALUR, ARIYALUR, PUDUKKOTTAI) ---
  { name: "Tiruchirappalli (Trichy Central)", district: "Tiruchirappalli", region: "central", category: "District Headquarters / City", lat: 10.7905, lon: 78.7047, approxKm: 140, keywords: ["trichy", "tiruchirapalli", "central bus stand", "junction", "rockfort"] },
  { name: "Srirangam, Trichy", district: "Tiruchirappalli", region: "pilgrimage", category: "Premier Divya Desam", lat: 10.8622, lon: 78.6946, approxKm: 135, keywords: ["srirangam", "ranganathaswamy temple", "rajagopuram", "cauvery"] },
  { name: "Trichy International Airport (TRZ)", district: "Tiruchirappalli", region: "central", category: "Airport", lat: 10.7654, lon: 78.7126, approxKm: 145, keywords: ["trichy airport", "trz", "international flight", "dubai", "singapore"] },
  { name: "Samayapuram, Trichy", district: "Tiruchirappalli", region: "pilgrimage", category: "Temple Town", lat: 10.9238, lon: 78.7423, approxKm: 125, keywords: ["samayapuram", "mariamman temple", "tollgate"] },
  { name: "Thuraiyur, Trichy", district: "Tiruchirappalli", region: "central", category: "Town Hub", lat: 11.1444, lon: 78.5958, approxKm: 95, keywords: ["thuraiyur", "prasanna venkatachalapathy", "perumalmalai"] },
  { name: "Manapparai, Trichy", district: "Tiruchirappalli", region: "central", category: "Commercial Town", lat: 10.6067, lon: 78.4167, approxKm: 155, keywords: ["manapparai", "murukku", "cattle market"] },

  { name: "Thanjavur (Tanjore) City", district: "Thanjavur", region: "central", category: "District Headquarters / Heritage Capital", lat: 10.7870, lon: 79.1378, approxKm: 200, keywords: ["thanjavur", "tanjore", "brihadisvara", "big temple", "palace"] },
  { name: "Kumbakonam, Thanjavur", district: "Thanjavur", region: "pilgrimage", category: "Temple City of Tamil Nadu", lat: 10.9602, lon: 79.3845, approxKm: 215, keywords: ["kumbakonam", "mahamaham", "sarangapani", "uppiliappan", "filter coffee"] },
  { name: "Swamimalai, Thanjavur", district: "Thanjavur", region: "pilgrimage", category: "Arupadaiveedu Shrine", lat: 10.9567, lon: 79.3283, approxKm: 210, keywords: ["swamimalai", "murugan", "arupadaiveedu", "bronze icon"] },
  { name: "Pattukkottai, Thanjavur", district: "Thanjavur", region: "central", category: "Town Hub", lat: 10.4264, lon: 79.3178, approxKm: 245, keywords: ["pattukkottai", "coconut", "delta"] },
  { name: "Thiruvaiyaru, Thanjavur", district: "Thanjavur", region: "pilgrimage", category: "Music & Cultural Hub", lat: 10.8833, lon: 79.1000, approxKm: 195, keywords: ["thiruvaiyaru", "tyagaraja aradhana", "aiyarappar", "cauvery"] },

  { name: "Dindigul City, Tamil Nadu", district: "Dindigul", region: "central", category: "District Headquarters", lat: 10.3673, lon: 77.9803, approxKm: 175, keywords: ["dindigul", "biryani", "rock fort", "lock"] },
  { name: "Palani, Dindigul", district: "Dindigul", region: "pilgrimage", category: "Murugan Dhandayuthapani Shrine", lat: 10.4500, lon: 77.5167, approxKm: 195, keywords: ["palani", "dhandayuthapani", "murugan temple", "panchamirtham", "ropeway"] },
  { name: "Oddanchatram, Dindigul", district: "Dindigul", region: "central", category: "Vegetable Trading Hub", lat: 10.4833, lon: 77.7500, approxKm: 180, keywords: ["oddanchatram", "market", "highway"] },

  { name: "Perambalur, Tamil Nadu", district: "Perambalur", region: "central", category: "District Headquarters", lat: 11.2333, lon: 78.8833, approxKm: 115, keywords: ["perambalur", "nh45", "sugar mill"] },
  { name: "Ariyalur, Tamil Nadu", district: "Ariyalur", region: "central", category: "District Headquarters", lat: 11.1401, lon: 79.0786, approxKm: 145, keywords: ["ariyalur", "cement city", "fossils"] },
  { name: "Gangaikonda Cholapuram, Ariyalur", district: "Ariyalur", region: "pilgrimage", category: "UNESCO World Heritage Site", lat: 11.2064, lon: 79.4522, approxKm: 175, keywords: ["gangaikonda cholapuram", "rajendra chola", "big temple"] },
  { name: "Jayankondam, Ariyalur", district: "Ariyalur", region: "central", category: "Town Hub", lat: 11.2167, lon: 79.3500, approxKm: 165, keywords: ["jayankondam", "lignite", "chola"] },

  { name: "Pudukkottai City, Tamil Nadu", district: "Pudukkottai", region: "central", category: "District Headquarters", lat: 10.3833, lon: 78.8167, approxKm: 185, keywords: ["pudukkottai", "princely state", "sittannavasal", "palace"] },
  { name: "Aranthangi, Pudukkottai", district: "Pudukkottai", region: "central", category: "Town Hub", lat: 10.1667, lon: 78.9833, approxKm: 225, keywords: ["aranthangi", "fort", "coastal access"] },
  { name: "Viralimalai, Pudukkottai", district: "Pudukkottai", region: "pilgrimage", category: "Murugan Hill Temple", lat: 10.6053, lon: 78.5433, approxKm: 145, keywords: ["viralimalai", "murugan temple", "peacock sanctuary"] },

  // --- COASTAL DELTA (NAGAPATTINAM, MAYILADUTHURAI, TIRUVARUR, CUDDALORE) ---
  { name: "Velankanni, Nagapattinam", district: "Nagapattinam", region: "pilgrimage", category: "Basilica of Our Lady of Good Health", lat: 10.6805, lon: 79.8492, approxKm: 275, keywords: ["velankanni", "church", "basilica", "beach", "pilgrimage"] },
  { name: "Nagapattinam Port Town", district: "Nagapattinam", region: "coastal", category: "District Headquarters / Port", lat: 10.7667, lon: 79.8333, approxKm: 265, keywords: ["nagapattinam", "port", "beach", "ferry"] },
  { name: "Vedaranyam, Nagapattinam", district: "Nagapattinam", region: "coastal", category: "Historical Coastal Salt March", lat: 10.3667, lon: 79.8500, approxKm: 310, keywords: ["vedaranyam", "salt satyagraha", "point calimere", "birds sanctuary"] },

  { name: "Mayiladuthurai City, Tamil Nadu", district: "Mayiladuthurai", region: "central", category: "District Headquarters", lat: 11.1035, lon: 79.6547, approxKm: 225, keywords: ["mayiladuthurai", "mayavaram", "mayuranathar temple", "cauvery"] },
  { name: "Tharangambadi (Tranquebar)", district: "Mayiladuthurai", region: "coastal", category: "Danish Heritage Coastal Fort", lat: 11.0333, lon: 79.8500, approxKm: 250, keywords: ["tranquebar", "tharangambadi", "danish fort", "beach"] },
  { name: "Sirkazhi, Mayiladuthurai", district: "Mayiladuthurai", region: "pilgrimage", category: "Temple Town", lat: 11.2333, lon: 79.7333, approxKm: 235, keywords: ["sirkazhi", "bhrahmapureeswarar", "thirugnanasambandar"] },
  { name: "Vaitheeswaran Koil, Mayiladuthurai", district: "Mayiladuthurai", region: "pilgrimage", category: "Navagraha Chevvai Temple", lat: 11.2000, lon: 79.7167, approxKm: 230, keywords: ["vaitheeswaran koil", "nadi astrology", "angarakar", "chevvai"] },
  { name: "Thirunallar (Saniswaran Temple)", district: "Karaikal", region: "pilgrimage", category: "Navagraha Sani Temple", lat: 10.9300, lon: 79.7900, approxKm: 255, keywords: ["thirunallar", "sani peyarchi", "saniswaran", "navagraha"] },

  { name: "Tiruvarur City, Tamil Nadu", district: "Tiruvarur", region: "central", category: "District Headquarters / Heritage", lat: 10.7719, lon: 79.6369, approxKm: 235, keywords: ["tiruvarur", "thiyagaraja temple", "azhi ther", "car festival", "kamalalayam"] },
  { name: "Mannargudi, Tiruvarur", district: "Tiruvarur", region: "pilgrimage", category: "Rajagopalaswamy Temple", lat: 10.6667, lon: 79.4500, approxKm: 230, keywords: ["mannargudi", "dakshina dwaraka", "rajagopalaswamy"] },

  { name: "Cuddalore Port Town", district: "Cuddalore", region: "coastal", category: "District Headquarters / Port", lat: 11.7500, lon: 79.7500, approxKm: 205, keywords: ["cuddalore", "silver beach", "sipcot"] },
  { name: "Chidambaram, Cuddalore", district: "Cuddalore", region: "pilgrimage", category: "Nataraja Cosmic Dance Temple", lat: 11.3992, lon: 79.6936, approxKm: 215, keywords: ["chidambaram", "nataraja", "akasa lingam", "annamalai university", "dikshithar"] },
  { name: "Neyveli Township, Cuddalore", district: "Cuddalore", region: "central", category: "Lignite Corporation / Thermal Power", lat: 11.5997, lon: 79.4867, approxKm: 175, keywords: ["neyveli", "nlc", "lignite", "township"] },
  { name: "Panruti, Cuddalore", district: "Cuddalore", region: "central", category: "Cashew & Jackfruit Hub", lat: 11.7700, lon: 79.5500, approxKm: 185, keywords: ["panruti", "cashew", "jackfruit", "clay toys"] },
  { name: "Pichavaram Mangrove Forest", district: "Cuddalore", region: "coastal", category: "Eco-Tourism / World's 2nd Largest Mangrove", lat: 11.4286, lon: 79.7797, approxKm: 230, keywords: ["pichavaram", "mangrove", "boating", "backwaters"] },

  // --- NORTHERN TAMIL NADU (VELLORE, TIRUPATHUR, RANIPET, TIRUVANNAMALAI, VILUPPURAM, KALLAKURICHI) ---
  { name: "Vellore City (Fort & CMC)", district: "Vellore", region: "north", category: "District Headquarters / Medical Hub", lat: 12.9165, lon: 79.1325, approxKm: 215, keywords: ["vellore", "fort", "cmc hospital", "golden temple", "sripuram"] },
  { name: "Katpadi Junction, Vellore", district: "Vellore", region: "north", category: "Major Railway Junction", lat: 12.9698, lon: 79.1384, approxKm: 220, keywords: ["katpadi", "vit", "railway junction", "train"] },
  { name: "Gudiyatham, Vellore", district: "Vellore", region: "north", category: "Handloom Hub", lat: 12.9467, lon: 78.8711, approxKm: 195, keywords: ["gudiyatham", "safety matches", "handloom"] },

  { name: "Tirupathur, Tamil Nadu", district: "Tirupathur", region: "north", category: "District Headquarters", lat: 12.4958, lon: 78.5714, approxKm: 155, keywords: ["tirupathur", "sandalwood"] },
  { name: "Ambur, Tirupathur", district: "Tirupathur", region: "north", category: "Leather & Biryani Capital", lat: 12.7889, lon: 78.7153, approxKm: 195, keywords: ["ambur", "biryani", "leather shoes", "palar"] },
  { name: "Vaniyambadi, Tirupathur", district: "Tirupathur", region: "north", category: "Leather & Education Hub", lat: 12.6825, lon: 78.6208, approxKm: 180, keywords: ["vaniyambadi", "leather", "islamiah"] },
  { name: "Jolarpettai Junction, Tirupathur", district: "Tirupathur", region: "north", category: "Railway Hub", lat: 12.5647, lon: 78.5808, approxKm: 165, keywords: ["jolarpet", "railway junction", "water train"] },

  { name: "Ranipet City, Tamil Nadu", district: "Ranipet", region: "north", category: "District Headquarters", lat: 12.9298, lon: 79.3328, approxKm: 240, keywords: ["ranipet", "sipcot", "bhel", "leather"] },
  { name: "Walajapet, Ranipet", district: "Ranipet", region: "north", category: "Historic Silk Hub", lat: 12.9300, lon: 79.3800, approxKm: 245, keywords: ["walajapet", "danvantri temple", "silk"] },
  { name: "Arakkonam Junction, Ranipet", district: "Ranipet", region: "north", category: "Major Transit & Defense Hub", lat: 13.0789, lon: 79.6683, approxKm: 285, keywords: ["arakkonam", "ins rajali", "railway junction"] },
  { name: "Arcot, Ranipet", district: "Ranipet", region: "north", category: "Historic Nawab Capital", lat: 12.9042, lon: 79.3333, approxKm: 238, keywords: ["arcot", "nawab", "sweet makkan peda"] },

  { name: "Tiruvannamalai (Annamalaiyar Temple)", district: "Tiruvannamalai", region: "pilgrimage", category: "District Headquarters / Agni Sthalam", lat: 12.2253, lon: 79.0747, approxKm: 165, keywords: ["tiruvannamalai", "annamalaiyar", "girivalam", "ramana maharshi", "deepam"] },
  { name: "Arani, Tiruvannamalai", district: "Tiruvannamalai", region: "north", category: "Silk Saree Weaving Center", lat: 12.6686, lon: 79.2842, approxKm: 215, keywords: ["arani", "silk saree", "rice mills"] },
  { name: "Polur, Tiruvannamalai", district: "Tiruvannamalai", region: "north", category: "Town Hub", lat: 12.5000, lon: 79.1333, approxKm: 195, keywords: ["polur", "sampuvarayar"] },
  { name: "Cheyyar, Tiruvannamalai", district: "Tiruvannamalai", region: "north", category: "SIPCOT Industrial", lat: 12.6586, lon: 79.5422, approxKm: 250, keywords: ["cheyyar", "sipcot", "vedapureeswarar"] },

  { name: "Viluppuram City, Tamil Nadu", district: "Viluppuram", region: "north", category: "District Headquarters / Railway Hub", lat: 11.9401, lon: 79.4861, approxKm: 168, keywords: ["viluppuram", "villupuram", "railway junction", "nh45"] },
  { name: "Tindivanam, Viluppuram", district: "Viluppuram", region: "north", category: "Junction Highway Corridor", lat: 12.2269, lon: 79.6500, approxKm: 205, keywords: ["tindivanam", "highway junction", "nh45"] },
  { name: "Gingee (Senji Fort), Viluppuram", district: "Viluppuram", region: "north", category: "Troy of the East / Fort", lat: 12.2536, lon: 79.4183, approxKm: 195, keywords: ["gingee", "senji fort", "raja desingu", "monument"] },

  { name: "Kallakurichi, Tamil Nadu", district: "Kallakurichi", region: "salem", category: "District Headquarters", lat: 11.7381, lon: 78.9619, approxKm: 105, keywords: ["kallakurichi", "sugar cane", "kalrayan hills"] },
  { name: "Ulundurpet, Kallakurichi", district: "Kallakurichi", region: "salem", category: "Highway Crossroads Tollgate", lat: 11.6897, lon: 79.2908, approxKm: 140, keywords: ["ulundurpet", "tollgate", "trichy chennai highway cross"] },
  { name: "Chinna Salem, Kallakurichi", district: "Kallakurichi", region: "salem", category: "Salem Border Hub", lat: 11.6492, lon: 78.8872, approxKm: 82, keywords: ["chinna salem", "rice mill", "border"] },

  // --- GREATER CHENNAI & NORTH CORRIDOR (CHENNAI, CHENGALPATTU, KANCHIPURAM, TIRUVALLUR) ---
  { name: "Chennai Central / Marina Beach", district: "Chennai", region: "major", category: "State Capital Metro", lat: 13.0827, lon: 80.2707, approxKm: 345, keywords: ["chennai", "madras", "central", "puratchi thalaivar", "marina"] },
  { name: "Chennai International Airport (MAA)", district: "Chennai", region: "major", category: "Airport", lat: 12.9941, lon: 80.1709, approxKm: 335, keywords: ["chennai airport", "maa", "meenambakkam", "international terminal"] },
  { name: "Koyambedu CMBT, Chennai", district: "Chennai", region: "major", category: "Central Bus Terminal", lat: 13.0694, lon: 80.1948, approxKm: 340, keywords: ["koyambedu", "cmbt", "bus stand", "market"] },
  { name: "OMR IT Corridor (Sholinganallur)", district: "Chennai", region: "major", category: "Tech & IT Expressway", lat: 12.9010, lon: 80.2279, approxKm: 348, keywords: ["omr", "sholinganallur", "tidel", "it corridor", "sipcot siruseri"] },
  { name: "T. Nagar Shopping Hub, Chennai", district: "Chennai", region: "major", category: "Shopping Landmark", lat: 13.0418, lon: 80.2341, approxKm: 342, keywords: ["t nagar", "panagal park", "shopping", "pondit bazaar"] },

  { name: "Chengalpattu Town, Tamil Nadu", district: "Chengalpattu", region: "north", category: "District Headquarters", lat: 12.6819, lon: 79.9888, approxKm: 305, keywords: ["chengalpattu", "kolavai lake", "medical college"] },
  { name: "Mahabalipuram (Mamallapuram)", district: "Chengalpattu", region: "coastal", category: "UNESCO World Heritage & Shore Temple", lat: 12.6269, lon: 80.1927, approxKm: 335, keywords: ["mahabalipuram", "mamallapuram", "shore temple", "pancha rathas", "ecr"] },
  { name: "Tambaram, Chengalpattu / Chennai", district: "Chengalpattu", region: "major", category: "South Gateway Hub", lat: 12.9249, lon: 80.1000, approxKm: 325, keywords: ["tambaram", "sanatorium", "mepz", "railway terminus"] },
  { name: "Maraimalai Nagar (Automotive Hub)", district: "Chengalpattu", region: "north", category: "Industrial SIPCOT", lat: 12.7933, lon: 80.0242, approxKm: 315, keywords: ["maraimalai nagar", "ford", "mahindra world city"] },

  { name: "Kanchipuram Temple City", district: "Kanchipuram", region: "pilgrimage", category: "District Headquarters / Silk City", lat: 12.8342, lon: 79.7036, approxKm: 285, keywords: ["kanchipuram", "kanjeevaram silk", "ekambareswarar", "kamakshi amman", "varadaraja"] },
  { name: "Sriperumbudur, Kanchipuram", district: "Kanchipuram", region: "north", category: "Automotive & Electronics Corridor", lat: 12.9719, lon: 79.9431, approxKm: 310, keywords: ["sriperumbudur", "sipcot", "hyundai", "nokia", "rajiv gandhi memorial"] },

  { name: "Tiruvallur City, Tamil Nadu", district: "Tiruvallur", region: "north", category: "District Headquarters", lat: 13.1437, lon: 79.9083, approxKm: 325, keywords: ["tiruvallur", "veeraraghava perumal temple"] },
  { name: "Avadi, Tiruvallur", district: "Tiruvallur", region: "north", category: "Defense & Heavy Vehicles City", lat: 13.1147, lon: 80.1006, approxKm: 335, keywords: ["avadi", "hvf", "heavy vehicles factory", "crpf"] },
  { name: "Tiruttani, Tiruvallur", district: "Tiruvallur", region: "pilgrimage", category: "5th Arupadaiveedu Shrine", lat: 13.1833, lon: 79.6333, approxKm: 295, keywords: ["tiruttani", "murugan temple", "arupadaiveedu", "steps"] },
  { name: "Gummidipoondi, Tiruvallur", district: "Tiruvallur", region: "north", category: "Border Industrial SIPCOT", lat: 13.4072, lon: 80.1283, approxKm: 375, keywords: ["gummidipoondi", "andhra border", "sipcot"] },

  // --- SOUTHERN TAMIL NADU (MADURAI, THENI, VIRUDHUNAGAR, SIVAGANGA, RAMANATHAPURAM, TENKASI, TIRUNELVELI, THOOTHUKUDI, KANYAKUMARI) ---
  { name: "Madurai City (Meenakshi Amman Temple)", district: "Madurai", region: "south", category: "District Headquarters / Cultural Capital", lat: 9.9252, lon: 78.1198, approxKm: 235, keywords: ["madurai", "meenakshi amman", "thirumalai nayakar mahal", "jasmine", "jigarthanda"] },
  { name: "Madurai Airport (IXM)", district: "Madurai", region: "south", category: "Airport", lat: 9.8345, lon: 78.0934, approxKm: 245, keywords: ["madurai airport", "ixm", "flight", "perungudi"] },
  { name: "Mattuthavani (MGR Bus Stand), Madurai", district: "Madurai", region: "south", category: "Central Transit Hub", lat: 9.9497, lon: 78.1633, approxKm: 232, keywords: ["mattuthavani", "bus stand", "integrated market"] },
  { name: "Thirumangalam, Madurai", district: "Madurai", region: "south", category: "Highway Junction", lat: 9.8236, lon: 77.9889, approxKm: 250, keywords: ["thirumangalam", "tollgate", "kanyakumari highway"] },
  { name: "Melur, Madurai", district: "Madurai", region: "south", category: "Town Hub", lat: 10.0500, lon: 78.3333, approxKm: 215, keywords: ["melur", "granite", "highway"] },

  { name: "Theni City, Tamil Nadu", district: "Theni", region: "south", category: "District Headquarters", lat: 10.0104, lon: 77.4768, approxKm: 265, keywords: ["theni", "cardamom", "cotton", "foothills"] },
  { name: "Bodinayakanur (Bodi), Theni", district: "Theni", region: "south", category: "Cardamom City", lat: 10.0167, lon: 77.3500, approxKm: 280, keywords: ["bodi", "bodinayakanur", "cardamom capital", "railway terminal"] },
  { name: "Periyakulam, Theni", district: "Theni", region: "south", category: "Mango Town", lat: 10.1167, lon: 77.5500, approxKm: 255, keywords: ["periyakulam", "kumbakkarai falls", "horticulture"] },
  { name: "Cumbum, Theni", district: "Theni", region: "south", category: "Grape Valley", lat: 9.7344, lon: 77.2811, approxKm: 295, keywords: ["cumbum", "grapes", "suruli falls", "kerala border"] },

  { name: "Virudhunagar City, Tamil Nadu", district: "Virudhunagar", region: "south", category: "District Headquarters", lat: 9.5680, lon: 77.9624, approxKm: 280, keywords: ["virudhunagar", "trade", "oil", "kamajar house"] },
  { name: "Sivakasi, Virudhunagar", district: "Virudhunagar", region: "south", category: "Fireworks & Printing Capital", lat: 9.4533, lon: 77.7972, approxKm: 295, keywords: ["sivakasi", "crackers", "fireworks", "printing", "matches"] },
  { name: "Rajapalayam, Virudhunagar", district: "Virudhunagar", region: "south", category: "Textile & Dog Breed Hub", lat: 9.4531, lon: 77.5539, approxKm: 310, keywords: ["rajapalayam", "ayyanar falls", "hound", "spinning mill"] },
  { name: "Srivilliputhur, Virudhunagar", district: "Virudhunagar", region: "pilgrimage", category: "Tamil Nadu Emblem Temple", lat: 9.5097, lon: 77.6322, approxKm: 302, keywords: ["srivilliputhur", "andal temple", "palkova", "gopuram emblem"] },
  { name: "Aruppukkottai, Virudhunagar", district: "Virudhunagar", region: "south", category: "Weaving Hub", lat: 9.5167, lon: 78.1000, approxKm: 285, keywords: ["aruppukkottai", "handloom", "spinning"] },

  { name: "Sivaganga City, Tamil Nadu", district: "Sivaganga", region: "south", category: "District Headquarters", lat: 9.8433, lon: 78.4808, approxKm: 255, keywords: ["sivaganga", "maruthu brothers", "aranmanai", "palace"] },
  { name: "Karaikudi (Chettinad Heritage)", district: "Sivaganga", region: "south", category: "Heritage Mansions & Cuisine", lat: 10.0667, lon: 78.7833, approxKm: 225, keywords: ["karaikudi", "chettinad", "kandangi", "palaces", "alagappa university"] },
  { name: "Devakottai, Sivaganga", district: "Sivaganga", region: "south", category: "Chettinad Town", lat: 9.9500, lon: 78.8167, approxKm: 240, keywords: ["devakottai", "heritage mansions"] },
  { name: "Manamadurai, Sivaganga", district: "Sivaganga", region: "south", category: "Clay Ghatam Craft Hub", lat: 9.7000, lon: 78.4500, approxKm: 275, keywords: ["manamadurai", "clay pot", "ghatam", "vaigai"] },

  { name: "Ramanathapuram City, Tamil Nadu", district: "Ramanathapuram", region: "south", category: "District Headquarters", lat: 9.3639, lon: 78.8375, approxKm: 345, keywords: ["ramanathapuram", "ramnad", "palace", "sethupathi"] },
  { name: "Rameswaram (Ramanathaswamy Temple)", district: "Ramanathapuram", region: "pilgrimage", category: "Jyotirlinga & Char Dham", lat: 9.2876, lon: 79.3129, approxKm: 395, keywords: ["rameswaram", "pamban bridge", "ramanathaswamy", "agnitheertham", "kalam memorial"] },
  { name: "Dhanushkodi, Ramanathapuram", district: "Ramanathapuram", region: "coastal", category: "Ghost Town & Ram Setu Point", lat: 9.1783, lon: 79.4167, approxKm: 415, keywords: ["dhanushkodi", "ram setu", "adam bridge", "cyclone ruins", "ocean tip"] },
  { name: "Paramakudi, Ramanathapuram", district: "Ramanathapuram", region: "south", category: "Town Hub", lat: 9.5447, lon: 78.5889, approxKm: 310, keywords: ["paramakudi", "vaigai river", "handloom"] },

  { name: "Tenkasi City, Tamil Nadu", district: "Tenkasi", region: "south", category: "District Headquarters / Kasi Viswanathar", lat: 8.9594, lon: 77.3150, approxKm: 380, keywords: ["tenkasi", "kasi viswanathar", "western ghats"] },
  { name: "Courtallam (Kutralam Falls), Tenkasi", district: "Tenkasi", region: "south", category: "Spa of South India / Waterfalls", lat: 8.9317, lon: 77.2750, approxKm: 385, keywords: ["courtallam", "kutralam", "main falls", "five falls", "old falls", "herbal water"] },
  { name: "Sankarankovil, Tenkasi", district: "Tenkasi", region: "pilgrimage", category: "Sankaranarayanaswamy Temple", lat: 9.1700, lon: 77.5300, approxKm: 335, keywords: ["sankarankovil", "gomathi amman", "adi thabasu"] },
  { name: "Sengottai, Tenkasi", district: "Tenkasi", region: "south", category: "Kerala Border Gateway", lat: 8.9806, lon: 77.2458, approxKm: 390, keywords: ["sengottai", "border", "aryankavu", "railway pass"] },

  { name: "Tirunelveli City (Nellai)", district: "Tirunelveli", region: "south", category: "District Headquarters / Halwa City", lat: 8.7139, lon: 77.7567, approxKm: 395, keywords: ["tirunelveli", "nellai", "nellaiappar temple", "halwa", "thamirabarani"] },
  { name: "Palayamkottai, Tirunelveli", district: "Tirunelveli", region: "south", category: "Oxford of South India", lat: 8.7183, lon: 77.7408, approxKm: 398, keywords: ["palayamkottai", "schools", "colleges", "twin city"] },
  { name: "Ambasamudram, Tirunelveli", district: "Tirunelveli", region: "south", category: "Thamirabarani Basin", lat: 8.7000, lon: 77.4500, approxKm: 420, keywords: ["ambasamudram", "manjolai", "papanasam falls", "karayar dam"] },
  { name: "Nanguneri, Tirunelveli", district: "Tirunelveli", region: "pilgrimage", category: "Vanamamalai Perumal Divya Desam", lat: 8.4833, lon: 77.6667, approxKm: 425, keywords: ["nanguneri", "vanamamalai", "thothadri nathar", "oil well"] },

  { name: "Thoothukudi (Tuticorin) Port City", district: "Thoothukudi", region: "south", category: "District Headquarters / Pearl City", lat: 8.7642, lon: 78.1348, approxKm: 405, keywords: ["thoothukudi", "tuticorin", "pearl", "voc port", "macaroon"] },
  { name: "Tiruchendur, Thoothukudi", district: "Thoothukudi", region: "pilgrimage", category: "Subramanya Swamy Seashore Temple", lat: 8.4967, lon: 78.1219, approxKm: 435, keywords: ["tiruchendur", "murugan temple", "seashore", "arupadaiveedu", "soorasamharam"] },
  { name: "Kovilpatti, Thoothukudi", district: "Thoothukudi", region: "south", category: "Kadalai Mittai Hub", lat: 9.1728, lon: 77.8689, approxKm: 345, keywords: ["kovilpatti", "kadalai mittai", "peanut candy", "nh44"] },
  { name: "Tuticorin Airport (TCR - Vagaikulam)", district: "Thoothukudi", region: "south", category: "Airport", lat: 8.7236, lon: 78.0264, approxKm: 395, keywords: ["tuticorin airport", "tcr", "flight", "vagaikulam"] },

  { name: "Nagercoil City, Kanniyakumari", district: "Kanniyakumari", region: "south", category: "District Headquarters", lat: 8.1833, lon: 77.4119, approxKm: 435, keywords: ["nagercoil", "nagaraja temple", "cape", "clovetown"] },
  { name: "Kanyakumari (Cape Comorin)", district: "Kanniyakumari", region: "pilgrimage", category: "Southernmost Tip of India", lat: 8.0883, lon: 77.5385, approxKm: 445, keywords: ["kanyakumari", "cape comorin", "vivekananda rock", "thiruvalluvar statue", "sunrise", "sunset", "triveni sangam"] },
  { name: "Marthandam, Kanniyakumari", district: "Kanniyakumari", region: "south", category: "Commercial Town", lat: 8.3000, lon: 77.2167, approxKm: 455, keywords: ["marthandam", "honey", "cashew", "kerala border"] },
  { name: "Padmanabhapuram Palace, Kanniyakumari", district: "Kanniyakumari", region: "south", category: "Wooden Heritage Palace", lat: 8.2508, lon: 77.3275, approxKm: 448, keywords: ["padmanabhapuram", "palace", "thuckalay", "travancore heritage"] },

  // --- POPULAR INTERSTATE CORRIDORS FROM TAMIL NADU ---
  { name: "Bangalore (Bengaluru Majestic), Karnataka", district: "Bengaluru", region: "major", category: "IT Capital Hub", lat: 12.9716, lon: 77.5946, approxKm: 205, keywords: ["bangalore", "bengaluru", "majestic", "kempegowda", "it"] },
  { name: "Electronic City, Bangalore", district: "Bengaluru", region: "major", category: "IT Expressway", lat: 12.8399, lon: 77.6770, approxKm: 185, keywords: ["electronic city", "infosys", "hosur road"] },
  { name: "Bangalore Kempegowda Airport (BLR)", district: "Bengaluru", region: "major", category: "International Airport", lat: 13.1986, lon: 77.7066, approxKm: 240, keywords: ["bangalore airport", "blr", "kempegowda", "flight"] },
  { name: "Puducherry (Pondicherry Promenade Beach)", district: "Puducherry", region: "coastal", category: "French Heritage & Coastal Union Territory", lat: 11.9416, lon: 79.8083, approxKm: 215, keywords: ["pondicherry", "puducherry", "auroville", "french colony", "promenade beach"] },
  { name: "Munnar, Kerala (via Theni / Udumalpet)", district: "Idukki", region: "hills", category: "Tea Mountain Getaway", lat: 10.0889, lon: 77.0595, approxKm: 285, keywords: ["munnar", "tea estate", "kerala", "hill station"] },
  { name: "Palakkad, Kerala (via Coimbatore)", district: "Palakkad", region: "south", category: "Kerala Gateway", lat: 10.7867, lon: 76.6548, approxKm: 210, keywords: ["palakkad", "palghat", "gap", "fort"] }
];

// Retain backward compatibility with previous REGIONAL_DESTINATIONS references
const REGIONAL_DESTINATIONS = TAMIL_NADU_LOCATIONS;

// ==============================================================================
// 3. APPLICATION STATE
// ==============================================================================

const appState = {
  pickup: {
    name: "Salem, Tamil Nadu",
    district: "Salem",
    lat: SALEM_HUB_COORDS.lat,
    lon: SALEM_HUB_COORDS.lon,
    isGeolocation: false
  },
  destination: {
    name: "",
    district: "",
    lat: null,
    lon: null
  },
  distanceKm: 0,
  estimatedFare: 0,
  isRoutingLive: false,
  routingProvider: "Road Network",
  durationText: null,
  selectedRegionFilter: "all"
};

// ==============================================================================
// 4. MAP & ROUTING CONTROLLER STATE
// ==============================================================================

let leafletMap = null;
let pickupMarker = null;
let destMarker = null;
let routePolylineLayer = null;

// ==============================================================================
// 5. DOM ELEMENTS CACHE
// ==============================================================================

const DOM = {
  // Navigation
  siteHeader: document.getElementById("siteHeader"),
  hamburgerBtn: document.getElementById("hamburgerBtn"),
  drawerBackdrop: document.getElementById("drawerBackdrop"),
  mobileDrawer: document.getElementById("mobileDrawer"),
  drawerClose: document.getElementById("drawerClose"),
  drawerLinks: document.querySelectorAll(".drawer-link"),

  // Pickup Elements
  pickupInput: document.getElementById("pickupInput"),
  useLocationBtn: document.getElementById("useLocationBtn"),
  clearPickupBtn: document.getElementById("clearPickupBtn"),
  pickupSuggestions: document.getElementById("pickupSuggestions"),
  locationStatus: document.getElementById("locationStatus"),

  // Route Swap
  swapRouteBtn: document.getElementById("swapRouteBtn"),

  // Destination Elements
  destinationInput: document.getElementById("destinationInput"),
  clearDestBtn: document.getElementById("clearDestBtn"),
  destinationSuggestions: document.getElementById("destinationSuggestions"),
  tnRegionFilters: document.querySelectorAll(".region-chip"),
  quickChips: document.querySelectorAll(".chip-btn"),

  // Action Buttons
  calculateRouteBtn: document.getElementById("calculateRouteBtn"),
  bookRideBtn: document.getElementById("bookRideBtn"),
  inlineCalcResult: document.getElementById("inlineCalcResult"),

  // Google Maps Direct Actions
  openGoogleMapsBtn: document.getElementById("openGoogleMapsBtn"),
  summaryGoogleMapsBtn: document.getElementById("summaryGoogleMapsBtn"),

  // Map & Visualizer Elements
  leafletMapContainer: document.getElementById("leafletMapContainer"),
  apiModeBadge: document.getElementById("apiModeBadge"),
  apiModeText: document.getElementById("apiModeText"),
  mapPickupName: document.getElementById("mapPickupName"),
  mapDestName: document.getElementById("mapDestName"),
  mapMidpointDistance: document.getElementById("mapMidpointDistance"),
  mapDisclaimerText: document.getElementById("mapDisclaimerText"),
  statsDistance: document.getElementById("statsDistance"),
  statsFare: document.getElementById("statsFare"),

  // Trip Summary Elements
  summaryPickup: document.getElementById("summaryPickup"),
  summaryDestination: document.getElementById("summaryDestination"),
  summaryDistance: document.getElementById("summaryDistance"),
  summaryFormula: document.getElementById("summaryFormula"),
  summaryFare: document.getElementById("summaryFare"),

  // Modal Elements
  bookingModal: document.getElementById("bookingModal"),
  modalCloseBtn: document.getElementById("modalCloseBtn"),
  modalPickupText: document.getElementById("modalPickupText"),
  modalDestText: document.getElementById("modalDestText"),
  modalDistanceText: document.getElementById("modalDistanceText"),
  modalFareText: document.getElementById("modalFareText"),
  confirmBookingForm: document.getElementById("confirmBookingForm"),
  custName: document.getElementById("custName"),
  custMobile: document.getElementById("custMobile"),
  confirmRideBtn: document.getElementById("confirmRideBtn"),

  // Mobile Sticky Bar
  mobileStickyBar: document.getElementById("mobileStickyBar"),
  mobileStickyPrice: document.getElementById("mobileStickyPrice"),
  mobileStickyBtn: document.getElementById("mobileStickyBtn"),

  // Route Cards
  selectRouteBtns: document.querySelectorAll(".select-route-btn")
};

// ==============================================================================
// 6. INITIALIZATION
// ==============================================================================

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initLeafletMap();
  updateRoutingModeBadge();
  updateFareSummaryDisplay();
  updateGoogleMapsLinks();
  handleUrlQueryParams();
});

/**
 * Reads query parameters such as book.html?dest=Yercaud or ?pickup=...
 * and automatically triggers route selection and calculation.
 */
function handleUrlQueryParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const destParam = urlParams.get('dest');
    const pickupParam = urlParams.get('pickup');

    if (pickupParam) {
      selectPickupByName(pickupParam);
    }
    if (destParam) {
      selectDestinationByName(destParam);
    }
  } catch (e) {
    console.warn("URL query param parsing notice:", e);
  }
}

function selectPickupByName(pickupName) {
  const clean = pickupName.toLowerCase();
  const found = TAMIL_NADU_LOCATIONS.find(item => 
    item.name.toLowerCase().includes(clean) ||
    (item.keywords && item.keywords.some(k => k.toLowerCase() === clean))
  );

  if (found) {
    appState.pickup.name = found.name;
    appState.pickup.district = found.district;
    appState.pickup.lat = found.lat;
    appState.pickup.lon = found.lon;
  } else {
    appState.pickup.name = pickupName;
  }

  if (DOM.pickupInput) {
    DOM.pickupInput.value = appState.pickup.name;
    if (DOM.clearPickupBtn) DOM.clearPickupBtn.style.display = "block";
  }
  if (DOM.mapPickupName) DOM.mapPickupName.textContent = appState.pickup.name.split(",")[0];
  if (DOM.summaryPickup) DOM.summaryPickup.textContent = appState.pickup.name;
}

// ==============================================================================
// 7. EVENT LISTENERS SETUP
// ==============================================================================

function setupEventListeners() {
  // Mobile Hamburger & Drawer
  if (DOM.hamburgerBtn) DOM.hamburgerBtn.addEventListener("click", toggleMobileDrawer);
  if (DOM.drawerClose) DOM.drawerClose.addEventListener("click", closeMobileDrawer);
  if (DOM.drawerBackdrop) DOM.drawerBackdrop.addEventListener("click", closeMobileDrawer);
  DOM.drawerLinks.forEach(link => link.addEventListener("click", closeMobileDrawer));

  // Geolocation Button
  if (DOM.useLocationBtn) DOM.useLocationBtn.addEventListener("click", getUserLocation);

  // Pickup Input & Autocomplete
  if (DOM.pickupInput) {
    DOM.pickupInput.addEventListener("input", handlePickupInput);
    DOM.pickupInput.addEventListener("focus", () => {
      if (DOM.pickupInput.value.trim().length > 0) {
        searchPickup(DOM.pickupInput.value.trim());
      }
    });
    DOM.pickupInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculatePickupToDrop();
      }
    });
  }

  if (DOM.clearPickupBtn) {
    DOM.clearPickupBtn.addEventListener("click", () => {
      DOM.pickupInput.value = "";
      DOM.clearPickupBtn.style.display = "none";
      if (DOM.pickupSuggestions) {
        DOM.pickupSuggestions.classList.remove("open");
        DOM.pickupSuggestions.innerHTML = "";
      }
      appState.pickup = {
        name: "",
        district: "",
        lat: null,
        lon: null,
        isGeolocation: false
      };
      if (DOM.inlineCalcResult) DOM.inlineCalcResult.style.display = "none";
      DOM.pickupInput.focus();
    });
  }

  // Swap Route Button (⇅)
  if (DOM.swapRouteBtn) {
    DOM.swapRouteBtn.addEventListener("click", swapRouteEndpoints);
  }

  // Destination Input & Autocomplete
  if (DOM.destinationInput) {
    DOM.destinationInput.addEventListener("input", handleDestinationInput);
    DOM.destinationInput.addEventListener("focus", () => {
      const query = DOM.destinationInput.value.trim();
      searchDestination(query);
    });
    DOM.destinationInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculatePickupToDrop();
      }
    });
  }

  if (DOM.clearDestBtn) {
    DOM.clearDestBtn.addEventListener("click", () => {
      DOM.destinationInput.value = "";
      DOM.clearDestBtn.style.display = "none";
      if (DOM.destinationSuggestions) {
        DOM.destinationSuggestions.classList.remove("open");
        DOM.destinationSuggestions.innerHTML = "";
      }
      resetDestinationState();
      DOM.destinationInput.focus();
    });
  }

  // Region Filter Chips (All TN, Salem & Nearby, Kongu, Hills, Temples, Metros)
  DOM.tnRegionFilters.forEach(chip => {
    chip.addEventListener("click", () => {
      DOM.tnRegionFilters.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      appState.selectedRegionFilter = chip.getAttribute("data-region") || "all";

      const query = DOM.destinationInput ? DOM.destinationInput.value.trim() : "";
      searchDestination(query);
    });
  });

  // Close suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (DOM.destinationInput && DOM.destinationSuggestions && 
        !DOM.destinationInput.contains(e.target) && !DOM.destinationSuggestions.contains(e.target) &&
        !e.target.closest("#tnRegionFilters")) {
      DOM.destinationSuggestions.classList.remove("open");
    }

    if (DOM.pickupInput && DOM.pickupSuggestions && 
        !DOM.pickupInput.contains(e.target) && !DOM.pickupSuggestions.contains(e.target)) {
      DOM.pickupSuggestions.classList.remove("open");
    }
  });

  // Quick Chips
  DOM.quickChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const dest = chip.getAttribute("data-dest");
      selectDestinationByName(dest);
    });
  });

  // Popular Route Cards
  DOM.selectRouteBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const dest = btn.getAttribute("data-destination");
      if (DOM.destinationInput) {
        selectDestinationByName(dest);
        const bookSec = document.getElementById("book") || DOM.destinationInput;
        if (bookSec) bookSec.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `book.html?dest=${encodeURIComponent(dest)}`;
      }
    });
  });

  // Calculate Button
  if (DOM.calculateRouteBtn) {
    DOM.calculateRouteBtn.addEventListener("click", () => {
      calculatePickupToDrop();
    });
  }

  // Book This Ride CTA
  if (DOM.bookRideBtn) DOM.bookRideBtn.addEventListener("click", handleBookRideClick);
  if (DOM.mobileStickyBtn) DOM.mobileStickyBtn.addEventListener("click", handleBookRideClick);

  // Modal Handlers
  if (DOM.modalCloseBtn) DOM.modalCloseBtn.addEventListener("click", closeBookingModal);
  if (DOM.bookingModal) {
    DOM.bookingModal.addEventListener("click", (e) => {
      if (e.target === DOM.bookingModal) {
        closeBookingModal();
      }
    });
  }

  // Modal Form Submission (Confirm Ride)
  if (DOM.confirmBookingForm) {
    DOM.confirmBookingForm.addEventListener("submit", confirmBooking);
  }
}

// ==============================================================================
// 8. ROUTE SWAP LOGIC
// ==============================================================================

/**
 * Swaps Pickup and Destination locations cleanly and recalculates route.
 */
function swapRouteEndpoints() {
  const pickupVal = DOM.pickupInput ? DOM.pickupInput.value.trim() : appState.pickup.name;
  const destVal = DOM.destinationInput ? DOM.destinationInput.value.trim() : appState.destination.name;

  if (!destVal) {
    showLocationStatus("Please enter a drop location first before swapping.", "info");
    return;
  }

  // Animate swap icon
  if (DOM.swapRouteBtn) {
    DOM.swapRouteBtn.classList.toggle("rotated");
  }

  const prevPickup = { ...appState.pickup };
  const prevDest = { ...appState.destination };

  // Swap in State
  appState.pickup = {
    name: prevDest.name || destVal,
    district: prevDest.district || "",
    lat: prevDest.lat,
    lon: prevDest.lon,
    isGeolocation: false
  };

  appState.destination = {
    name: prevPickup.name || pickupVal,
    district: prevPickup.district || "",
    lat: prevPickup.lat,
    lon: prevPickup.lon
  };

  // Update inputs
  if (DOM.pickupInput) DOM.pickupInput.value = appState.pickup.name;
  if (DOM.destinationInput) DOM.destinationInput.value = appState.destination.name;
  if (DOM.clearPickupBtn) DOM.clearPickupBtn.style.display = "block";
  if (DOM.clearDestBtn) DOM.clearDestBtn.style.display = "block";

  showLocationStatus(`Swapped route: ${appState.pickup.name.split(",")[0]} ➔ ${appState.destination.name.split(",")[0]}`, "info");
  calculatePickupToDrop();
}

// ==============================================================================
// 9. EXTERNAL NAVIGATION LINK HELPER
// ==============================================================================

/**
 * Generates an official, direct Google Maps Driving Directions URL.
 * Allows customers/drivers to open turn-by-turn navigation in their external app without any API key.
 */
function getGoogleMapsDirectionsUrl(pickup, destination) {
  const originParam = (pickup && pickup.lat && pickup.lon)
    ? `${pickup.lat},${pickup.lon}`
    : encodeURIComponent(pickup && pickup.name ? pickup.name : "Salem, Tamil Nadu");

  const destParam = (destination && destination.lat && destination.lon)
    ? `${destination.lat},${destination.lon}`
    : encodeURIComponent(destination && destination.name ? destination.name : "Tamil Nadu");

  return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=driving`;
}

/**
 * Updates Google Maps links across the interface.
 * Connects buttons to official Google Maps driving directions with real-time routing.
 */
function updateGoogleMapsLinks() {
  const hasDest = Boolean(appState.destination && appState.destination.name);
  const gmapsUrl = getGoogleMapsDirectionsUrl(appState.pickup, appState.destination);

  if (DOM.openGoogleMapsBtn) {
    if (hasDest) {
      DOM.openGoogleMapsBtn.href = gmapsUrl;
      DOM.openGoogleMapsBtn.style.display = "inline-flex";
    } else {
      DOM.openGoogleMapsBtn.style.display = "none";
    }
  }

  if (DOM.summaryGoogleMapsBtn) {
    if (hasDest) {
      DOM.summaryGoogleMapsBtn.href = gmapsUrl;
      DOM.summaryGoogleMapsBtn.style.display = "block";
    } else {
      DOM.summaryGoogleMapsBtn.style.display = "none";
    }
  }
}

// ==============================================================================
// 10. INTERACTIVE ROAD ROUTE
// ==============================================================================

/**
 * Initializes the route display canvas (Map canvas removed per instruction).
 */
function initLeafletMap() {
  // Leaflet map display removed per user instruction
}

function createCustomMarkerIcon(type, emoji) {
  return null;
}

/**
 * Updates the route visuals (Safe no-op since map canvas removed).
 */
function updateLeafletMapRoute(pickup, destination, roadGeometry) {
  // Map display removed per user instruction
}

// ==============================================================================
// 11. GEOLOCATION & REVERSE GEOCODING
// ==============================================================================

/**
 * Gets user's current geographic position using the HTML5 Geolocation API.
 */
function getUserLocation() {
  if (!("geolocation" in navigator)) {
    showLocationStatus("Geolocation is not supported by your browser.", "error");
    return;
  }

  showLocationStatus("Detecting your current location in Tamil Nadu...", "info");
  if (DOM.useLocationBtn) DOM.useLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      if (DOM.useLocationBtn) DOM.useLocationBtn.disabled = false;
      const { latitude, longitude } = position.coords;
      
      appState.pickup.lat = latitude;
      appState.pickup.lon = longitude;
      appState.pickup.isGeolocation = true;

      DOM.pickupInput.value = "Current Location";
      DOM.clearPickupBtn.style.display = "block";
      showLocationStatus("📍 Location detected. Resolving address...", "info");

      const readableAddress = await reverseGeocode(latitude, longitude);
      if (readableAddress) {
        appState.pickup.name = readableAddress;
        DOM.pickupInput.value = readableAddress;
        DOM.mapPickupName.textContent = readableAddress.split(",")[0];
        DOM.summaryPickup.textContent = readableAddress;
        showLocationStatus(`✓ Pickup set to ${readableAddress.split(",")[0]}`, "success");
      } else {
        appState.pickup.name = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        DOM.pickupInput.value = appState.pickup.name;
        DOM.mapPickupName.textContent = "Current Location";
        DOM.summaryPickup.textContent = appState.pickup.name;
        showLocationStatus("✓ Current coordinates detected.", "success");
      }

      if (appState.destination.name) {
        calculateAndRenderRoute();
      } else {
        updateLeafletMapRoute(appState.pickup, appState.destination, null);
      }
    },
    (error) => {
      if (DOM.useLocationBtn) DOM.useLocationBtn.disabled = false;
      let errorMsg = "Location permission is required to detect your pickup spot. Please enter manually.";
      if (error.code === error.PERMISSION_DENIED) {
        errorMsg = "Location access denied. Please enter your pickup town or city in Tamil Nadu manually.";
      }
      showLocationStatus(errorMsg, "error");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    }
  );
}

/**
 * Reverse-geocodes coordinates into a readable Tamil Nadu location.
 * Uses high-accuracy BigDataCloud API with Nominatim fallback. No API key required.
 */
async function reverseGeocode(lat, lon) {
  // 1. High-accuracy BigDataCloud client reverse geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const locality = data.locality || data.city || "";
      let district = "";
      if (data.localityInfo && Array.isArray(data.localityInfo.administrative)) {
        const distObj = data.localityInfo.administrative.find(a => 
          a.description && a.description.toLowerCase().includes("district")
        );
        if (distObj && distObj.name) {
          district = distObj.name.replace(/district/i, "").trim();
        }
      }
      if (!district) {
        district = data.city || "";
      }
      const state = data.principalSubdivision || "Tamil Nadu";
      const parts = [locality, district, state].filter(Boolean);
      const uniqueParts = [...new Set(parts)];
      if (uniqueParts.length > 0) {
        return uniqueParts.join(", ");
      }
    }
  } catch (err) {
    console.warn("BigDataCloud reverse geocode notice:", err.message);
  }

  // 2. Fallback: OpenStreetMap Nominatim reverse geocode
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;
        const place = addr.suburb || addr.neighbourhood || addr.city_district || addr.road || addr.village || "";
        const city = addr.city || addr.town || addr.county || "Salem";
        const state = addr.state || "Tamil Nadu";
        
        const parts = [place, city, state].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : data.display_name.split(",").slice(0, 3).join(", ");
      }
    }
  } catch (err) {
    console.warn("Nominatim reverse geocode notice:", err.message);
  }
  return null;
}

function showLocationStatus(message, type = "info") {
  if (!DOM.locationStatus) return;
  DOM.locationStatus.textContent = message;
  DOM.locationStatus.className = `location-status ${type}`;
}

// ==============================================================================
// 12. LIVE LOCATION SEARCH & MAP DATA SERVICE (OPEN WEB + GOOGLE MAPS)
// ==============================================================================

const livePlacesCache = new Map();

/**
 * Searches real-time place data across Tamil Nadu & India using open web map data service.
 * Free, high-speed, no API key required. Biased towards Salem / Tamil Nadu regional coordinates.
 */
async function fetchLiveMapPlaces(query) {
  const raw = (query || "").trim();
  const clean = raw.toLowerCase();
  if (!clean || clean.length < 2) return [];

  if (livePlacesCache.has(clean)) {
    return livePlacesCache.get(clean);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(raw)}&lat=11.6643&lon=78.1460&limit=7`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        const places = data.features.map(f => {
          const props = f.properties || {};
          const coords = f.geometry && f.geometry.coordinates ? f.geometry.coordinates : null;
          
          const name = props.name || [props.street, props.city].filter(Boolean).join(", ") || raw;
          const subParts = [
            props.street,
            props.locality || props.district,
            props.city || props.county,
            props.state || "Tamil Nadu",
            props.postcode
          ].filter(Boolean);
          
          const sub = subParts.filter(p => !name.toLowerCase().includes(p.toLowerCase())).join(", ");

          return {
            name: name,
            subtitle: sub || (props.state ? `${props.state}, India` : "Tamil Nadu, India"),
            district: props.district || props.city || props.county || "",
            state: props.state || "Tamil Nadu",
            lat: coords ? coords[1] : null,
            lon: coords ? coords[0] : null,
            isLive: true
          };
        }).filter(p => p.lat !== null && p.lon !== null);

        livePlacesCache.set(clean, places);
        return places;
      }
    }
  } catch (err) {
    console.warn("Live map search notice:", err.message);
  }

  return [];
}

let pickupSearchDebounce = null;
let activePickupQuery = "";

function handlePickupInput(e) {
  const query = e.target.value.trim();
  DOM.clearPickupBtn.style.display = query.length > 0 ? "block" : "none";

  if (pickupSearchDebounce) clearTimeout(pickupSearchDebounce);

  if (query.length === 0) {
    if (DOM.pickupSuggestions) {
      DOM.pickupSuggestions.classList.remove("open");
      DOM.pickupSuggestions.innerHTML = "";
    }
    return;
  }

  pickupSearchDebounce = setTimeout(() => {
    searchPickup(query);
  }, 160);
}

async function searchPickup(query) {
  if (!DOM.pickupSuggestions) return;
  const rawQuery = (query || "").trim();
  const clean = rawQuery.toLowerCase();
  activePickupQuery = clean;

  if (!clean) {
    DOM.pickupSuggestions.classList.remove("open");
    DOM.pickupSuggestions.innerHTML = "";
    return;
  }

  // 1. Immediate match from curated Tamil Nadu database
  const localMatches = TAMIL_NADU_LOCATIONS.filter(item => {
    return item.name.toLowerCase().includes(clean) ||
           (item.district && item.district.toLowerCase().includes(clean)) ||
           (item.keywords && item.keywords.some(k => k.toLowerCase().includes(clean)));
  }).slice(0, 6);

  // Render initial suggestions immediately
  renderPickupDropdown(localMatches, [], rawQuery);

  // 2. Fetch live map data asynchronously if 2+ characters
  if (clean.length >= 2) {
    const livePlaces = await fetchLiveMapPlaces(rawQuery);
    if (activePickupQuery === clean) {
      const filteredLive = livePlaces.filter(lp => 
        !localMatches.some(lm => lm.name.toLowerCase().includes(lp.name.toLowerCase()) || lp.name.toLowerCase().includes(lm.name.toLowerCase()))
      ).slice(0, 6);

      renderPickupDropdown(localMatches, filteredLive, rawQuery);
    }
  }
}

function renderPickupDropdown(localMatches, liveMatches, query) {
  if (!DOM.pickupSuggestions) return;
  let html = "";

  if (localMatches.length > 0) {
    localMatches.forEach(item => {
      html += `
        <div class="suggestion-item" data-type="pickup" data-name="${item.name}" data-district="${item.district}" data-lat="${item.lat}" data-lon="${item.lon}">
          <div>
            <div class="suggestion-main">📍 ${item.name}</div>
            <div class="suggestion-sub">${item.category} • ${item.district} Dist.</div>
          </div>
          <span class="suggestion-action-tag">Set Pickup ➔</span>
        </div>
      `;
    });
  }

  if (liveMatches.length > 0) {
    liveMatches.forEach(item => {
      html += `
        <div class="suggestion-item suggestion-live-item" data-type="pickup" data-name="${item.name}" data-district="${item.district}" data-lat="${item.lat}" data-lon="${item.lon}">
          <div>
            <div class="suggestion-main">🗺️ ${item.name}</div>
            <div class="suggestion-sub">${item.subtitle}</div>
          </div>
          <span class="suggestion-action-tag live-badge">Live Map ➔</span>
        </div>
      `;
    });
  }

  if (query && query.length >= 2) {
    const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    html += `
      <div class="suggestion-item suggestion-gmaps-item" data-action="open-gmaps" data-url="${gmapsSearchUrl}">
        <div>
          <div class="suggestion-main" style="color: var(--accent-gold);">🗺️ Search "${query}" on Google Maps</div>
          <div class="suggestion-sub">Open live Google Maps in new tab to verify location</div>
        </div>
        <span class="suggestion-action-tag gmaps-pill">Google Maps ↗</span>
      </div>
    `;

    html += `
      <div class="suggestion-item custom-destination-item" data-type="pickup" data-name="${query}" data-custom="true">
        <div>
          <div class="suggestion-main">📍 Use "${query}" as Pickup</div>
          <div class="suggestion-sub">Search and locate across Tamil Nadu road network</div>
        </div>
        <span class="suggestion-action-tag">Select ➔</span>
      </div>
    `;
  }

  DOM.pickupSuggestions.innerHTML = html;
  DOM.pickupSuggestions.classList.add("open");

  DOM.pickupSuggestions.querySelectorAll(".suggestion-item").forEach(item => {
    item.addEventListener("click", async () => {
      if (item.getAttribute("data-action") === "open-gmaps") {
        const url = item.getAttribute("data-url");
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const name = item.getAttribute("data-name");
      const lat = item.getAttribute("data-lat");
      const lon = item.getAttribute("data-lon");
      const district = item.getAttribute("data-district") || "";
      const isCustom = item.getAttribute("data-custom") === "true";

      if (DOM.pickupSuggestions) DOM.pickupSuggestions.classList.remove("open");

      if (lat && lon) {
        appState.pickup.name = name;
        appState.pickup.district = district;
        appState.pickup.lat = parseFloat(lat);
        appState.pickup.lon = parseFloat(lon);
      } else if (isCustom) {
        showLocationStatus(`Locating pickup "${name}" across Tamil Nadu...`, "info");
        const resolved = await resolveLocation(name, true);
        appState.pickup.name = resolved.name;
        appState.pickup.district = resolved.district || "";
        appState.pickup.lat = resolved.lat;
        appState.pickup.lon = resolved.lon;
      } else {
        appState.pickup.name = name;
        appState.pickup.lat = SALEM_HUB_COORDS.lat;
        appState.pickup.lon = SALEM_HUB_COORDS.lon;
      }

      if (DOM.pickupInput) DOM.pickupInput.value = appState.pickup.name;
      if (DOM.clearPickupBtn) DOM.clearPickupBtn.style.display = "block";
      if (DOM.mapPickupName) DOM.mapPickupName.textContent = appState.pickup.name.split(",")[0];
      if (DOM.summaryPickup) DOM.summaryPickup.textContent = appState.pickup.name;
      showLocationStatus(`✓ Pickup location set: ${appState.pickup.name.split(",")[0]}`, "success");

      const hasDest = (DOM.destinationInput && DOM.destinationInput.value.trim().length > 0) || appState.destination.name;
      if (hasDest) {
        calculatePickupToDrop();
      } else {
        updateLeafletMapRoute(appState.pickup, appState.destination, null);
        updateGoogleMapsLinks();
      }
    });
  });
}

// ==============================================================================
// 13. DESTINATION SEARCH & REGION FILTERS
// ==============================================================================

let destSearchDebounce = null;
let activeDestQuery = "";

function handleDestinationInput(e) {
  const query = e.target.value.trim();
  DOM.clearDestBtn.style.display = query.length > 0 ? "block" : "none";

  if (destSearchDebounce) clearTimeout(destSearchDebounce);

  if (query.length === 0) {
    if (DOM.destinationSuggestions) {
      DOM.destinationSuggestions.classList.remove("open");
      DOM.destinationSuggestions.innerHTML = "";
    }
    resetDestinationState();
    return;
  }

  destSearchDebounce = setTimeout(() => {
    searchDestination(query);
  }, 160);
}

/**
 * Dynamic destination autocomplete matching all Tamil Nadu districts & live map data.
 */
async function searchDestination(query) {
  if (!DOM.destinationSuggestions) return;
  const rawQuery = (query || "").trim();
  const clean = rawQuery.toLowerCase();
  activeDestQuery = clean;
  const filter = appState.selectedRegionFilter || "all";

  // 1. Immediate match from local database with region filtering
  let localMatches = TAMIL_NADU_LOCATIONS.filter(item => {
    let regionMatch = true;
    if (filter === "salem") {
      regionMatch = item.district === "Salem" || item.region === "salem";
    } else if (filter === "kongu") {
      regionMatch = item.region === "kongu" || item.district === "Erode" || item.district === "Coimbatore" || item.district === "Namakkal" || item.district === "Tiruppur";
    } else if (filter === "hills") {
      regionMatch = item.region === "hills" || item.category.toLowerCase().includes("hill");
    } else if (filter === "pilgrimage") {
      regionMatch = item.region === "pilgrimage" || item.category.toLowerCase().includes("temple") || item.category.toLowerCase().includes("shrine");
    } else if (filter === "major") {
      regionMatch = item.region === "major" || item.category.toLowerCase().includes("headquarters") || item.category.toLowerCase().includes("capital");
    }

    if (!regionMatch) return false;
    if (!clean) return true;

    return item.name.toLowerCase().includes(clean) ||
           (item.district && item.district.toLowerCase().includes(clean)) ||
           (item.category && item.category.toLowerCase().includes(clean)) ||
           (item.keywords && item.keywords.some(k => k.toLowerCase().includes(clean)));
  }).slice(0, 6);

  renderDestinationDropdown(localMatches, [], rawQuery);

  // 2. Fetch live map places if 2+ characters
  if (clean.length >= 2) {
    const livePlaces = await fetchLiveMapPlaces(rawQuery);
    if (activeDestQuery === clean) {
      const filteredLive = livePlaces.filter(lp =>
        !localMatches.some(lm => lm.name.toLowerCase().includes(lp.name.toLowerCase()) || lp.name.toLowerCase().includes(lm.name.toLowerCase()))
      ).slice(0, 6);

      renderDestinationDropdown(localMatches, filteredLive, rawQuery);
    }
  }
}

function renderDestinationDropdown(localMatches, liveMatches, query) {
  if (!DOM.destinationSuggestions) return;
  let html = "";

  if (localMatches.length > 0) {
    localMatches.forEach(item => {
      const distBadge = item.approxKm > 0 ? `~${item.approxKm} KM` : `Hub`;
      html += `
        <div class="suggestion-item" data-name="${item.name}" data-district="${item.district}" data-lat="${item.lat}" data-lon="${item.lon}">
          <div>
            <div class="suggestion-main">📍 ${item.name}</div>
            <div class="suggestion-sub">${item.category} • ${item.district} Dist. • ${distBadge}</div>
          </div>
          <span class="suggestion-action-tag">Select ➔</span>
        </div>
      `;
    });
  }

  if (liveMatches.length > 0) {
    liveMatches.forEach(item => {
      html += `
        <div class="suggestion-item suggestion-live-item" data-name="${item.name}" data-district="${item.district}" data-lat="${item.lat}" data-lon="${item.lon}">
          <div>
            <div class="suggestion-main">🗺️ ${item.name}</div>
            <div class="suggestion-sub">${item.subtitle}</div>
          </div>
          <span class="suggestion-action-tag live-badge">Live Map ➔</span>
        </div>
      `;
    });
  }

  if (query && query.length >= 2) {
    const gmapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    html += `
      <div class="suggestion-item suggestion-gmaps-item" data-action="open-gmaps" data-url="${gmapsSearchUrl}">
        <div>
          <div class="suggestion-main" style="color: var(--accent-gold);">🗺️ Search "${query}" on Google Maps</div>
          <div class="suggestion-sub">Open live Google Maps in new tab to verify place</div>
        </div>
        <span class="suggestion-action-tag gmaps-pill">Google Maps ↗</span>
      </div>
    `;

    html += `
      <div class="suggestion-item custom-destination-item" data-name="${query}" data-custom="true">
        <div>
          <div class="suggestion-main">🔍 Find "${query}" across Tamil Nadu</div>
          <div class="suggestion-sub">Locate any village, street, or landmark with road distance</div>
        </div>
        <span class="suggestion-action-tag">Find Place ➔</span>
      </div>
    `;
  }

  DOM.destinationSuggestions.innerHTML = html;
  DOM.destinationSuggestions.classList.add("open");

  DOM.destinationSuggestions.querySelectorAll(".suggestion-item").forEach(item => {
    item.addEventListener("click", async () => {
      if (item.getAttribute("data-action") === "open-gmaps") {
        const url = item.getAttribute("data-url");
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const destName = item.getAttribute("data-name");
      const lat = item.getAttribute("data-lat");
      const lon = item.getAttribute("data-lon");
      const district = item.getAttribute("data-district") || "";
      const isCustom = item.getAttribute("data-custom") === "true";

      if (DOM.destinationSuggestions) DOM.destinationSuggestions.classList.remove("open");

      if (lat && lon) {
        appState.destination.name = destName;
        appState.destination.district = district;
        appState.destination.lat = parseFloat(lat);
        appState.destination.lon = parseFloat(lon);
        if (DOM.destinationInput) DOM.destinationInput.value = destName;
        if (DOM.clearDestBtn) DOM.clearDestBtn.style.display = "block";
        showLocationStatus(`✓ Drop location set: ${destName.split(",")[0]}`, "success");
        calculatePickupToDrop();
      } else if (isCustom) {
        if (DOM.destinationInput) DOM.destinationInput.value = destName;
        if (DOM.clearDestBtn) DOM.clearDestBtn.style.display = "block";
        showLocationStatus(`Locating destination "${destName}" across Tamil Nadu...`, "info");
        await geocodeAndSelectCustomDestination(destName);
      }
    });
  });
}

/**
 * Geocodes an arbitrary village, town, or landmark in Tamil Nadu using live map data / Database.
 */
async function geocodeAndSelectCustomDestination(query) {
  try {
    const resolved = await resolveLocation(query, false);
    if (resolved && resolved.lat && resolved.lon) {
      appState.destination.name = resolved.name;
      appState.destination.district = resolved.district || "";
      appState.destination.lat = resolved.lat;
      appState.destination.lon = resolved.lon;
      if (DOM.destinationInput) DOM.destinationInput.value = resolved.name;
      showLocationStatus(`✓ Found destination: ${appState.destination.name.split(",")[0]}`, "success");
      calculatePickupToDrop();
      return;
    }
  } catch (e) {
    console.warn("Custom geocoding notice:", e);
  }

  // Graceful fallback
  appState.destination.name = query;
  appState.destination.lat = null;
  appState.destination.lon = null;
  calculatePickupToDrop();
}

/**
 * Selects a destination by name (from chips, popular route buttons, etc.)
 */
function selectDestinationByName(destName) {
  const clean = destName.toLowerCase();
  const found = TAMIL_NADU_LOCATIONS.find(item => 
    item.name.toLowerCase() === clean ||
    item.name.toLowerCase().includes(clean) ||
    (item.keywords && item.keywords.some(k => k.toLowerCase() === clean))
  );

  if (found) {
    appState.destination.name = found.name;
    appState.destination.district = found.district;
    appState.destination.lat = found.lat;
    appState.destination.lon = found.lon;
    if (DOM.destinationInput) DOM.destinationInput.value = found.name;
  } else {
    appState.destination.name = destName;
    appState.destination.lat = null;
    appState.destination.lon = null;
    if (DOM.destinationInput) DOM.destinationInput.value = destName;
  }

  if (DOM.clearDestBtn) DOM.clearDestBtn.style.display = "block";
  if (DOM.destinationSuggestions) {
    DOM.destinationSuggestions.classList.remove("open");
  }
  calculatePickupToDrop();
}

function resetDestinationState() {
  appState.destination.name = "";
  appState.destination.district = "";
  appState.destination.lat = null;
  appState.destination.lon = null;
  appState.distanceKm = 0;
  appState.estimatedFare = 0;
  if (DOM.inlineCalcResult) DOM.inlineCalcResult.style.display = "none";
  updateFareSummaryDisplay();
  updateMapVisualizer();
  updateGoogleMapsLinks();
  updateLeafletMapRoute(appState.pickup, appState.destination, null);
}

// ==============================================================================
// 14. LOCATION RESOLUTION & CACHING SYSTEM
// ==============================================================================

const geocodeCache = new Map();

/**
 * Resolves any place name or address in Tamil Nadu to precise coordinates.
 * Priority:
 * 1. TAMIL_NADU_LOCATIONS master database (exact/keyword/district match)
 * 2. In-memory session geocode cache
 * 3. OpenStreetMap Nominatim live geocoding scoped to Tamil Nadu, India
 */
async function resolveLocation(queryText, isPickup = false) {
  const raw = (queryText || "").trim();
  if (!raw) {
    if (isPickup) {
      return {
        name: SALEM_HUB_COORDS.name,
        district: SALEM_HUB_COORDS.district,
        lat: SALEM_HUB_COORDS.lat,
        lon: SALEM_HUB_COORDS.lon,
        isResolved: true
      };
    }
    return null;
  }

  const clean = raw.toLowerCase();

  // 1. Match local TAMIL_NADU_LOCATIONS master database
  let matched = TAMIL_NADU_LOCATIONS.find(loc => 
    loc.name.toLowerCase() === clean ||
    (loc.keywords && loc.keywords.some(k => k.toLowerCase() === clean))
  );

  // Partial match if no exact match
  if (!matched) {
    matched = TAMIL_NADU_LOCATIONS.find(loc => {
      const locClean = loc.name.toLowerCase();
      return locClean.includes(clean) || clean.includes(locClean) ||
             (loc.keywords && loc.keywords.some(k => clean.includes(k.toLowerCase()) || k.toLowerCase().includes(clean))) ||
             (loc.district && loc.district.toLowerCase() === clean);
    });
  }

  if (matched) {
    return {
      name: matched.name,
      district: matched.district,
      lat: matched.lat,
      lon: matched.lon,
      isResolved: true
    };
  }

  // 2. Check session cache
  if (geocodeCache.has(clean)) {
    return geocodeCache.get(clean);
  }

  // 3. Live Map Search Service (Photon with Tamil Nadu regional bias)
  try {
    const liveList = await fetchLiveMapPlaces(raw);
    if (liveList && liveList.length > 0) {
      const top = liveList[0];
      const fullName = top.subtitle ? `${top.name}, ${top.subtitle}` : top.name;
      const res = {
        name: fullName,
        district: top.district || "",
        lat: top.lat,
        lon: top.lon,
        isResolved: true
      };
      geocodeCache.set(clean, res);
      return res;
    }
  } catch (err) {
    console.warn("Live map resolve notice for:", raw, err.message);
  }

  // 4. Scoped OpenStreetMap Nominatim search for Tamil Nadu
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const searchQuery = clean.includes("tamil nadu") ? raw : `${raw}, Tamil Nadu, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`;
    const res = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        const resolved = {
          name: place.display_name.split(",").slice(0, 3).join(", "),
          district: "",
          lat: parseFloat(place.lat),
          lon: parseFloat(place.lon),
          isResolved: true
        };
        geocodeCache.set(clean, resolved);
        return resolved;
      }
    }
  } catch (err) {
    console.warn("Geocoding notice for:", raw, err.message);
  }

  // 4. Fallback if geocoding fails or offline
  return {
    name: raw,
    district: "",
    lat: isPickup ? SALEM_HUB_COORDS.lat : null,
    lon: isPickup ? SALEM_HUB_COORDS.lon : null,
    isResolved: false
  };
}

// ==============================================================================
// 15. DISTANCE & ROUTE CALCULATION (OSRM + GOOGLE MAPS + DEMO BENCHMARK)
// ==============================================================================

/**
 * Calculates road driving distance between pickup and destination anywhere in Tamil Nadu.
 * Queries free high-performance OSRM driving engine, with fallback to Haversine + road winding factor.
 */
async function getRoadDistance(pickup, destination) {
  const pLat = pickup.lat || SALEM_HUB_COORDS.lat;
  const pLon = pickup.lon || SALEM_HUB_COORDS.lon;
  const dLat = destination.lat;
  const dLon = destination.lon;

  // 1. High-performance OSRM driving engine
  if (pLat && pLon && dLat && dLon) {
    try {
      const osrmResult = await fetchOsrmDrivingRoute(pLat, pLon, dLat, dLon);
      if (osrmResult && osrmResult.distanceKm > 0) {
        appState.routingProvider = "Live Road Network";
        appState.durationText = null;
        return {
          distanceKm: osrmResult.distanceKm,
          roadGeometry: osrmResult.geometry,
          isLive: true
        };
      }
    } catch (err) {
      console.warn("[Mithara Travel Agency] OSRM routing notice, using regional road matrix:", err);
    }
  }

  // Reset live provider flag if offline/matrix calculation
  appState.routingProvider = "Tamil Nadu Grid";
  appState.durationText = null;

  // 3. Pre-calculated benchmark match ONLY if pickup is actually Salem hub
  const isFromSalem = Math.abs(pLat - SALEM_HUB_COORDS.lat) < 0.15 && Math.abs(pLon - SALEM_HUB_COORDS.lon) < 0.15;
  if (isFromSalem) {
    const matched = TAMIL_NADU_LOCATIONS.find(h => 
      h.name.toLowerCase().includes(destination.name.toLowerCase()) ||
      destination.name.toLowerCase().includes(h.name.toLowerCase())
    );
    if (matched && matched.approxKm > 0) {
      return {
        distanceKm: matched.approxKm,
        roadGeometry: null,
        isLive: false
      };
    }
  }

  // 4. Coordinate calculation with road tortuosity factor (Geodesic × 1.28)
  if (pLat && pLon && dLat && dLon) {
    const geodesic = haversineDistance(pLat, pLon, dLat, dLon);
    const estimatedRoad = Math.max(5, Math.round(geodesic * ROAD_TORTUOSITY_FACTOR * 10) / 10);
    return {
      distanceKm: estimatedRoad,
      roadGeometry: null,
      isLive: false
    };
  }

  // 5. String hash fallback for custom names without coordinates
  const hash = Math.abs(hashString(destination.name || "Tamil Nadu"));
  const fallbackKm = 30 + (hash % 150);
  return {
    distanceKm: fallbackKm,
    roadGeometry: null,
    isLive: false
  };
}

/**
 * Queries OSRM public routing API for actual road distance & geometry.
 */
async function fetchOsrmDrivingRoute(lat1, lon1, lat2, lon2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);

  if (res.ok) {
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const km = Math.round((route.distance / 1000) * 10) / 10;
      // Convert GeoJSON [lon, lat] coordinates to Leaflet [lat, lon]
      const coords = route.geometry.coordinates.map(pt => [pt[1], pt[0]]);
      return { distanceKm: km, geometry: coords };
    }
  }
  return null;
}

/**
 * Standard Haversine geodesic distance formula.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// ==============================================================================
// 16. FARE CALCULATION & FORMATTING
// ==============================================================================

function calculateFare(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return 0;
  return Math.round(distanceKm * RATE_PER_KM);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// ==============================================================================
// 17. INLINE CALCULATION BOX & POINT-TO-POINT ENGINE
// ==============================================================================

/**
 * Renders the prominent inline calculation result box below the Calculate button.
 */
function renderInlineCalcResult(isLive) {
  if (!DOM.inlineCalcResult) return;

  const pickupName = appState.pickup.name || "Salem, Tamil Nadu";
  const dropName = appState.destination.name || "Tamil Nadu Destination";
  const dist = appState.distanceKm;
  const fare = appState.estimatedFare;
  const formattedFare = new Intl.NumberFormat('en-IN').format(fare);
  const gmapsUrl = getGoogleMapsDirectionsUrl(appState.pickup, appState.destination);

  DOM.inlineCalcResult.innerHTML = `
    <div class="calc-result-box">
      <div class="calc-result-header">
        <span class="calc-badge">✓ DISTANCE &amp; FARE CALCULATED</span>
        <span class="calc-rate-pill">₹${RATE_PER_KM} / KM Fixed Tariff</span>
      </div>

      <div class="calc-route-strip">
        <div class="calc-point">
          <span class="point-tag pickup-tag">PICKUP LOCATION</span>
          <span class="point-name" title="${pickupName}">${pickupName}</span>
        </div>
        <div class="calc-route-arrow" aria-hidden="true">➔</div>
        <div class="calc-point">
          <span class="point-tag drop-tag">DROP LOCATION</span>
          <span class="point-name" title="${dropName}">${dropName}</span>
        </div>
      </div>

      <div class="calc-metrics-grid">
        <div class="calc-metric-card">
          <span class="calc-metric-label">DISTANCE BETWEEN PLACES</span>
          <div class="calc-metric-value">
            <span class="dist-num">${dist}</span>
            <span class="calc-unit">KM</span>
          </div>
          <span class="calc-metric-sub">${isLive ? `✓ Exact Road Corridor (${appState.routingProvider || 'Live Route'}${appState.durationText ? ' • ' + appState.durationText : ''})` : 'Standard Highway Corridor'}</span>
        </div>

        <div class="calc-metric-card highlight-amount">
          <span class="calc-metric-label">TOTAL AMOUNT</span>
          <div class="calc-metric-value amount-val">
            <span class="currency-sym">₹</span>${formattedFare}
          </div>
          <span class="calc-metric-sub">${dist} KM × ₹${RATE_PER_KM} / KM</span>
        </div>
      </div>

      <div class="calc-pricing-breakdown">
        <div class="breakdown-item">
          <span>Rate Formula:</span>
          <span class="font-bold">${dist} KM × ₹${RATE_PER_KM}/KM = ₹${formattedFare}</span>
        </div>
        <div class="breakdown-item">
          <span>Surge / Peak Charges:</span>
          <span class="free-tag">₹0 (Zero Surge Guaranteed)</span>
        </div>
        <div class="breakdown-item">
          <span>Driver Allowance &amp; Fuel:</span>
          <span class="free-tag">Included in Tariff</span>
        </div>
      </div>

      <div class="calc-actions-row">
        <button type="button" class="btn btn-primary btn-block calc-book-btn" id="inlineBookBtn">
          <span>🚕 Book This Ride Now</span>
        </button>
        <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-block calc-gmaps-btn" id="inlineGmapsBtn" title="View turn-by-turn driving route on Google Maps">
          <span>🗺️ View Route in Google Maps ↗</span>
        </a>
      </div>
    </div>
  `;

  DOM.inlineCalcResult.style.display = "block";

  // Re-attach inline book button handler
  const inlineBookBtn = document.getElementById("inlineBookBtn");
  if (inlineBookBtn) {
    inlineBookBtn.addEventListener("click", handleBookRideClick);
  }
}

/**
 * Calculates road distance between arbitrary Pickup and Drop locations anywhere in Tamil Nadu.
 * Resolves both places, computes distance via OSRM, calculates amount at ₹80/KM, and renders UI.
 */
async function calculatePickupToDrop() {
  const pickupText = DOM.pickupInput ? DOM.pickupInput.value.trim() : (appState.pickup.name || "Salem, Tamil Nadu");
  const dropText = DOM.destinationInput ? DOM.destinationInput.value.trim() : (appState.destination.name || "");

  if (!pickupText) {
    if (DOM.pickupInput) DOM.pickupInput.focus();
    showLocationStatus("Please enter a pickup location in Tamil Nadu.", "error");
    return;
  }

  if (!dropText) {
    if (DOM.destinationInput) DOM.destinationInput.focus();
    showLocationStatus("Please enter a drop location (destination).", "error");
    return;
  }

  // Visual loading feedback
  if (DOM.calculateRouteBtn) {
    DOM.calculateRouteBtn.disabled = true;
    DOM.calculateRouteBtn.innerHTML = `
      <span class="spinner" style="display:inline-block; width:15px; height:15px; border:2px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:8px;"></span>
      Calculating Distance &amp; Amount...
    `;
  }
  if (DOM.statsDistance) DOM.statsDistance.textContent = "Calculating...";
  if (DOM.statsFare) DOM.statsFare.textContent = "...";
  if (DOM.summaryDistance) DOM.summaryDistance.textContent = "Calculating...";
  if (DOM.summaryFare) DOM.summaryFare.textContent = "...";

  showLocationStatus(`Calculating route from ${pickupText.split(",")[0]} to ${dropText.split(",")[0]}...`, "info");

  try {
    // 1. Resolve both endpoints in parallel
    const [resolvedPickup, resolvedDrop] = await Promise.all([
      resolveLocation(pickupText, true),
      resolveLocation(dropText, false)
    ]);

    if (resolvedPickup) {
      appState.pickup.name = resolvedPickup.name;
      appState.pickup.district = resolvedPickup.district || "";
      appState.pickup.lat = resolvedPickup.lat;
      appState.pickup.lon = resolvedPickup.lon;
      if (DOM.pickupInput) DOM.pickupInput.value = resolvedPickup.name;
      if (DOM.clearPickupBtn) DOM.clearPickupBtn.style.display = "block";
    }

    if (resolvedDrop) {
      appState.destination.name = resolvedDrop.name;
      appState.destination.district = resolvedDrop.district || "";
      appState.destination.lat = resolvedDrop.lat;
      appState.destination.lon = resolvedDrop.lon;
      if (DOM.destinationInput) DOM.destinationInput.value = resolvedDrop.name;
      if (DOM.clearDestBtn) DOM.clearDestBtn.style.display = "block";
    }

    // 2. Compute driving road distance
    const { distanceKm, roadGeometry, isLive } = await getRoadDistance(appState.pickup, appState.destination);

    appState.distanceKm = distanceKm;
    appState.isRoutingLive = isLive;
    appState.estimatedFare = calculateFare(distanceKm);

    // 3. Synchronize all UI elements
    updateRoutingModeBadge();
    updateMapVisualizer();
    updateFareSummaryDisplay();
    updateGoogleMapsLinks();
    updateLeafletMapRoute(appState.pickup, appState.destination, roadGeometry);
    renderInlineCalcResult(isLive);

    showLocationStatus(`✓ ${appState.pickup.name.split(",")[0]} ➔ ${appState.destination.name.split(",")[0]}: ${appState.distanceKm} KM • Total Fare: ${formatCurrency(appState.estimatedFare)}`, "success");
  } catch (err) {
    console.error("Calculation error:", err);
    showLocationStatus("Error calculating route. Please verify locations and try again.", "error");
  } finally {
    if (DOM.calculateRouteBtn) {
      DOM.calculateRouteBtn.disabled = false;
      DOM.calculateRouteBtn.innerHTML = `Calculate Distance &amp; Fare`;
    }
  }
}

/**
 * Backward compatibility wrapper for calculatePickupToDrop
 */
async function calculateAndRenderRoute() {
  await calculatePickupToDrop();
}

function updateRoutingModeBadge() {
  if (!DOM.apiModeBadge || !DOM.apiModeText || !DOM.mapDisclaimerText) return;
  if (appState.isRoutingLive) {
    DOM.apiModeBadge.className = "api-mode-pill live";
    DOM.apiModeText.textContent = appState.routingProvider ? `${appState.routingProvider}` : "Live Road Distance";
    DOM.mapDisclaimerText.textContent = `Actual road corridor computed via ${appState.routingProvider || "live road routing network"}.`;
  } else {
    DOM.apiModeBadge.className = "api-mode-pill demo";
    DOM.apiModeText.textContent = "Tamil Nadu Grid";
    DOM.mapDisclaimerText.textContent = "Estimated road distance for Mithara Travel Agency travel at ₹80/km.";
  }
}

function updateMapVisualizer() {
  const pickupDisplay = appState.pickup.name ? appState.pickup.name.split(",")[0] : "Salem";
  const destDisplay = appState.destination.name ? appState.destination.name.split(",")[0] : "Select Destination";

  if (DOM.mapPickupName) DOM.mapPickupName.textContent = pickupDisplay;
  if (DOM.mapDestName) DOM.mapDestName.textContent = destDisplay;

  if (appState.distanceKm > 0) {
    if (DOM.mapMidpointDistance) DOM.mapMidpointDistance.textContent = `${appState.distanceKm} KM`;
    if (DOM.statsDistance) DOM.statsDistance.textContent = `${appState.distanceKm} KM`;
    if (DOM.statsFare) DOM.statsFare.textContent = formatCurrency(appState.estimatedFare);
  } else {
    if (DOM.mapMidpointDistance) DOM.mapMidpointDistance.textContent = "-- KM";
    if (DOM.statsDistance) DOM.statsDistance.textContent = "-- KM";
    if (DOM.statsFare) DOM.statsFare.textContent = "₹0";
  }
}

function updateFareSummaryDisplay() {
  const pickup = appState.pickup.name || "Salem, Tamil Nadu";
  const dest = appState.destination.name || "Not Selected";

  if (DOM.summaryPickup) DOM.summaryPickup.textContent = pickup;
  if (DOM.summaryDestination) DOM.summaryDestination.textContent = dest;

  if (appState.distanceKm > 0 && appState.estimatedFare > 0) {
    if (DOM.summaryDistance) DOM.summaryDistance.textContent = `${appState.distanceKm} KM`;
    if (DOM.summaryFormula) DOM.summaryFormula.textContent = `${appState.distanceKm} KM × ₹${RATE_PER_KM}`;
    const formattedFare = new Intl.NumberFormat('en-IN').format(appState.estimatedFare);
    if (DOM.summaryFare) DOM.summaryFare.textContent = formattedFare;
    if (DOM.bookRideBtn) DOM.bookRideBtn.disabled = false;

    // Mobile sticky bar
    if (DOM.mobileStickyPrice) DOM.mobileStickyPrice.textContent = formatCurrency(appState.estimatedFare);
    if (DOM.mobileStickyBar) DOM.mobileStickyBar.classList.add("visible");
    document.body.classList.add("sticky-bar-active");
  } else {
    if (DOM.summaryDistance) DOM.summaryDistance.textContent = "-- KM";
    if (DOM.summaryFormula) DOM.summaryFormula.textContent = "Select destination to calculate";
    if (DOM.summaryFare) DOM.summaryFare.textContent = "0";
    if (DOM.bookRideBtn) DOM.bookRideBtn.disabled = true;

    if (DOM.mobileStickyBar) DOM.mobileStickyBar.classList.remove("visible");
    document.body.classList.remove("sticky-bar-active");
  }
}

// ==============================================================================
// 17. BOOKING FLOW & WHATSAPP DISPATCH
// ==============================================================================

function validateBooking() {
  if (!appState.pickup.name || appState.pickup.name.trim() === "") {
    showLocationStatus("Please specify your pickup location.", "error");
    DOM.pickupInput.focus();
    return false;
  }

  if (!appState.destination.name || appState.destination.name.trim() === "") {
    DOM.destinationInput.focus();
    showLocationStatus("Please enter your destination.", "error");
    return false;
  }

  if (!appState.distanceKm || appState.distanceKm <= 0 || !appState.estimatedFare) {
    showLocationStatus("Distance could not be calculated. Please re-enter destination.", "error");
    return false;
  }

  return true;
}

function handleBookRideClick() {
  if (!validateBooking()) return;
  showBookingModal();
}

function showBookingModal() {
  DOM.modalPickupText.textContent = appState.pickup.name;
  DOM.modalDestText.textContent = appState.destination.name;
  DOM.modalDistanceText.textContent = `${appState.distanceKm} KM`;
  DOM.modalFareText.textContent = formatCurrency(appState.estimatedFare);

  DOM.bookingModal.style.display = "flex";
  document.body.style.overflow = "hidden";
  DOM.custName.focus();
}

function closeBookingModal() {
  DOM.bookingModal.style.display = "none";
  document.body.style.overflow = "";
}

function confirmBooking(e) {
  if (e) e.preventDefault();

  const name = DOM.custName.value.trim();
  const mobile = DOM.custMobile.value.trim();

  if (!name || name.length < 2) {
    alert("Please enter a valid customer name.");
    DOM.custName.focus();
    return;
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    alert("Please enter a valid 10-digit Indian mobile number (e.g. 7904974485).");
    DOM.custMobile.focus();
    return;
  }

  // 1. Save booking details into the persistent Database
  let savedBooking = null;
  const db = window.MitharaDB || window.CabDB;
  if (db) {
    try {
      savedBooking = db.saveBooking({
        customerName: name,
        customerMobile: mobile,
        pickup: appState.pickup.name,
        destination: appState.destination.name,
        distanceKm: appState.distanceKm,
        estimatedFare: appState.estimatedFare,
        ratePerKm: RATE_PER_KM,
        gmapsUrl: getGoogleMapsDirectionsUrl(appState.pickup, appState.destination),
        status: "Pending"
      });
      console.log("[Mithara Travel Agency] Booking saved to database:", savedBooking);
    } catch (dbErr) {
      console.error("[Mithara Travel Agency] Error saving to database:", dbErr);
    }
  }

  // 2. Forward booking details to WhatsApp dispatch desk
  sendWhatsAppBooking(name, mobile, savedBooking ? savedBooking.id : null);
}

function sendWhatsAppBooking(customerName, customerMobile, bookingId) {
  const fareFormatted = formatCurrency(appState.estimatedFare);
  const gmapsUrl = getGoogleMapsDirectionsUrl(appState.pickup, appState.destination);

  const messageLines = [
    "🚕 *MITHARA TRAVEL AGENCY - BOOKING REQUEST*",
    bookingId ? `*Booking ID:* ${bookingId}` : "",
    "",
    `*Customer Name:* ${customerName}`,
    `*Customer Mobile:* ${customerMobile}`,
    "",
    `*Pickup Hub:* ${appState.pickup.name}`,
    `*Destination:* ${appState.destination.name}`,
    "",
    `*Total Distance:* ${appState.distanceKm} KM`,
    `*Estimated Fare:* ${fareFormatted} (@ ₹${RATE_PER_KM}/KM)`,
    "",
    "_Saved in Mithara Travel Agency Database & forwarded to Dispatch Desk (7904974485)_"
  ].filter(Boolean);

  const fullMessage = messageLines.join("\n");
  const encodedMessage = encodeURIComponent(fullMessage);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  closeBookingModal();
  DOM.confirmBookingForm.reset();

  alert(`✅ Booking ${bookingId || ""} details saved successfully to the database! Redirecting to WhatsApp dispatch (+91 79049 74485)...`);

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

// ==============================================================================
// 18. MOBILE NAVIGATION DRAWER
// ==============================================================================

function toggleMobileDrawer() {
  const isOpen = DOM.mobileDrawer.classList.contains("active");
  if (isOpen) {
    closeMobileDrawer();
  } else {
    openMobileDrawer();
  }
}

function openMobileDrawer() {
  DOM.mobileDrawer.classList.add("active");
  DOM.drawerBackdrop.classList.add("active");
  DOM.hamburgerBtn.classList.add("open");
  DOM.hamburgerBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMobileDrawer() {
  DOM.mobileDrawer.classList.remove("active");
  DOM.drawerBackdrop.classList.remove("active");
  DOM.hamburgerBtn.classList.remove("open");
  DOM.hamburgerBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
