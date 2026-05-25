import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getDb } from '@/lib/mongodb'

// ─────────────────────────────────────────────────────────────────────────────
// SEED PRODUCTS — 10 per category, each image matches the product exactly
// ─────────────────────────────────────────────────────────────────────────────
const SEED_PRODUCTS = [

  // ══════════════════════════════════════════
  //  LIGHTING  (10 products)
  // ══════════════════════════════════════════
  {
    id: 'l1',
    name: 'Philips 9W LED Bulb – Cool Daylight B22',
    brand: 'Philips', category: 'Lighting',
    price: 149, mrp: 250, rating: 4.5, reviews: 3284, stock: 250,
    image: '/products/l1.webp',
    description: 'Energy-efficient 9W LED bulb, 806 lumens, cool daylight 6500K. B22 base. 15,000-hour lifespan, saves up to 88% electricity.',
    features: ['9 Watts', 'Cool Daylight 6500K', '806 Lumens', 'B22 Base', '15,000 hr lifespan'],
    tags: ['bestseller', 'eco'],
  },
  {
    id: 'l2',
    name: 'Syska 12W LED Bulb – Warm White E27',
    brand: 'Syska', category: 'Lighting',
    price: 199, mrp: 349, rating: 4.3, reviews: 1642, stock: 180,
    image: '/products/l2.webp',
    description: 'Bright 12W warm white LED bulb. Perfect for living rooms and bedrooms. 1100 lumens, E27 base, 2-year warranty.',
    features: ['12 Watts', 'Warm White 3000K', '1100 Lumens', 'E27 Base', '2 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 'l3',
    name: 'Wipro 9W LED Bulbs – Pack of 4',
    brand: 'Wipro', category: 'Lighting',
    price: 449, mrp: 899, rating: 4.6, reviews: 5103, stock: 320,
    image: '/products/l3.webp',
    description: 'Pack of 4 premium 9W LED bulbs for whole-house upgrade. Cool white, BIS certified, energy saving.',
    features: ['Pack of 4', '9W each', 'Cool White 6500K', 'BIS Certified', 'Energy Saving'],
    tags: ['deal', 'bestseller'],
  },
  {
    id: 'l4',
    name: 'Philips 20W LED Tube Light – 4 ft',
    brand: 'Philips', category: 'Lighting',
    price: 349, mrp: 599, rating: 4.6, reviews: 4142, stock: 200,
    image: '/products/l4.webp',
    description: '20W LED tube replacing 40W fluorescent. Flicker-free, instant start. Ideal for kitchens, offices, garages. 2000 lumens.',
    features: ['20 Watts', '4 ft Length', '2000 Lumens', 'Flicker-Free', 'Instant Start'],
    tags: ['bestseller'],
  },
  {
    id: 'l5',
    name: 'Syska 18W LED Batten – Cool White 2 ft',
    brand: 'Syska', category: 'Lighting',
    price: 279, mrp: 499, rating: 4.4, reviews: 2876, stock: 300,
    image: '/products/l5.webp',
    description: 'Slim 2 ft LED batten light, uniform illumination, surface mount. 1800 lumens, cool white 6500K.',
    features: ['18 Watts', 'Cool White 6500K', '1800 Lumens', 'Surface Mount', '2 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 'l6',
    name: 'Wipro 7W LED Round Downlight',
    brand: 'Wipro', category: 'Lighting',
    price: 199, mrp: 349, rating: 4.3, reviews: 924, stock: 400,
    image: '/products/l6.webp',
    description: 'Recessed 7W LED downlight for false ceilings. Warm white 3000K, 600 lumens, clip-fit design.',
    features: ['7 Watts', 'Warm White 3000K', '600 Lumens', 'Recessed Mount', 'Clip-fit'],
    tags: [],
  },
  {
    id: 'l7',
    name: 'Havells 5W LED Night Lamp – Pack of 2',
    brand: 'Havells', category: 'Lighting',
    price: 249, mrp: 399, rating: 4.2, reviews: 762, stock: 220,
    image: '/products/l7.webp',
    description: 'Compact 5W LED lamp for corridors, bedrooms and night use. Soft warm light, reduces eye strain. B22 base.',
    features: ['5 Watts', 'Warm White', 'Pack of 2', 'B22 Base', 'Low Power'],
    tags: ['deal'],
  },
  {
    id: 'l8',
    name: 'Bajaj 12W LED Panel Light – Round',
    brand: 'Bajaj', category: 'Lighting',
    price: 329, mrp: 549, rating: 4.5, reviews: 1231, stock: 160,
    image: '/products/l8.webp',
    description: '12W round LED panel light for false ceilings. Neutral white 4000K, 1200 lumens, driverless design.',
    features: ['12 Watts', 'Neutral White 4000K', '1200 Lumens', 'Round Panel', 'Driverless'],
    tags: ['new'],
  },
  {
    id: 'l9',
    name: 'Crompton 7W LED Spotlight GU10',
    brand: 'Crompton', category: 'Lighting',
    price: 189, mrp: 299, rating: 4.1, reviews: 543, stock: 180,
    image: '/products/l9.webp',
    description: '7W GU10 LED spotlight for accent and display lighting. Warm white 3000K, 36° beam, ideal for showrooms.',
    features: ['7 Watts', 'Warm White 3000K', 'GU10 Base', '36° Beam Angle', '600 Lumens'],
    tags: [],
  },
  {
    id: 'l10',
    name: 'Orient 20W LED Flood Light – Outdoor',
    brand: 'Orient', category: 'Lighting',
    price: 699, mrp: 1199, rating: 4.6, reviews: 891, stock: 90,
    image: '/products/l10.webp',
    description: '20W outdoor LED flood light, IP65 waterproof. Cool white 6500K, wide beam, for gardens and facades.',
    features: ['20 Watts', 'IP65 Waterproof', 'Cool White 6500K', 'Wide Beam', 'Outdoor Use'],
    tags: ['bestseller'],
  },

  // ══════════════════════════════════════════
  //  FANS  (10 products)
  // ══════════════════════════════════════════
  {
    id: 'f1',
    name: 'Crompton Hill Briz 1200mm Ceiling Fan',
    brand: 'Crompton', category: 'Fans',
    price: 2199, mrp: 3499, rating: 4.4, reviews: 5421, stock: 45,
    image: '/products/f1.webp',
    description: 'High-speed 5-blade ceiling fan with aerodynamic design. 400 RPM, excellent air delivery for medium-large rooms.',
    features: ['1200mm Sweep', '5 Blades', '400 RPM', '74W Power', '2 Year Warranty'],
    tags: ['bestseller'],
  },
  {
    id: 'f2',
    name: 'Atomberg Renesa 1200mm BLDC Ceiling Fan',
    brand: 'Atomberg', category: 'Fans',
    price: 3899, mrp: 5499, rating: 4.7, reviews: 4214, stock: 30,
    image: '/products/f2.webp',
    description: 'BLDC ceiling fan with remote. Only 28W. Saves 65% electricity vs regular fans. 6-speed settings, 5-star rated.',
    features: ['BLDC Motor', '28W', 'Remote Control', '5-Star Rated', '6 Speed Settings'],
    tags: ['new', 'eco'],
  },
  {
    id: 'f3',
    name: 'Crompton Aura 1200mm Decorative Fan',
    brand: 'Crompton', category: 'Fans',
    price: 2799, mrp: 4299, rating: 4.5, reviews: 2341, stock: 35,
    image: '/products/f3.webp',
    description: 'Stylish 3-blade decorative ceiling fan with chrome finish. 380 RPM, elegant design for living rooms.',
    features: ['1200mm Sweep', '3 Blades', '380 RPM', 'Chrome Finish', '2 Year Warranty'],
    tags: ['bestseller'],
  },
  {
    id: 'f4',
    name: 'Orient Electric 400mm Table Fan',
    brand: 'Orient', category: 'Fans',
    price: 1299, mrp: 1999, rating: 4.3, reviews: 1654, stock: 60,
    image: '/products/f4.webp',
    description: '400mm table fan with 3-speed control and 360° oscillation. Powerful motor, ideal for desk or bedside use.',
    features: ['400mm Blade', '3 Speed Settings', '360° Oscillation', 'Low Noise', '1 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 'f5',
    name: 'Usha 150mm Exhaust Fan (6 inch)',
    brand: 'Usha', category: 'Fans',
    price: 649, mrp: 999, rating: 4.1, reviews: 887, stock: 90,
    image: '/products/f5.webp',
    description: 'Efficient 6-inch exhaust fan for bathrooms and kitchens. High-speed motor, quick ventilation, flush mounting.',
    features: ['150mm (6 inch)', 'High Speed', 'Flush Mount', 'Low Noise', '1 Year Warranty'],
    tags: [],
  },
  {
    id: 'f6',
    name: 'Havells Stealth 1200mm BLDC Fan',
    brand: 'Havells', category: 'Fans',
    price: 3299, mrp: 4699, rating: 4.8, reviews: 3102, stock: 28,
    image: '/products/f6.webp',
    description: 'Havells BLDC ceiling fan with remote. Ultra-quiet, only 28W, 5-star BEE rating. Ideal for master bedrooms.',
    features: ['BLDC Motor', '28W', 'Remote Included', '5-Star BEE', 'Ultra-Quiet'],
    tags: ['bestseller', 'eco'],
  },
  {
    id: 'f7',
    name: 'Bajaj Esteem 1200mm Ceiling Fan – Brown',
    brand: 'Bajaj', category: 'Fans',
    price: 1799, mrp: 2799, rating: 4.3, reviews: 2219, stock: 50,
    image: '/products/f7.webp',
    description: 'Classic 3-blade ceiling fan in brown finish. 400 RPM, 74W, sturdy motor with 5-year warranty.',
    features: ['1200mm Sweep', '3 Blades', '400 RPM', 'Brown Finish', '5 Year Warranty'],
    tags: ['deal'],
  },
  {
    id: 'f8',
    name: 'Polycab 1400mm High-Speed Ceiling Fan',
    brand: 'Polycab', category: 'Fans',
    price: 2499, mrp: 3799, rating: 4.4, reviews: 1432, stock: 40,
    image: '/products/f8.webp',
    description: 'Extra-large 1400mm sweep fan for large halls. 420 RPM, high air delivery, aerodynamic blades.',
    features: ['1400mm Sweep', '3 Blades', '420 RPM', 'High Air Delivery', '2 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 'f9',
    name: 'Philips 1200mm Ceiling Fan – White',
    brand: 'Philips', category: 'Fans',
    price: 2099, mrp: 3299, rating: 4.4, reviews: 1832, stock: 55,
    image: '/products/f9.webp',
    description: 'Philips 1200mm ceiling fan with 5-blade design. Premium motor, silent operation, energy efficient.',
    features: ['1200mm Sweep', '5 Blades', 'Silent Motor', 'Energy Efficient', '2 Year Warranty'],
    tags: [],
  },
  {
    id: 'f10',
    name: 'Anchor 300mm Wall-Mount Fan',
    brand: 'Anchor', category: 'Fans',
    price: 999, mrp: 1499, rating: 4.2, reviews: 763, stock: 70,
    image: '/products/f10.webp',
    description: '300mm wall-mount fan with 3-speed settings. Saves floor space. Adjustable tilt, suitable for kitchens and workshops.',
    features: ['300mm Blade', 'Wall Mount', '3 Speed Settings', 'Adjustable Tilt', '1 Year Warranty'],
    tags: [],
  },

  // ══════════════════════════════════════════
  //  SWITCHES & SOCKETS  (10 products)
  // ══════════════════════════════════════════
  {
    id: 's1',
    name: 'Anchor Roma 16A Modular Switch – White',
    brand: 'Anchor', category: 'Switches & Sockets',
    price: 89, mrp: 150, rating: 4.2, reviews: 1892, stock: 600,
    image: '/products/s1.webp',
    description: 'Premium 16A modular switch with durable polycarbonate body. Flame retardant, ISI certified, sleek white design.',
    features: ['16 Amp', 'Modular', 'Polycarbonate Body', 'ISI Certified', '1 Year Warranty'],
    tags: [],
  },
  {
    id: 's2',
    name: 'Havells Touch Switch with LED Indicator',
    brand: 'Havells', category: 'Switches & Sockets',
    price: 249, mrp: 399, rating: 4.5, reviews: 721, stock: 150,
    image: '/products/s2.webp',
    description: 'Modern touch-sensitive switch with LED indicator. Elegant design, easy on/off, anti-bacterial surface.',
    features: ['Touch Sensitive', 'LED Indicator', 'Anti-Bacterial', 'Modern Design', '2 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 's3',
    name: 'Anchor 6A 3-Pin Socket – Pack of 5',
    brand: 'Anchor', category: 'Switches & Sockets',
    price: 299, mrp: 499, rating: 4.3, reviews: 1424, stock: 500,
    image: '/products/s3.webp',
    description: '6A modular 3-pin socket with safety shutter. Child-proof, flush mounting, suitable for all Indian plugs.',
    features: ['6 Amp', '3-Pin', 'Safety Shutter', 'Pack of 5', 'ISI Certified'],
    tags: ['deal'],
  },
  {
    id: 's4',
    name: 'Legrand 16A Universal Socket – White',
    brand: 'Legrand', category: 'Switches & Sockets',
    price: 349, mrp: 549, rating: 4.6, reviews: 842, stock: 200,
    image: '/products/s4.webp',
    description: 'Universal 16A socket accepts 2-pin and 3-pin plugs. Child-safe shutter, ISI marked, elegant design.',
    features: ['16 Amp', 'Universal', 'Child-Safe Shutter', 'ISI Marked', '2 Year Warranty'],
    tags: ['bestseller'],
  },
  {
    id: 's5',
    name: 'Wipro 6A 2-Pin Socket – Pack of 10',
    brand: 'Wipro', category: 'Switches & Sockets',
    price: 249, mrp: 449, rating: 4.1, reviews: 534, stock: 400,
    image: '/products/s5.webp',
    description: '2-pin socket for standard loads. Pack of 10. Durable ABS body, safety shutters, easy installation.',
    features: ['6 Amp', '2-Pin', 'Pack of 10', 'ABS Body', 'Safety Shutters'],
    tags: ['deal'],
  },
  {
    id: 's6',
    name: 'Havells 5-in-1 Extension Board 2m',
    brand: 'Havells', category: 'Switches & Sockets',
    price: 599, mrp: 999, rating: 4.5, reviews: 2341, stock: 180,
    image: '/products/s6.webp',
    description: '5-socket extension board with individual switches, surge protection and 2m heavy-duty cable.',
    features: ['5 Sockets', 'Individual Switches', 'Surge Protection', '2m Cable', '2500W Load'],
    tags: ['bestseller'],
  },
  {
    id: 's7',
    name: 'Anchor 4-Way Spike Guard 1.5m',
    brand: 'Anchor', category: 'Switches & Sockets',
    price: 399, mrp: 699, rating: 4.3, reviews: 1132, stock: 250,
    image: '/products/s7.webp',
    description: '4-way spike guard with master switch, surge protection and USB charging port. 1.5m cable.',
    features: ['4 Sockets', 'Surge Protection', 'USB Port', '1.5m Cable', 'Master Switch'],
    tags: ['new'],
  },
  {
    id: 's8',
    name: 'Legrand Arteor 1-Gang Dimmer Switch',
    brand: 'Legrand', category: 'Switches & Sockets',
    price: 1299, mrp: 1999, rating: 4.7, reviews: 421, stock: 80,
    image: '/products/s8.webp',
    description: 'Rotary dimmer for LED and CFL lights up to 600W. Brushed aluminium finish, smooth dimming.',
    features: ['600W Load', 'LED & CFL Compatible', 'Rotary Control', 'Aluminium Finish', '2 Year Warranty'],
    tags: ['new'],
  },
  {
    id: 's9',
    name: 'Havells Modular Plate 4M – Glossy White',
    brand: 'Havells', category: 'Switches & Sockets',
    price: 179, mrp: 299, rating: 4.4, reviews: 643, stock: 350,
    image: '/products/s9.webp',
    description: '4-module wall plate for modular switches/sockets. Glossy white finish, polycarbonate, fire retardant.',
    features: ['4 Module', 'Glossy White', 'Polycarbonate', 'Fire Retardant', 'ISI Certified'],
    tags: [],
  },
  {
    id: 's10',
    name: 'Syska 16A Waterproof IP44 Socket',
    brand: 'Syska', category: 'Switches & Sockets',
    price: 449, mrp: 749, rating: 4.4, reviews: 312, stock: 120,
    image: '/products/s10.webp',
    description: 'IP44 splash-proof 16A socket for outdoor and wet area use. Heavy-duty lid, suitable for AC points near bathrooms.',
    features: ['16 Amp', 'IP44 Rated', 'Splash-Proof', 'Heavy-Duty Lid', 'Outdoor Use'],
    tags: ['new'],
  },

  // ══════════════════════════════════════════
  //  WIRES & CABLES  (10 products)
  // ══════════════════════════════════════════
  {
    id: 'w1',
    name: 'Polycab 2.5 sq mm House Wire 90m – Red',
    brand: 'Polycab', category: 'Wires & Cables',
    price: 1899, mrp: 2499, rating: 4.6, reviews: 2532, stock: 75,
    image: '/products/w1.webp',
    description: '2.5 sq mm ISI certified copper FR wire for power points. 90m coil, fire-retardant PVC insulation.',
    features: ['2.5 sq mm', '90 Metres', 'Pure Copper', 'Fire Retardant', 'ISI Certified'],
    tags: ['bestseller'],
  },
  {
    id: 'w2',
    name: 'Polycab 1.5 sq mm Wire 90m – Red',
    brand: 'Polycab', category: 'Wires & Cables',
    price: 1299, mrp: 1799, rating: 4.7, reviews: 3103, stock: 100,
    image: '/products/w2.webp',
    description: 'ISI certified 1.5 sq mm copper wire for light points. Fire retardant insulation. 90m coil.',
    features: ['1.5 sq mm', '90 Metres', 'Pure Copper', 'FR Insulation', 'ISI Certified'],
    tags: ['bestseller'],
  },
  {
    id: 'w3',
    name: 'Finolex 4 sq mm Wire 90m – Yellow',
    brand: 'Finolex', category: 'Wires & Cables',
    price: 2899, mrp: 3899, rating: 4.6, reviews: 1243, stock: 60,
    image: '/products/w3.webp',
    description: 'Heavy-duty 4 sq mm wire for AC and geyser sub-circuits. ISI certified, FRLS insulation, 90m coil.',
    features: ['4 sq mm', '90 Metres', 'FRLS Insulation', 'ISI Certified', 'For AC/Geyser'],
    tags: ['new'],
  },
  {
    id: 'w4',
    name: 'Havells 6 sq mm Armoured Cable 50m',
    brand: 'Havells', category: 'Wires & Cables',
    price: 4999, mrp: 6999, rating: 4.5, reviews: 431, stock: 30,
    image: '/products/w4.webp',
    description: 'Steel wire armoured 6 sq mm cable for underground or outdoor wiring. UV resistant, moisture proof.',
    features: ['6 sq mm', '50 Metres', 'Armoured', 'UV Resistant', 'Outdoor Use'],
    tags: [],
  },
  {
    id: 'w5',
    name: 'RR Kabel 1 sq mm Flexible Wire 90m – Blue',
    brand: 'RR Kabel', category: 'Wires & Cables',
    price: 799, mrp: 1199, rating: 4.5, reviews: 987, stock: 150,
    image: '/products/w5.webp',
    description: '1 sq mm flexible copper wire for light extensions and switchboards. 90m coil, blue colour.',
    features: ['1 sq mm', '90 Metres', 'Flexible', 'Blue', 'ISI Certified'],
    tags: ['deal'],
  },
  {
    id: 'w6',
    name: 'Anchor 2.5 sq mm FR Wire 90m – Green',
    brand: 'Anchor', category: 'Wires & Cables',
    price: 1749, mrp: 2399, rating: 4.4, reviews: 763, stock: 80,
    image: '/products/w6.webp',
    description: 'Anchor FR copper wire 2.5 sq mm, green, 90m. Used as earthing wire. ISI marked, high conductivity.',
    features: ['2.5 sq mm', '90 Metres', 'Green (Earth)', 'FR Insulation', 'ISI Certified'],
    tags: [],
  },
  {
    id: 'w7',
    name: 'Polycab 3-Core Flat Cable 1.5 sq mm 30m',
    brand: 'Polycab', category: 'Wires & Cables',
    price: 1499, mrp: 1999, rating: 4.6, reviews: 534, stock: 50,
    image: '/products/w7.webp',
    description: '3-core flat copper cable 1.5 sq mm. Used for appliance connections. 30m, FRLS insulation.',
    features: ['3-Core Flat', '1.5 sq mm', '30 Metres', 'FRLS', 'ISI Certified'],
    tags: ['new'],
  },
  {
    id: 'w8',
    name: 'Havells 1.5 sq mm FRLS Wire 90m – White',
    brand: 'Havells', category: 'Wires & Cables',
    price: 1349, mrp: 1899, rating: 4.7, reviews: 1432, stock: 90,
    image: '/products/w8.webp',
    description: 'FRLS 1.5 sq mm copper wire, white, 90m. Halogen-free, low smoke emission. Ideal for concealed wiring.',
    features: ['1.5 sq mm', '90 Metres', 'FRLS', 'Halogen-Free', 'Low Smoke'],
    tags: ['bestseller'],
  },
  {
    id: 'w9',
    name: 'Finolex 2-Core Flat Wire 2.5 sq mm 100m',
    brand: 'Finolex', category: 'Wires & Cables',
    price: 3299, mrp: 4499, rating: 4.5, reviews: 621, stock: 40,
    image: '/products/w9.webp',
    description: '2-core flat copper wire for submersible pump and motor connections. 2.5 sq mm, 100m, heavy duty.',
    features: ['2-Core Flat', '2.5 sq mm', '100 Metres', 'Motor Grade', 'ISI Certified'],
    tags: [],
  },
  {
    id: 'w10',
    name: 'V-Guard 1 sq mm Copper Wire 90m – Red',
    brand: 'V-Guard', category: 'Wires & Cables',
    price: 849, mrp: 1249, rating: 4.4, reviews: 872, stock: 130,
    image: '/products/w10.webp',
    description: 'V-Guard 1 sq mm pure copper wire, red, 90m. FR PVC insulation, ISI certified, for light circuits.',
    features: ['1 sq mm', '90 Metres', 'Pure Copper', 'FR PVC', 'ISI Certified'],
    tags: ['deal'],
  },

  // ══════════════════════════════════════════
  //  CIRCUIT PROTECTION  (10 products)
  // ══════════════════════════════════════════
  {
    id: 'c1',
    name: 'Legrand 32A MCB Pack of 4',
    brand: 'Legrand', category: 'Circuit Protection',
    price: 799, mrp: 1299, rating: 4.4, reviews: 1243, stock: 90,
    image: '/products/c1.webp',
    description: 'Single-pole 32A MCB, C-curve. Protects against overload and short circuit. ISI certified. Pack of 4.',
    features: ['32 Amp', 'Single Pole', 'C-Curve', 'Pack of 4', 'ISI Certified'],
    tags: [],
  },
  {
    id: 'c2',
    name: 'Legrand 63A RCCB 30mA Double Pole',
    brand: 'Legrand', category: 'Circuit Protection',
    price: 1199, mrp: 1899, rating: 4.6, reviews: 631, stock: 50,
    image: '/products/c2.webp',
    description: '63A double-pole RCCB, 30mA sensitivity. Essential shock protection for home distribution boards.',
    features: ['63 Amp', 'Double Pole', '30mA', 'Shock Protection', 'ISI Certified'],
    tags: ['new'],
  },
  {
    id: 'c3',
    name: 'Havells 16A MCB – Pack of 6',
    brand: 'Havells', category: 'Circuit Protection',
    price: 849, mrp: 1399, rating: 4.5, reviews: 934, stock: 120,
    image: '/products/c3.webp',
    description: 'Havells 16A SP MCB, B-curve, 10kA breaking capacity. For lighting circuits. Pack of 6.',
    features: ['16 Amp', 'B-Curve', '10kA', 'Pack of 6', 'ISI Certified'],
    tags: ['deal'],
  },
  {
    id: 'c4',
    name: 'Anchor 8-Way Distribution Board',
    brand: 'Anchor', category: 'Circuit Protection',
    price: 1299, mrp: 1999, rating: 4.4, reviews: 531, stock: 60,
    image: '/products/c4.webp',
    description: '8-way TPN distribution board with transparent cover. Accepts 6A to 32A MCBs. ISI certified enclosure.',
    features: ['8-Way', 'TPN', 'Transparent Cover', 'ISI Certified', 'Surface/Flush Mount'],
    tags: ['new'],
  },
  {
    id: 'c5',
    name: 'Schneider 40A ELCB / RCCB 30mA',
    brand: 'Schneider', category: 'Circuit Protection',
    price: 1499, mrp: 2299, rating: 4.7, reviews: 421, stock: 40,
    image: '/products/c5.webp',
    description: 'Schneider 40A 2-pole RCCB with 30mA trip sensitivity. Provides earth fault and shock protection.',
    features: ['40 Amp', '2-Pole', '30mA', 'Earth Fault Protection', 'ISI Certified'],
    tags: ['bestseller'],
  },
  {
    id: 'c6',
    name: 'Legrand 100A Main Switch – DPIC',
    brand: 'Legrand', category: 'Circuit Protection',
    price: 1099, mrp: 1699, rating: 4.5, reviews: 312, stock: 35,
    image: '/products/c6.webp',
    description: '100A double-pole isolating switch (DPIC) for main input to distribution board. ISI certified.',
    features: ['100 Amp', 'Double Pole', 'Isolator', 'ISI Certified', 'DIN Rail Mount'],
    tags: [],
  },
  {
    id: 'c7',
    name: 'Havells 20A 4-Pole MCCB',
    brand: 'Havells', category: 'Circuit Protection',
    price: 1899, mrp: 2999, rating: 4.6, reviews: 243, stock: 30,
    image: '/products/c7.webp',
    description: '20A 4-pole moulded case circuit breaker for 3-phase motor protection. 25kA breaking capacity.',
    features: ['20 Amp', '4-Pole', '25kA', '3-Phase', 'Motor Protection'],
    tags: ['new'],
  },
  {
    id: 'c8',
    name: 'Polycab 6A MCB – Pack of 10',
    brand: 'Polycab', category: 'Circuit Protection',
    price: 699, mrp: 1099, rating: 4.3, reviews: 562, stock: 200,
    image: '/products/c8.webp',
    description: '6A single-pole B-curve MCB for light circuits. ISI certified. Value pack of 10 pieces.',
    features: ['6 Amp', 'B-Curve', 'Single Pole', 'Pack of 10', 'ISI Certified'],
    tags: ['deal'],
  },
  {
    id: 'c9',
    name: 'Schneider Easy9 DB Box 8-Way',
    brand: 'Schneider', category: 'Circuit Protection',
    price: 1799, mrp: 2699, rating: 4.7, reviews: 341, stock: 45,
    image: '/products/c9.webp',
    description: 'Schneider 8-way consumer unit with transparent door, DIN rail, and neutral-earth bar. Surface mount.',
    features: ['8 Ways', 'DIN Rail', 'Neutral Bar', 'Transparent Door', 'Surface Mount'],
    tags: ['bestseller'],
  },
  {
    id: 'c10',
    name: 'Anchor 32A DP Switch – Isolator',
    brand: 'Anchor', category: 'Circuit Protection',
    price: 399, mrp: 699, rating: 4.2, reviews: 434, stock: 120,
    image: '/products/c10.webp',
    description: '32A double-pole AC isolator switch. Used for AC disconnect. Lockable, ISI certified, surface mount.',
    features: ['32 Amp', 'Double Pole', 'AC Isolator', 'Lockable', 'ISI Certified'],
    tags: [],
  },

  // ══════════════════════════════════════════
  //  TOOLS  (10 products)
  // ══════════════════════════════════════════
  {
    id: 't1',
    name: 'Fluke 107 Digital Multimeter',
    brand: 'Fluke', category: 'Tools',
    price: 2499, mrp: 3499, rating: 4.7, reviews: 1282, stock: 40,
    image: '/products/t1.webp',
    description: 'Auto-ranging digital multimeter, AC/DC voltage and current, resistance, continuity, diode test. CAT III safety.',
    features: ['Auto-Ranging', 'AC/DC Voltage', 'Continuity Buzzer', 'Diode Test', 'CAT III Safety'],
    tags: ['bestseller'],
  },
  {
    id: 't2',
    name: 'Stanley Insulated Screwdriver Set – 6 Pcs',
    brand: 'Stanley', category: 'Tools',
    price: 699, mrp: 1099, rating: 4.5, reviews: 2143, stock: 100,
    image: '/products/t2.webp',
    description: 'Set of 6 VDE-rated insulated screwdrivers (1000V). Ergonomic handles, chrome-vanadium steel tips.',
    features: ['1000V Insulated', '6-Piece Set', 'VDE Certified', 'Chrome-Vanadium', 'Ergonomic Handle'],
    tags: ['bestseller'],
  },
  {
    id: 't3',
    name: 'Bosch EasyDrill 550W Drill Machine',
    brand: 'Bosch', category: 'Tools',
    price: 2199, mrp: 3299, rating: 4.6, reviews: 3421, stock: 50,
    image: '/products/t3.webp',
    description: '550W drill for wood, metal and masonry. 2-speed gearbox, 10mm chuck, ergonomic grip. Ideal for electricians.',
    features: ['550W Motor', '2-Speed', '10mm Chuck', 'Masonry Capable', '2 Year Warranty'],
    tags: ['bestseller'],
  },
  {
    id: 't4',
    name: 'Taparia Wire Stripper & Cutter Plier',
    brand: 'Taparia', category: 'Tools',
    price: 349, mrp: 599, rating: 4.4, reviews: 1654, stock: 150,
    image: '/products/t4.webp',
    description: 'Combination wire stripper, cutter and crimper. Strips 0.6–2.6mm wires. Drop-forged steel, insulated handles.',
    features: ['Wire Stripper', 'Wire Cutter', 'Crimper', 'Drop-Forged Steel', 'Insulated Handles'],
    tags: ['deal'],
  },
  {
    id: 't5',
    name: 'Klein Non-Contact Voltage Tester',
    brand: 'Klein', category: 'Tools',
    price: 999, mrp: 1499, rating: 4.6, reviews: 943, stock: 80,
    image: '/products/t5.webp',
    description: 'Non-contact AC voltage detector 12–1000V. LED and buzzer alert. Safe, no direct contact needed.',
    features: ['12–1000V AC', 'Non-Contact', 'LED + Buzzer', 'Auto Power Off', 'CAT IV Rated'],
    tags: ['new'],
  },
  {
    id: 't6',
    name: 'Bosch PLR 30C Laser Distance Meter',
    brand: 'Bosch', category: 'Tools',
    price: 3299, mrp: 4999, rating: 4.7, reviews: 1231, stock: 35,
    image: '/products/t6.webp',
    description: 'Measures up to 30m with ±2mm accuracy. Bluetooth, area and volume calculation. Compact design.',
    features: ['30m Range', '±2mm Accuracy', 'Bluetooth', 'Area/Volume Calc', 'Compact'],
    tags: ['new'],
  },
  {
    id: 't7',
    name: 'PVC Insulation Tape Assorted – Pack of 10',
    brand: 'Anchor', category: 'Tools',
    price: 199, mrp: 349, rating: 4.3, reviews: 3421, stock: 500,
    image: '/products/t7.webp',
    description: 'Pack of 10 PVC insulation tapes in assorted colours. 19mm × 20m each. Flame-retardant, ISI marked.',
    features: ['Pack of 10', 'Assorted Colours', '19mm × 20m', 'Flame Retardant', 'ISI Marked'],
    tags: ['deal', 'bestseller'],
  },
  {
    id: 't8',
    name: 'Stanley Combination Plier 8 inch',
    brand: 'Stanley', category: 'Tools',
    price: 299, mrp: 499, rating: 4.4, reviews: 1843, stock: 200,
    image: '/products/t8.webp',
    description: '8-inch combination plier with 1000V insulated handles. Cuts, grips and bends wires. Drop-forged steel.',
    features: ['8 Inch', '1000V Insulated', 'Drop-Forged', 'Wire Cutter', 'VDE Certified'],
    tags: [],
  },
  {
    id: 't9',
    name: 'Taparia 4-in-1 Screwdriver Tester',
    brand: 'Taparia', category: 'Tools',
    price: 149, mrp: 249, rating: 4.2, reviews: 2134, stock: 400,
    image: '/products/t9.webp',
    description: 'Phase tester and 4-in-1 screwdriver. Tests live wire up to 500V AC. Neon indicator, transparent handle.',
    features: ['Phase Tester', '4-in-1 Bits', '500V AC Test', 'Neon Indicator', 'Compact'],
    tags: ['deal'],
  },
  {
    id: 't10',
    name: 'Bosch GSH 3E Demolition Hammer 650W',
    brand: 'Bosch', category: 'Tools',
    price: 8499, mrp: 12999, rating: 4.8, reviews: 621, stock: 20,
    image: '/products/t10.webp',
    description: '650W professional demolition / chipping hammer for breaking concrete. Anti-vibration handle, SDS-plus chuck.',
    features: ['650W', 'SDS-Plus Chuck', 'Anti-Vibration', '2.9J Impact Energy', '2 Year Warranty'],
    tags: ['new'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// DB helpers — all data goes to MongoDB via lib/mongodb.js
// ─────────────────────────────────────────────────────────────────────────────

async function getProducts() {
  const db = await getDb()
  const col = db.collection('products')
  const count = await col.countDocuments()
  if (count === 0) {
    // First run: seed all products
    await col.insertMany(SEED_PRODUCTS.map(p => ({ ...p })))
  } else if (count < 60) {
    // Old seed — replace with full 60-product seed
    await col.deleteMany({})
    await col.insertMany(SEED_PRODUCTS.map(p => ({ ...p })))
  }
  const products = await col.find({}).toArray()
  return products.map(({ _id, ...rest }) => rest)
}

async function saveOrder(order) {
  const db = await getDb()
  await db.collection('orders').insertOne({ ...order })
}

async function listOrders() {
  const db = await getDb()
  const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray()
  return orders.map(({ _id, ...rest }) => rest)
}

async function getOrder(id) {
  const db = await getDb()
  const o = await db.collection('orders').findOne({ id })
  if (!o) return null
  const { _id, ...rest } = o
  return rest
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handlers (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const path = (params?.path || []).join('/')
    const url = new URL(request.url)

    if (!path) return NextResponse.json({ status: 'ok', service: 'VoltMart API', mongo: true })

    if (path === 'products') {
      const category = url.searchParams.get('category')
      const search = url.searchParams.get('search')
      let products = await getProducts()
      if (category && category !== 'All') products = products.filter(p => p.category === category)
      if (search) {
        const q = search.toLowerCase()
        products = products.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      }
      return NextResponse.json(products)
    }

    if (path.startsWith('products/')) {
      const id = path.split('/')[1]
      const products = await getProducts()
      const product = products.find(p => p.id === id)
      if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(product)
    }

    if (path === 'categories') {
      const products = await getProducts()
      const cats = Array.from(new Set(products.map(p => p.category)))
      return NextResponse.json(cats)
    }

    if (path === 'orders') return NextResponse.json(await listOrders())

    if (path.startsWith('orders/')) {
      const id = path.split('/')[1]
      const order = await getOrder(id)
      if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(order)
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (err) {
    console.error('GET error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const path = (params?.path || []).join('/')
    const body = await request.json().catch(() => ({}))

    if (path === 'orders') {
      const { items, customer, total } = body
      if (!items || !items.length || !customer)
        return NextResponse.json({ error: 'Invalid order' }, { status: 400 })
      const order = {
        id: uuidv4(), items, customer, total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      }
      await saveOrder(order)
      return NextResponse.json(order)
    }

    return NextResponse.json({ error: 'Route not found' }, { status: 404 })
  } catch (err) {
    console.error('POST error', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
