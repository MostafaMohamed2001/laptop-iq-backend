const { DatabaseSync } = require("node:sqlite");

const DB_PATH = "laptops.db";

function getDb() {
  return new DatabaseSync(DB_PATH);
}

function initDb() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS laptops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      model TEXT,
      price INTEGER,
      cpu TEXT,
      gpu TEXT,
      ram INTEGER,
      storage INTEGER,
      battery_hours REAL,
      screen_size REAL,
      display_type TEXT,
      refresh_rate INTEGER,
      weight_kg REAL,
      usage_tags TEXT,
      has_rgb INTEGER,
      has_touchscreen INTEGER,
      has_oled INTEGER,
      upgradeable_ram INTEGER,
      upgradeable_storage INTEGER,
      wifi6 INTEGER,
      thunderbolt INTEGER,
      performance_score INTEGER,
      battery_score INTEGER,
      portability_score INTEGER,
      overall_rating REAL
    )
  `);

  const count = db.prepare("SELECT COUNT(*) as n FROM laptops").get().n;
  if (count > 0) {
    db.close();
    return;
  }

  const laptops = [
    // ── ASUS ROG (Gaming) ──────────────────────────────────────────────
    ["ASUS","ROG Strix G16",42000,"Intel Core i7-13650HX","RTX 4060",16,512,7.5,16,"IPS",165,2.5,'["gaming","programming"]',1,0,0,1,1,1,1,88,60,50,8.5],
    ["ASUS","ROG Strix G18",56000,"Intel Core i9-13980HX","RTX 4070",32,1000,6.0,18,"IPS",240,3.1,'["gaming"]',1,0,0,1,1,1,1,97,45,30,9.0],
    ["ASUS","ROG Zephyrus G14",54000,"AMD Ryzen 9 7940HS","RTX 4060",16,512,8.0,14,"OLED",165,1.65,'["gaming","portability"]',1,0,1,0,1,1,1,90,70,80,9.2],
    ["ASUS","ROG Zephyrus G16",62000,"Intel Core i9-13900H","RTX 4080",32,1000,7.0,16,"OLED",240,2.1,'["gaming","video_editing"]',1,0,1,1,1,1,1,96,60,65,9.4],
    ["ASUS","ROG Flow X13",58000,"AMD Ryzen 9 7940HS","RTX 4060",16,512,9.0,13,"OLED",165,1.38,'["gaming","portability"]',1,1,1,0,1,1,1,88,75,88,9.1],
    ["ASUS","TUF Gaming A15",28000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,8.5,15.6,"IPS",144,2.3,'["gaming","student"]',1,0,0,1,1,1,0,82,65,55,8.2],
    ["ASUS","TUF Gaming F15",24000,"Intel Core i5-12500H","RTX 3050",8,512,7.0,15.6,"IPS",144,2.2,'["gaming","student"]',1,0,0,1,1,1,0,72,60,55,7.8],
    ["ASUS","TUF Gaming A17",30000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,7.5,17.3,"IPS",144,2.9,'["gaming"]',1,0,0,1,1,1,0,83,58,40,8.0],
    ["ASUS","ROG Strix Scar 16",85000,"Intel Core i9-13980HX","RTX 4090",32,2000,5.5,16,"IPS",240,2.62,'["gaming","ai_ml"]',1,0,0,1,1,1,1,99,35,35,9.5],
    ["ASUS","Vivobook Pro 16X",48000,"AMD Ryzen 9 7945HX","RTX 4060",16,512,8.0,16,"OLED",120,1.9,'["video_editing","programming","graphic_design"]',0,0,1,1,1,1,1,87,68,65,8.9],
    // ── ASUS non-gaming ───────────────────────────────────────────────
    ["ASUS","Zenbook 14 OLED",35000,"Intel Core i5-1335U","Intel Iris Xe",16,512,12.0,14,"OLED",90,1.39,'["office","student","portability"]',0,1,1,1,1,1,1,65,90,90,8.7],
    ["ASUS","Zenbook Pro 14 OLED",52000,"Intel Core i9-13900H","RTX 4060",16,512,10.0,14,"OLED",120,1.49,'["video_editing","programming","graphic_design"]',0,0,1,1,1,1,1,88,80,85,9.2],
    ["ASUS","ExpertBook B9",38000,"Intel Core i7-1365U","Intel Iris Xe",16,1000,15.0,14,"IPS",60,0.88,'["office","portability"]',0,0,0,1,1,1,1,60,95,99,8.4],
    ["ASUS","Vivobook 15",14000,"Intel Core i5-1235U","Intel Iris Xe",8,256,8.0,15.6,"IPS",60,1.8,'["office","student"]',0,0,0,0,1,0,0,55,65,65,7.2],
    ["ASUS","Chromebook CX5",12000,"Intel Core i3-1115G4","Intel UHD",8,128,10.0,15.6,"IPS",60,1.78,'["student","office"]',0,1,0,0,0,0,0,45,75,65,6.8],
    // ── Lenovo ThinkPad ───────────────────────────────────────────────
    ["Lenovo","ThinkPad X1 Carbon Gen 11",65000,"Intel Core i7-1365U","Intel Iris Xe",16,512,15.0,14,"IPS",60,1.12,'["office","portability","programming"]',0,0,0,1,1,1,1,68,95,95,9.3],
    ["Lenovo","ThinkPad X1 Extreme Gen 5",75000,"Intel Core i7-12800H","RTX 3050 Ti",16,512,10.0,16,"IPS",165,1.86,'["programming","office","video_editing"]',0,0,0,1,1,1,1,82,80,75,9.0],
    ["Lenovo","ThinkPad E15 Gen 4",22000,"AMD Ryzen 5 5625U","AMD Radeon",8,256,9.0,15.6,"IPS",60,1.76,'["office","student"]',0,0,0,1,1,0,0,55,75,65,7.5],
    ["Lenovo","ThinkPad T14s Gen 3",40000,"AMD Ryzen 7 6850U","AMD Radeon 680M",16,512,13.0,14,"IPS",60,1.21,'["office","programming","portability"]',0,0,0,1,1,1,0,68,90,90,8.8],
    ["Lenovo","ThinkPad P1 Gen 6",90000,"Intel Core i9-13900H","NVIDIA RTX A2000",32,1000,8.0,16,"IPS",165,1.84,'["ai_ml","video_editing","programming"]',0,0,0,1,1,1,1,92,65,68,9.1],
    // ── Lenovo IdeaPad / Legion ────────────────────────────────────────
    ["Lenovo","Legion 5 Pro 16",38000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,7.0,16,"IPS",165,2.49,'["gaming","programming"]',1,0,0,1,1,1,0,87,55,45,8.6],
    ["Lenovo","Legion 7i 16",60000,"Intel Core i9-13900HX","RTX 4070",32,1000,6.5,16,"IPS",240,2.5,'["gaming","ai_ml"]',1,0,0,1,1,1,1,95,50,40,9.1],
    ["Lenovo","Legion Pro 7i 16",80000,"Intel Core i9-13900HX","RTX 4080",32,1000,5.5,16,"IPS",240,2.8,'["gaming","ai_ml"]',1,0,0,1,1,1,1,98,38,35,9.3],
    ["Lenovo","IdeaPad Gaming 3",20000,"AMD Ryzen 5 6600H","RTX 3050",8,512,6.0,15.6,"IPS",120,2.25,'["gaming","student"]',0,0,0,0,1,0,0,70,50,50,7.4],
    ["Lenovo","IdeaPad Slim 5",18000,"AMD Ryzen 5 7530U","AMD Radeon",8,512,11.0,15.6,"IPS",60,1.66,'["office","student"]',0,0,0,1,1,0,0,58,82,70,7.8],
    ["Lenovo","Yoga 9i 14",55000,"Intel Core i7-1360P","Intel Iris Xe",16,512,14.0,14,"OLED",90,1.37,'["office","portability","graphic_design"]',0,1,1,1,1,1,1,72,90,92,9.0],
    ["Lenovo","Yoga Slim 7 Pro",42000,"AMD Ryzen 7 6800U","AMD Radeon 680M",16,512,12.0,14,"OLED",90,1.4,'["office","programming","portability"]',0,0,1,1,1,1,0,74,88,90,8.9],
    // ── HP ────────────────────────────────────────────────────────────
    ["HP","Spectre x360 14",58000,"Intel Core i7-1355U","Intel Iris Xe",16,512,14.0,14,"OLED",90,1.36,'["office","portability","graphic_design"]',0,1,1,1,1,1,1,70,92,93,9.1],
    ["HP","Spectre x360 16",65000,"Intel Core i7-13700H","Intel Arc A370M",16,512,12.0,16,"OLED",120,2.08,'["office","video_editing","graphic_design"]',0,1,1,1,1,1,1,78,85,72,9.0],
    ["HP","Envy x360 15",32000,"AMD Ryzen 7 7730U","AMD Radeon",16,512,10.0,15.6,"IPS",60,1.78,'["office","student"]',0,1,0,1,1,1,0,65,80,68,8.2],
    ["HP","EliteBook 840 G10",50000,"Intel Core i7-1365U","Intel Iris Xe",16,512,14.0,14,"IPS",60,1.4,'["office","programming"]',0,0,0,1,1,1,1,68,90,88,8.9],
    ["HP","Omen 16",40000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,7.0,16,"IPS",165,2.41,'["gaming"]',1,0,0,0,1,1,0,85,55,45,8.5],
    ["HP","Omen 17",50000,"Intel Core i9-13900HX","RTX 4070",32,1000,6.0,17.3,"IPS",165,3.18,'["gaming","ai_ml"]',1,0,0,0,1,1,0,93,42,30,8.8],
    ["HP","Victus 15",22000,"AMD Ryzen 5 7535HS","RTX 3050",8,512,7.0,15.6,"IPS",144,2.29,'["gaming","student"]',0,0,0,0,1,0,0,72,55,55,7.6],
    ["HP","Pavilion 15",16000,"Intel Core i5-1235U","Intel Iris Xe",8,256,8.0,15.6,"IPS",60,1.75,'["office","student"]',0,0,0,0,1,0,0,55,65,65,7.0],
    ["HP","ProBook 450 G10",28000,"Intel Core i5-1335U","Intel Iris Xe",8,256,10.0,15.6,"IPS",60,1.74,'["office","programming"]',0,0,0,1,1,0,0,60,78,65,7.8],
    // ── Dell ──────────────────────────────────────────────────────────
    ["Dell","XPS 13 Plus",70000,"Intel Core i7-1360P","Intel Iris Xe",16,512,12.0,13.4,"OLED",60,1.27,'["office","portability","programming"]',0,1,1,1,1,1,1,72,90,97,9.2],
    ["Dell","XPS 15",80000,"Intel Core i9-13900H","RTX 4060",32,1000,10.0,15.6,"OLED",60,1.86,'["video_editing","programming","graphic_design"]',0,1,1,1,1,1,1,90,80,72,9.5],
    ["Dell","XPS 17",95000,"Intel Core i9-13900H","RTX 4070",32,1000,9.0,17,"IPS",120,2.17,'["video_editing","ai_ml","programming"]',0,1,0,1,1,1,1,93,72,55,9.4],
    ["Dell","Alienware m16",75000,"Intel Core i9-13900HX","RTX 4080",32,1000,5.0,16,"IPS",240,3.4,'["gaming"]',1,0,0,1,1,1,1,97,35,28,9.2],
    ["Dell","Alienware m18",95000,"Intel Core i9-13900HX","RTX 4090",64,2000,4.5,18,"IPS",480,4.17,'["gaming","ai_ml"]',1,0,0,1,1,1,1,99,28,15,9.3],
    ["Dell","Alienware x14",58000,"Intel Core i7-13620H","RTX 4060",16,512,7.5,14,"IPS",165,1.89,'["gaming","portability"]',1,0,0,0,1,1,1,86,60,75,8.8],
    ["Dell","G15 Gaming",25000,"AMD Ryzen 5 7645HX","RTX 3050",8,512,7.0,15.6,"IPS",120,2.54,'["gaming","student"]',0,0,0,0,1,0,0,72,55,50,7.6],
    ["Dell","G16 Gaming",35000,"Intel Core i7-13650HX","RTX 4060",16,512,6.5,16,"IPS",165,2.87,'["gaming"]',0,0,0,1,1,1,0,84,50,40,8.2],
    ["Dell","Inspiron 15",15000,"Intel Core i5-1235U","Intel Iris Xe",8,256,8.0,15.6,"IPS",60,1.8,'["office","student"]',0,0,0,0,1,0,0,52,65,65,7.0],
    ["Dell","Latitude 5540",35000,"Intel Core i7-1365U","Intel Iris Xe",16,512,12.0,15.6,"IPS",60,1.78,'["office","programming"]',0,0,0,1,1,1,0,65,85,67,8.3],
    ["Dell","Precision 5680",100000,"Intel Core i9-13900H","NVIDIA RTX A2000",32,1000,8.0,16,"OLED",60,1.86,'["ai_ml","video_editing"]',0,0,1,1,1,1,1,92,68,72,9.4],
    // ── Acer ──────────────────────────────────────────────────────────
    ["Acer","Predator Helios 16",48000,"Intel Core i9-13900HX","RTX 4070",32,1000,6.0,16,"IPS",240,2.6,'["gaming"]',1,0,0,1,1,1,1,95,45,38,9.0],
    ["Acer","Predator Helios 18",65000,"Intel Core i9-13900HX","RTX 4080",32,2000,5.5,18,"IPS",240,3.6,'["gaming","ai_ml"]',1,0,0,1,1,1,1,98,35,22,9.1],
    ["Acer","Nitro 5 AN515",22000,"AMD Ryzen 5 7535HS","RTX 4050",8,512,7.5,15.6,"IPS",144,2.5,'["gaming","student"]',0,0,0,1,1,0,0,75,58,50,7.8],
    ["Acer","Nitro 16",28000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,7.0,16,"IPS",165,2.8,'["gaming"]',0,0,0,1,1,1,0,83,55,42,8.1],
    ["Acer","Swift X 14",32000,"AMD Ryzen 7 7736U","RTX 4050",16,512,10.0,14,"IPS",90,1.4,'["programming","video_editing","student"]',0,0,0,0,1,1,0,78,80,85,8.5],
    ["Acer","Swift 3",18000,"AMD Ryzen 5 7530U","AMD Radeon",8,512,10.0,14,"IPS",60,1.47,'["office","student","portability"]',0,0,0,0,1,0,0,58,82,88,7.8],
    ["Acer","Aspire 5",15000,"Intel Core i5-1235U","Intel Iris Xe",8,256,8.0,15.6,"IPS",60,1.9,'["office","student"]',0,0,0,1,1,0,0,55,65,62,7.1],
    ["Acer","ConceptD 5",78000,"Intel Core i9-13900H","RTX 4070",32,1000,8.0,16,"OLED",120,2.1,'["graphic_design","video_editing"]',0,1,1,1,1,1,1,90,65,65,9.2],
    ["Acer","Chromebook Spin 514",14000,"AMD Ryzen 3 3250C","AMD Radeon",8,128,10.0,14,"IPS",60,1.47,'["student","office"]',0,1,0,0,0,0,0,45,80,88,7.0],
    // ── MSI ───────────────────────────────────────────────────────────
    ["MSI","Titan GT77 HX",95000,"Intel Core i9-13980HX","RTX 4090",64,2000,4.0,17.3,"IPS",360,3.3,'["gaming","ai_ml"]',1,0,0,1,1,1,1,99,28,18,9.4],
    ["MSI","Raider GE78 HX",82000,"Intel Core i9-13980HX","RTX 4080",32,2000,5.0,17,"IPS",240,2.9,'["gaming"]',1,0,0,1,1,1,1,98,35,28,9.3],
    ["MSI","Vector GP76",50000,"Intel Core i9-12900H","RTX 3080 Ti",32,1000,5.5,17.3,"IPS",144,2.7,'["gaming","ai_ml"]',1,0,0,1,1,1,0,94,40,28,8.9],
    ["MSI","Stealth 16",72000,"Intel Core i9-13900H","RTX 4070",32,1000,6.5,16,"OLED",240,1.99,'["gaming","video_editing"]',0,0,1,0,1,1,1,93,55,65,9.2],
    ["MSI","Katana 15",26000,"Intel Core i7-12650H","RTX 4060",8,512,6.5,15.6,"IPS",144,2.25,'["gaming","student"]',0,0,0,0,1,0,0,80,52,52,7.9],
    ["MSI","Bravo 15",24000,"AMD Ryzen 7 6800H","RX 6600M",8,512,7.5,15.6,"IPS",144,2.35,'["gaming","student"]',0,0,0,1,1,0,0,78,58,52,7.8],
    ["MSI","Prestige 14",40000,"Intel Core i7-1360P","Intel Iris Xe",16,512,11.0,14,"OLED",90,1.29,'["office","programming","portability"]',0,0,1,0,1,1,1,70,85,92,8.8],
    ["MSI","Summit E16",55000,"Intel Core i7-1360P","Intel Arc A370M",16,512,10.0,16,"OLED",120,1.99,'["office","graphic_design","programming"]',0,1,1,0,1,1,1,75,80,72,8.9],
    ["MSI","Creator M16",65000,"Intel Core i9-13900H","RTX 4070",32,1000,7.0,16,"Mini LED",165,2.35,'["video_editing","graphic_design","ai_ml"]',0,0,0,1,1,1,1,92,60,60,9.2],
    // ── Gigabyte ──────────────────────────────────────────────────────
    ["Gigabyte","AORUS 17X",70000,"Intel Core i9-13980HX","RTX 4080",32,1000,5.0,17.3,"IPS",240,3.0,'["gaming","ai_ml"]',1,0,0,1,1,1,1,97,35,25,9.1],
    ["Gigabyte","AORUS 16X",55000,"AMD Ryzen 9 7945HX","RTX 4070",16,512,6.0,16,"IPS",165,2.5,'["gaming"]',1,0,0,1,1,1,0,92,48,42,8.9],
    ["Gigabyte","AORUS 15",42000,"Intel Core i7-13700H","RTX 4060",16,512,7.0,15.6,"IPS",165,2.2,'["gaming","programming"]',1,0,0,1,1,1,0,86,55,50,8.5],
    ["Gigabyte","G5 KF",20000,"Intel Core i5-12500H","RTX 4060",8,512,6.5,15.6,"IPS",144,2.2,'["gaming","student"]',0,0,0,0,1,0,0,78,52,52,7.7],
    ["Gigabyte","Aero 16",70000,"Intel Core i9-13900H","RTX 4080",32,1000,7.5,16,"OLED",120,2.1,'["video_editing","graphic_design","ai_ml"]',0,0,1,1,1,1,1,93,60,62,9.3],
    ["Gigabyte","Aero 14",55000,"AMD Ryzen 9 7940HS","RTX 4070",16,512,9.0,14,"OLED",90,1.65,'["video_editing","programming","portability"]',0,0,1,1,1,1,1,88,72,80,9.1],
    // ── Razer ─────────────────────────────────────────────────────────
    ["Razer","Blade 16",95000,"Intel Core i9-13950HX","RTX 4090",32,1000,5.5,16,"Mini LED",240,2.14,'["gaming","video_editing"]',1,0,0,0,1,1,1,99,42,60,9.6],
    ["Razer","Blade 15",78000,"Intel Core i7-13800H","RTX 4070",16,1000,7.0,15.6,"OLED",240,2.01,'["gaming","programming"]',1,0,1,0,1,1,1,93,58,65,9.4],
    ["Razer","Blade 14",68000,"AMD Ryzen 9 7940HS","RTX 4070",16,1000,9.0,14,"IPS",165,1.72,'["gaming","portability"]',1,0,0,0,1,1,1,90,72,80,9.3],
    ["Razer","Blade Stealth 13",52000,"Intel Core i7-1165G7","Intel Iris Xe",16,512,13.0,13.4,"OLED",60,1.35,'["office","portability","programming"]',0,1,1,0,1,1,1,65,88,95,8.9],
    ["Razer","Book 13",45000,"Intel Core i7-1165G7","Intel Iris Xe",16,512,14.0,13.4,"IPS",60,1.37,'["office","programming","portability"]',0,1,0,0,1,1,1,63,88,95,8.7],
    // ── Apple ─────────────────────────────────────────────────────────
    ["Apple","MacBook Air 13 M2",50000,"Apple M2","Apple M2 GPU 8-core",8,256,15.0,13.6,"Liquid Retina",60,1.24,'["office","programming","student","portability"]',0,1,0,0,1,1,1,75,95,98,9.5],
    ["Apple","MacBook Air 13 M3",58000,"Apple M3","Apple M3 GPU 10-core",8,256,18.0,13.6,"Liquid Retina",60,1.24,'["office","programming","student","portability"]',0,1,0,0,1,1,1,80,98,98,9.7],
    ["Apple","MacBook Air 15 M3",68000,"Apple M3","Apple M3 GPU 10-core",8,256,15.0,15.3,"Liquid Retina",60,1.51,'["office","programming","portability"]',0,1,0,0,1,1,1,80,95,90,9.6],
    ["Apple","MacBook Pro 14 M3",78000,"Apple M3 Pro","Apple M3 Pro GPU 18-core",18,512,17.0,14.2,"Liquid Retina XDR",120,1.61,'["programming","video_editing","graphic_design","ai_ml"]',0,1,1,0,1,1,1,90,96,90,9.8],
    ["Apple","MacBook Pro 14 M3 Max",110000,"Apple M3 Max","Apple M3 Max GPU 30-core",36,1000,14.0,14.2,"Liquid Retina XDR",120,1.61,'["ai_ml","video_editing","programming"]',0,1,1,0,1,1,1,97,93,90,9.9],
    ["Apple","MacBook Pro 16 M3 Pro",95000,"Apple M3 Pro","Apple M3 Pro GPU 18-core",18,512,14.0,16.2,"Liquid Retina XDR",120,2.14,'["programming","video_editing","graphic_design","ai_ml"]',0,1,1,0,1,1,1,92,92,75,9.9],
    ["Apple","MacBook Pro 16 M3 Max",130000,"Apple M3 Max","Apple M3 Max GPU 40-core",64,1000,12.0,16.2,"Liquid Retina XDR",120,2.14,'["ai_ml","video_editing","programming"]',0,1,1,0,1,1,1,99,90,70,10.0],
    // ── Samsung ───────────────────────────────────────────────────────
    ["Samsung","Galaxy Book3 Pro",65000,"Intel Core i7-1360P","Intel Iris Xe",16,512,15.0,16,"AMOLED",120,1.56,'["office","portability","programming"]',0,0,1,0,1,1,1,72,92,85,9.1],
    ["Samsung","Galaxy Book3 Pro 360",72000,"Intel Core i7-1360P","Intel Iris Xe",16,512,14.0,16,"AMOLED",120,1.66,'["office","graphic_design","portability"]',0,1,1,0,1,1,1,72,90,83,9.0],
    ["Samsung","Galaxy Book3 Ultra",90000,"Intel Core i9-13900H","RTX 4070",16,512,8.0,16,"AMOLED",120,1.79,'["video_editing","programming","ai_ml"]',0,0,1,0,1,1,1,88,72,78,9.3],
    ["Samsung","Galaxy Book3 360 15",42000,"Intel Core i5-1340P","Intel Iris Xe",8,256,12.0,15.6,"AMOLED",60,1.68,'["office","student"]',0,1,1,0,1,0,0,62,85,75,8.4],
    ["Samsung","Galaxy Book2 Business",35000,"Intel Core i5-1250P","Intel Iris Xe",8,256,11.0,14,"IPS",60,1.43,'["office","programming"]',0,0,0,1,1,1,1,60,85,88,8.2],
    // ── Huawei ────────────────────────────────────────────────────────
    ["Huawei","MateBook X Pro",70000,"Intel Core i7-1360P","Intel Iris Xe",16,1000,14.0,14.2,"OLED",90,1.26,'["office","portability","programming"]',0,1,1,0,1,1,1,72,90,95,9.2],
    ["Huawei","MateBook 14s",42000,"Intel Core i7-12700H","Intel Iris Xe",16,512,11.0,14.2,"IPS",90,1.43,'["office","programming","portability"]',0,1,0,0,1,1,0,68,85,88,8.7],
    ["Huawei","MateBook 16s",50000,"Intel Core i7-12700H","Intel Iris Xe",16,512,8.0,16,"IPS",60,1.99,'["office","programming"]',0,1,0,0,1,1,0,68,72,68,8.5],
    ["Huawei","MateBook D 15",20000,"AMD Ryzen 5 5500U","AMD Radeon",16,512,9.0,15.6,"IPS",60,1.56,'["office","student"]',0,0,0,0,1,0,0,58,75,72,7.8],
    ["Huawei","MateBook D 14",18000,"AMD Ryzen 5 5500U","AMD Radeon",8,256,9.5,14,"IPS",60,1.38,'["office","student","portability"]',0,0,0,0,1,0,0,55,78,85,7.7],
    // ── Extra variety ─────────────────────────────────────────────────
    ["ASUS","ROG Strix G15",36000,"AMD Ryzen 7 6800H","RTX 3070 Ti",16,512,7.0,15.6,"IPS",300,2.3,'["gaming"]',1,0,0,1,1,1,0,90,55,50,8.7],
    ["Lenovo","Legion Slim 5",32000,"AMD Ryzen 7 7745HX","RTX 4060",16,512,8.5,16,"IPS",165,2.0,'["gaming","programming","student"]',0,0,0,1,1,1,0,85,65,65,8.7],
    ["HP","Spectre x360 13.5",60000,"Intel Core i7-1355U","Intel Iris Xe",16,512,15.0,13.5,"OLED",60,1.34,'["office","portability","graphic_design"]',0,1,1,1,1,1,1,70,93,96,9.2],
    ["Dell","Inspiron 16 Plus",30000,"Intel Core i7-12700H","Intel Arc A370M",16,512,9.0,16,"IPS",120,1.99,'["office","programming","student"]',0,0,0,1,1,0,0,72,72,65,8.2],
    ["Acer","Predator Triton 500 SE",75000,"Intel Core i9-12900H","RTX 3080 Ti",32,1000,6.0,16,"IPS",240,2.1,'["gaming","video_editing"]',1,0,0,0,1,1,1,95,48,60,9.1],
    ["MSI","GS76 Stealth",68000,"Intel Core i9-11900H","RTX 3080",32,1000,5.0,17.3,"IPS",360,2.1,'["gaming"]',0,0,0,0,1,1,1,95,38,50,8.8],
    ["Gigabyte","AORUS Master 15",60000,"Intel Core i9-12900H","RTX 3080 Ti",32,1000,5.5,15.6,"IPS",240,2.3,'["gaming","ai_ml"]',1,0,0,1,1,1,0,96,42,45,9.0],
    ["Razer","Blade Stealth 14",58000,"AMD Ryzen 9 6900HX","RTX 3060",16,1000,8.5,14,"IPS",144,1.78,'["gaming","portability"]',0,0,0,0,1,1,1,85,68,80,9.0],
    ["Apple","MacBook Air 13 M1",38000,"Apple M1","Apple M1 GPU 7-core",8,256,15.0,13.3,"Retina",60,1.29,'["office","student","portability","programming"]',0,0,0,0,1,1,1,72,96,98,9.3],
    ["Samsung","Galaxy Book Pro",45000,"Intel Core i5-1240P","Intel Iris Xe",8,256,15.0,15.6,"AMOLED",60,1.05,'["office","portability"]',0,0,1,0,1,1,0,62,92,95,8.8],
    ["Huawei","MateBook E",38000,"Intel Core i5-1130G7","Intel Iris Xe",8,256,12.0,12.6,"OLED",60,0.71,'["office","portability","student"]',0,1,1,0,1,1,0,55,88,99,8.5],
    ["ASUS","ProArt Studiobook 16",85000,"AMD Ryzen 9 7945HX","NVIDIA RTX 4070",32,2000,6.0,16,"OLED",120,1.88,'["graphic_design","video_editing","ai_ml"]',0,1,1,1,1,1,1,93,52,65,9.5],
    ["Lenovo","ThinkPad X13 Gen 4",42000,"AMD Ryzen 7 7730U","AMD Radeon",16,512,13.0,13.3,"IPS",60,1.22,'["office","portability","programming"]',0,0,0,1,1,1,0,65,90,93,8.7],
    ["HP","ZBook Fury 16",95000,"Intel Core i9-13950HX","NVIDIA RTX A2000",32,1000,7.0,16,"IPS",165,2.64,'["ai_ml","video_editing","graphic_design"]',0,0,0,1,1,1,1,92,60,50,9.3],
    ["Dell","Inspiron 14 Plus",24000,"Intel Core i7-12700H","Intel Arc A370M",16,512,10.0,14,"IPS",120,1.67,'["office","programming","student"]',0,0,0,1,1,0,0,70,78,82,8.1],
    ["Acer","Swift Edge 16",38000,"AMD Ryzen 7 7736U","AMD Radeon",16,512,10.0,16,"OLED",120,1.17,'["office","portability","programming"]',0,0,1,0,1,1,0,68,85,90,8.8],
    ["MSI","Crosshair 16",48000,"Intel Core i7-13700H","RTX 4070",16,512,7.0,16,"IPS",240,2.5,'["gaming"]',1,0,0,0,1,1,0,90,52,45,8.7],
    ["Gigabyte","G6X",30000,"Intel Core i7-13650HX","RTX 4060",16,512,7.5,16,"IPS",165,2.3,'["gaming","programming"]',0,0,0,1,1,1,0,84,58,48,8.3],
    ["ASUS","TUF Dash F15",30000,"Intel Core i7-12650H","RTX 4060",16,512,8.5,15.6,"IPS",144,1.8,'["gaming","student","portability"]',0,0,0,0,1,1,0,82,68,75,8.4],
    ["Lenovo","IdeaPad 5 Pro",25000,"AMD Ryzen 7 6800U","AMD Radeon 680M",16,512,12.0,16,"IPS",120,1.86,'["office","programming","student"]',0,0,0,1,1,1,0,70,85,70,8.3],
    ["HP","Dragonfly G4",72000,"Intel Core i7-1365U","Intel Iris Xe",32,1000,15.0,13.5,"OLED",60,0.99,'["office","portability","programming"]',0,1,1,1,1,1,1,72,95,99,9.4],
    ["Dell","Vostro 15",18000,"Intel Core i5-1235U","Intel Iris Xe",8,256,9.0,15.6,"IPS",60,1.84,'["office","student"]',0,0,0,1,1,0,0,55,72,65,7.3],
    ["Acer","Aspire Vero",16000,"Intel Core i5-1235U","Intel Iris Xe",8,512,9.0,15.6,"IPS",60,1.8,'["office","student"]',0,0,0,1,1,0,0,55,72,65,7.2],
    ["MSI","Modern 15",20000,"Intel Core i5-1235U","Intel Iris Xe",8,256,9.0,15.6,"IPS",60,1.6,'["office","student"]',0,0,0,0,1,0,0,55,72,72,7.4],
    ["Gigabyte","U4",28000,"Intel Core i7-1195G7","Intel Iris Xe",16,512,12.0,14,"IPS",60,1.17,'["office","portability","programming"]',0,0,0,0,1,1,0,65,88,93,8.4],
    ["ASUS","Zenbook S 13 OLED",45000,"AMD Ryzen 7 7745U","AMD Radeon 780M",16,512,13.0,13.3,"OLED",120,1.0,'["office","portability","programming"]',0,0,1,0,1,1,0,70,90,99,9.1],
    ["Lenovo","Yoga 7i 14",32000,"Intel Core i5-1340P","Intel Iris Xe",16,512,12.0,14,"IPS",90,1.5,'["office","student","portability"]',0,1,0,1,1,0,0,62,85,85,8.3],
    ["HP","Laptop 15s",13000,"Intel Core i3-1215U","Intel UHD",8,256,7.0,15.6,"IPS",60,1.69,'["student","office"]',0,0,0,0,1,0,0,42,62,65,6.5],
    ["Dell","XPS 13",65000,"Intel Core i7-1360P","Intel Iris Xe",16,512,13.0,13.4,"OLED",60,1.17,'["office","portability","programming"]',0,1,1,1,1,1,1,70,92,97,9.3],
    ["Acer","Enduro Urban N3",25000,"Intel Core i5-1135G7","Intel Iris Xe",8,256,10.0,14,"IPS",60,1.4,'["office","student"]',0,0,0,0,1,0,0,58,80,85,7.8],
    ["MSI","Alpha 15",28000,"AMD Ryzen 7 6800H","RX 6700M",16,512,7.0,15.6,"IPS",240,2.2,'["gaming"]',0,0,0,1,1,0,0,85,55,52,8.3],
    ["Razer","Blade 18",110000,"Intel Core i9-13950HX","RTX 4090",32,2000,4.0,18,"IPS",300,3.1,'["gaming","ai_ml"]',1,0,0,1,1,1,1,99,30,18,9.5],
    ["Apple","MacBook Pro 13 M2",55000,"Apple M2","Apple M2 GPU 10-core",8,256,17.0,13.3,"Retina",60,1.4,'["programming","student","office"]',0,1,0,0,1,1,0,78,96,94,9.5],
    ["Samsung","Galaxy Book3 360 13",35000,"Intel Core i5-1340P","Intel Iris Xe",8,256,13.0,13.3,"AMOLED",60,1.09,'["office","portability","student"]',0,1,1,0,1,0,0,60,88,96,8.5],
    ["Huawei","MateBook 13s",36000,"Intel Core i5-12500H","Intel Iris Xe",8,512,11.5,13.4,"IPS",90,1.3,'["office","portability","student"]',0,1,0,0,1,1,0,65,85,92,8.5],
    ["ASUS","ROG Zephyrus Duo 16",90000,"AMD Ryzen 9 6900HX","RTX 3080 Ti",32,1000,5.5,16,"IPS",165,2.48,'["gaming","video_editing"]',1,1,0,1,1,1,1,95,42,42,9.2],
    ["Lenovo","ThinkBook 14 Gen 5",28000,"Intel Core i7-1360P","Intel Iris Xe",16,512,11.0,14,"IPS",60,1.38,'["office","programming","student"]',0,0,0,1,1,1,0,65,85,88,8.3],
    ["HP","EliteBook 1040 G10",75000,"Intel Core i7-1365U","Intel Iris Xe",32,1000,14.0,14,"IPS",60,1.31,'["office","programming","portability"]',0,1,0,1,1,1,1,70,92,93,9.2],
    ["Dell","Latitude 7440",60000,"Intel Core i7-1365U","Intel Iris Xe",16,512,14.0,14,"IPS",60,1.24,'["office","programming","portability"]',0,0,0,1,1,1,1,68,90,93,9.0],
    ["Acer","TravelMate P4",30000,"Intel Core i5-1240P","Intel Iris Xe",8,256,12.0,14,"IPS",60,1.45,'["office","programming"]',0,0,0,1,1,1,0,60,85,85,8.1],
    ["MSI","Pulse GL76",32000,"Intel Core i7-12700H","RTX 3060",16,512,6.5,17.3,"IPS",144,2.7,'["gaming"]',0,0,0,1,1,0,0,82,50,35,8.0],
    ["Gigabyte","G5 MF",22000,"Intel Core i5-12500H","RTX 4050",8,512,7.0,15.6,"IPS",144,2.2,'["gaming","student"]',0,0,0,0,1,0,0,76,55,52,7.8],
    ["ASUS","Vivobook S 15",22000,"AMD Ryzen 5 7530U","AMD Radeon",8,512,10.0,15.6,"OLED",60,1.8,'["office","student"]',0,0,1,0,1,0,0,58,80,68,7.9],
    ["Lenovo","Legion Slim 7",55000,"AMD Ryzen 9 7945HX","RTX 4070",16,1000,7.5,16,"IPS",165,1.9,'["gaming","programming","ai_ml"]',0,0,0,0,1,1,1,92,60,70,9.2],
    ["HP","Envy 16",48000,"Intel Core i9-13900H","RTX 4060",16,512,8.0,16,"OLED",120,2.25,'["video_editing","programming","graphic_design"]',0,0,1,1,1,1,1,85,68,62,9.0],
    ["Dell","Precision 3571",55000,"Intel Core i7-12800H","NVIDIA T600",16,512,9.0,15.6,"IPS",60,1.86,'["ai_ml","programming","graphic_design"]',0,0,0,1,1,1,0,80,70,65,8.7],
    ["Acer","Nitro 17",34000,"AMD Ryzen 7 7745HX","RTX 4070",16,512,6.5,17.3,"IPS",144,3.0,'["gaming"]',1,0,0,1,1,1,0,88,50,35,8.4],
    ["MSI","Thin GF63",18000,"Intel Core i5-12450H","RTX 4050",8,512,7.0,15.6,"IPS",144,1.86,'["gaming","student","portability"]',0,0,0,0,1,0,0,74,55,72,7.6],
    ["Gigabyte","Aero 16 OLED",75000,"Intel Core i9-13900H","RTX 4070",32,2000,7.0,16,"OLED",120,2.1,'["video_editing","ai_ml","graphic_design"]',0,0,1,1,1,1,1,93,60,62,9.4],
    ["ASUS","ROG Flow Z13",68000,"Intel Core i9-13900H","RTX 4060",16,512,7.0,13.4,"IPS",165,1.1,'["gaming","portability"]',1,1,0,0,1,1,1,88,62,90,9.1],
    ["Lenovo","ThinkPad L14 Gen 4",25000,"AMD Ryzen 5 7530U","AMD Radeon",8,256,11.0,14,"IPS",60,1.37,'["office","student"]',0,0,0,1,1,0,0,58,82,88,7.8],
    ["HP","ProBook 440 G10",24000,"Intel Core i5-1335U","Intel Iris Xe",8,256,10.0,14,"IPS",60,1.49,'["office","student"]',0,0,0,1,1,0,0,58,78,85,7.7],
    ["Dell","Vostro 14",16000,"Intel Core i5-1235U","Intel Iris Xe",8,256,8.5,14,"IPS",60,1.56,'["office","student"]',0,0,0,0,1,0,0,52,68,78,7.0],
    ["Acer","Aspire 7",20000,"AMD Ryzen 5 5625U","RTX 3050",8,512,7.5,15.6,"IPS",144,2.1,'["gaming","student","office"]',0,0,0,1,1,0,0,70,60,60,7.7],
    ["MSI","Sword 17 HX",42000,"Intel Core i7-13700HX","RTX 4060",16,512,7.0,17.3,"IPS",144,2.7,'["gaming"]',0,0,0,1,1,1,0,85,52,35,8.3],
    ["Gigabyte","G7 KF",26000,"Intel Core i7-12650H","RTX 4060",16,512,7.0,17.3,"IPS",144,2.6,'["gaming"]',0,0,0,0,1,0,0,82,52,35,8.0],
    ["Razer","Blade 15 Advanced",85000,"Intel Core i9-13950HX","RTX 4080",32,1000,5.5,15.6,"OLED",240,2.01,'["gaming","video_editing"]',1,0,1,0,1,1,1,97,42,62,9.5],
    ["Apple","MacBook Air 13 M2 512",62000,"Apple M2","Apple M2 GPU 10-core",16,512,18.0,13.6,"Liquid Retina",60,1.24,'["office","programming","ai_ml","portability"]',0,1,0,0,1,1,1,82,98,98,9.8],
    ["Samsung","Galaxy Book3",28000,"Intel Core i5-1335U","Intel Iris Xe",8,256,12.0,15.6,"IPS",60,1.58,'["office","student"]',0,0,0,0,1,0,0,58,85,72,7.9],
    ["Huawei","MateBook 11",22000,"Intel Core i5-1130G7","Intel Iris Xe",8,256,11.0,11,"IPS",60,0.49,'["portability","student","office"]',0,1,0,0,1,1,0,48,85,99,8.0],
    ["ASUS","Zenbook 14X OLED",48000,"Intel Core i9-13900H","Intel Arc A530M",16,512,10.0,14.5,"OLED",120,1.4,'["programming","video_editing","office"]',0,1,1,1,1,1,1,80,82,88,9.1],
    ["Lenovo","IdeaPad Gaming 3i",22000,"Intel Core i5-12500H","RTX 3050",8,512,7.0,15.6,"IPS",120,2.2,'["gaming","student"]',0,0,0,0,1,0,0,72,55,55,7.5],
    ["HP","Omen Transcend 14",60000,"Intel Core i7-13700H","RTX 4070",16,512,7.0,14,"IPS",165,1.6,'["gaming","portability"]',0,0,0,0,1,1,1,88,58,80,9.0],
    ["Dell","G16 Gaming 7630",42000,"Intel Core i9-12900H","RTX 3070 Ti",16,512,5.5,16,"IPS",165,3.0,'["gaming"]',0,0,0,1,1,0,0,88,42,38,8.4],
    ["Acer","Predator Helios 300",36000,"Intel Core i7-12700H","RTX 3060",16,512,7.0,15.6,"IPS",144,2.1,'["gaming","student"]',1,0,0,1,1,1,0,84,55,52,8.5],
    ["MSI","GF65 Thin",24000,"Intel Core i5-10500H","RTX 3060",8,512,6.5,15.6,"IPS",144,1.86,'["gaming","student"]',0,0,0,0,1,0,0,78,50,68,7.7],
    ["Gigabyte","G6",28000,"Intel Core i7-12650H","RTX 4060",16,512,7.5,16,"IPS",165,2.15,'["gaming","programming"]',0,0,0,0,1,1,0,83,58,60,8.2],
  ];

  const insert = db.prepare(`
    INSERT INTO laptops (brand,model,price,cpu,gpu,ram,storage,battery_hours,
    screen_size,display_type,refresh_rate,weight_kg,usage_tags,has_rgb,
    has_touchscreen,has_oled,upgradeable_ram,upgradeable_storage,wifi6,
    thunderbolt,performance_score,battery_score,portability_score,overall_rating)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  db.exec("BEGIN");
  for (const row of laptops) insert.run(...row);
  db.exec("COMMIT");

  db.close();
}

module.exports = { getDb, initDb };
