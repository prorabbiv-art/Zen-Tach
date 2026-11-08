import { Product, Category, Banner, Coupon, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-smartphones',
    name: 'Smartphones',
    nameBn: 'স্মার্টফোন',
    slug: 'smartphones',
    description: 'Flagship & budget mobile phones from Apple, Samsung, Google & OnePlus',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    icon: 'Smartphone',
    order: 1
  },
  {
    id: 'cat-laptops',
    name: 'Laptops',
    nameBn: 'ল্যাপটপ',
    slug: 'laptops',
    description: 'High performance ultrabooks, MacBooks and pro gaming laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    icon: 'Laptop',
    order: 2
  },
  {
    id: 'cat-earbuds',
    name: 'Earbuds & Audio',
    nameBn: 'ইয়ারবাডস ও অডিও',
    slug: 'earbuds',
    description: 'Noise cancelling TWS earbuds, audiophile IEMs, soundbars and bluetooth speakers',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    icon: 'Headphones',
    order: 3
  },
  {
    id: 'cat-smartwatches',
    name: 'Smartwatches',
    nameBn: 'স্মার্টওয়াচ',
    slug: 'smartwatches',
    description: 'Fitness trackers, AMOLED smartwatches and premium wearables',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    icon: 'Watch',
    order: 4
  },
  {
    id: 'cat-keyboards',
    name: 'Keyboards & Mice',
    nameBn: 'কীবোর্ড ও মাউস',
    slug: 'keyboards',
    description: 'Mechanical hot-swappable keyboards and lightweight esports mice',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    icon: 'Keyboard',
    order: 5
  },
  {
    id: 'cat-monitors',
    name: 'Monitors',
    nameBn: 'মনিটর',
    slug: 'monitors',
    description: 'High refresh rate IPS, Mini-LED and OLED displays for creative work and gaming',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    icon: 'Tv',
    order: 6
  },
  {
    id: 'cat-powerbanks',
    name: 'Power Banks & Chargers',
    nameBn: 'পাওয়ার ব্যাংক ও চার্জার',
    slug: 'power-banks',
    description: 'GaN ultra-fast chargers, MagSafe batteries and high capacity power banks',
    image: 'https://images.unsplash.com/photo-1609592426804-9a8c148bb66a?auto=format&fit=crop&w=800&q=80',
    icon: 'BatteryCharging',
    order: 7
  },
  {
    id: 'cat-gaming',
    name: 'Gaming & Drones',
    nameBn: 'গেমিং ও ড্রোন',
    slug: 'gaming',
    description: '4K camera drones, controllers, cooling pads and gaming gear',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    icon: 'Gamepad2',
    order: 8
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-iphone-16-pro-max',
    name: 'Apple iPhone 16 Pro Max (256GB / 512GB)',
    slug: 'apple-iphone-16-pro-max',
    brand: 'Apple',
    categoryId: 'cat-smartphones',
    categoryName: 'Smartphones',
    badge: 'Flagship 2024',
    description: 'Featuring Grade 5 Titanium design with the all-new Camera Control tactile button, 48MP Fusion camera with 5x telephoto optical zoom, and the industry-leading A18 Pro chip engineered specifically for Apple Intelligence. Includes 6.9" Super Retina XDR OLED display with ProMotion 120Hz and thinnest borders ever on any Apple device.',
    shortDescription: 'Grade 5 Titanium, A18 Pro chip, 48MP camera with 5x optical zoom and Camera Control button.',
    regularPrice: 185000,
    discountPrice: 172000,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    stock: 14,
    sku: 'IPH-16PM-256',
    warranty: '1 Year Official Apple Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Full hardware and screen coverage against manufacturer defects with free service.',
      centers: [
        'Bashundhara City Level 5, Panthapath, Dhaka',
        'Jamuna Future Park Level 4 (Shop #4C-021), Kuril, Dhaka',
        'Agrabad Commercial Area (Center Point), Chattogram'
      ]
    },
    inTheBox: [
      'iPhone 16 Pro Max with iOS 18',
      'USB-C Charge Cable (1m braided)',
      'Documentation & Apple Logo Sticker',
      'SIM Ejector Pin'
    ],
    highlights: [
      'Aerospace-grade Titanium design with textured matte glass back',
      'Next-generation Camera Control button with tactile haptics',
      'A18 Pro chip with 6-core GPU offering 20% faster graphics',
      'Up to 33 hours of video playback — highest battery life on an iPhone'
    ],
    faqs: [
      {
        question: 'Is this unit officially BTRC approved and eligible for physical SIM?',
        answer: 'Yes! All ZEN TACH units are factory unlocked, physical nano-SIM + eSIM enabled, and fully compatible with all BD operators (Grameenphone, Banglalink, Robi, Airtel, Teletalk).'
      },
      {
        question: 'Does the package come with a wall charging adapter?',
        answer: 'Following Apple’s environmental guidelines, the box includes a premium braided USB-C cable but no power brick. We recommend pairing with the Anker 737 or Baseus 100W GaN charger.'
      },
      {
        question: 'Can I pay Cash on Delivery outside Dhaka?',
        answer: 'Yes! We ship nationwide via Steadfast and RedX Courier. You can inspect the outer packaging and seal before making payment.'
      }
    ],
    specifications: {
      'Display': '6.9-inch Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak',
      'Processor': 'Apple A18 Pro (3nm architecture, 16-core Neural Engine)',
      'Storage': '256GB / 512GB NVMe ultra-fast flash',
      'Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Tetraprism Telephoto',
      'Battery': '4685 mAh, MagSafe up to 25W with 30W adapter',
      'Materials': 'Titanium Frame, Ceramic Shield front, Textured matte glass back',
      'Water Resistance': 'IP68 (maximum depth of 6m up to 30 mins)',
      'OS': 'iOS 18 with Apple Intelligence'
    },
    colors: [
      { name: 'Natural Titanium', hex: '#BEB8AE' },
      { name: 'Desert Titanium', hex: '#C4A482' },
      { name: 'Black Titanium', hex: '#2C2B29' }
    ],
    variants: [
      { name: 'Storage', options: ['256GB', '512GB'] }
    ],
    frequentlyBoughtWith: ['prod-airpods-pro-2-usbc', 'prod-baseus-gan5-100w'],
    bundleDiscountPct: 10,
    featured: true,
    bestSeller: true,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 28,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-galaxy-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G AI',
    slug: 'samsung-galaxy-s24-ultra-5g-ai',
    brand: 'Samsung',
    categoryId: 'cat-smartphones',
    categoryName: 'Smartphones',
    badge: 'AI Powered',
    description: 'The pinnacle of mobile productivity featuring built-in Galaxy AI with real-time Live Translate, Note Assist, Generative Photo Edit, and Circle to Search with Google. Encased in a rugged Titanium frame with anti-reflective Corning Gorilla Armor glass and embedded S-Pen stylus.',
    shortDescription: 'Galaxy AI, Titanium frame, 200MP camera system, Snapdragon 8 Gen 3 for Galaxy.',
    regularPrice: 155000,
    discountPrice: 142000,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80',
    stock: 9,
    sku: 'SAM-S24U-256',
    warranty: '1 Year Samsung Bangladesh Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Complete motherboard and screen servicing with Samsung Smart Care Bangladesh.',
      centers: [
        'Samsung Smart Care, Gulshan-2, Dhaka',
        'Bashundhara City Level 6, Dhaka',
        'GEC Circle, Chattogram'
      ]
    },
    inTheBox: [
      'Samsung Galaxy S24 Ultra 5G',
      'Embedded Bluetooth S-Pen',
      'USB-C to USB-C 3A Cable',
      'Ejection Pin & Quick Start Guide'
    ],
    highlights: [
      'Galaxy AI suite: Circle to Search, Live Call Translation, Note Summary',
      'Stunning 200MP Quad Telephoto camera with 100x Space Zoom',
      'Flat 6.8-inch Dynamic AMOLED 2X with 2600 nits peak brightness',
      'Built-in S-Pen for sketching, remote camera trigger, and handwriting conversion'
    ],
    faqs: [
      {
        question: 'Does this variant have Snapdragon 8 Gen 3 or Exynos?',
        answer: 'All S24 Ultra units globally and at ZEN TACH feature the premium Qualcomm Snapdragon 8 Gen 3 for Galaxy chipset.'
      },
      {
        question: 'How does the anti-reflective Gorilla Armor glass perform outdoors?',
        answer: 'Corning Gorilla Armor reduces ambient surface reflections by up to 75%, making the screen crystal clear even under intense midday sunlight.'
      }
    ],
    specifications: {
      'Display': '6.8-inch Dynamic LTPO AMOLED 2X, 120Hz, 2600 nits, HDR10+',
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'Camera': '200MP Main + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP Ultra-Wide',
      'RAM / Storage': '12GB LPDDR5X / 256GB UFS 4.0',
      'Stylus': 'Embedded Bluetooth Low Energy S-Pen',
      'Battery': '5000 mAh, 45W Fast Wired, 15W Wireless Charging',
      'Frame': 'Titanium Frame with IP68 dust/water protection'
    },
    colors: [
      { name: 'Titanium Gray', hex: '#777571' },
      { name: 'Titanium Black', hex: '#222222' },
      { name: 'Titanium Violet', hex: '#584E69' }
    ],
    frequentlyBoughtWith: ['prod-sony-wf1000xm5', 'prod-anker-737-powerbank'],
    bundleDiscountPct: 12,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: 'active',
    rating: 4.8,
    reviewCount: 34,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-pixel-9-pro-xl',
    name: 'Google Pixel 9 Pro XL (16GB / 256GB)',
    slug: 'google-pixel-9-pro-xl',
    brand: 'Google',
    categoryId: 'cat-smartphones',
    categoryName: 'Smartphones',
    badge: 'Gemini AI',
    description: 'Designed by Google with the powerful Tensor G4 processor and Gemini AI built-in. Features a 6.8" Super Actua display with 3000 nits peak brightness, the iconic camera bar with 50MP triple sensor system, 8K video boost, and 7 years of promised OS and security updates.',
    shortDescription: 'Google Tensor G4, 16GB RAM, Gemini Live assistant, 50MP pro camera bar.',
    regularPrice: 148000,
    discountPrice: 136000,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    sku: 'GGL-P9PXL-256',
    warranty: '1 Year Distributor Replacement Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Distributor',
      coverage: 'Complete hardware parts and replacement warranty handled directly by ZEN TACH Care.',
      centers: [
        'ZEN TACH Care Hub, Multiplan Center Level 4, Dhaka',
        'IDB Bhaban Level 3, Agargaon, Dhaka'
      ]
    },
    inTheBox: [
      'Google Pixel 9 Pro XL',
      '1m USB-C to USB-C Cable (USB 2.0)',
      'Quick Switch Adapter (OTG)',
      'SIM Tool & Safety Guide'
    ],
    highlights: [
      'Google Tensor G4 chip with 16GB RAM for on-device Gemini AI models',
      'Super Actua display delivering blinding 3000 nits brightness',
      'Pro triple camera with 30x Super Res Zoom and 8K Video Boost',
      '7 years of guaranteed Android OS upgrades and Pixel Feature Drops'
    ],
    faqs: [
      {
        question: 'Does Gemini Live work in Bangladesh without a VPN?',
        answer: 'Yes! Google Gemini assistant works natively on the Pixel 9 Pro XL on Bangladeshi Wi-Fi and mobile networks.'
      },
      {
        question: 'Can this record 8K resolution video?',
        answer: 'Yes, using Google’s computational Video Boost cloud-rendering pipeline, you get cinematic 8K footage with superior night sight.'
      }
    ],
    specifications: {
      'Display': '6.8-inch Super Actua LTPO OLED (1344 x 2992), 1-120Hz, 3000 nits',
      'Processor': 'Google Tensor G4 with Titan M2 security coprocessor',
      'RAM / Storage': '16GB LPDDR5X / 256GB UFS 3.1',
      'Camera': '50MP Octa PD Main + 48MP Quad PD Ultra-Wide + 48MP Quad PD 5x Telephoto',
      'Battery': '5060 mAh, 37W fast charging (70% in 30 minutes)',
      'OS': 'Stock Android 15 with 7 years of OS upgrades'
    },
    colors: [
      { name: 'Obsidian Black', hex: '#1D1E20' },
      { name: 'Porcelain White', hex: '#EAE6DF' },
      { name: 'Hazel Green', hex: '#878B82' }
    ],
    frequentlyBoughtWith: ['prod-sony-wf1000xm5', 'prod-anker-737-powerbank'],
    bundleDiscountPct: 10,
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.8,
    reviewCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-macbook-pro-14-m3',
    name: 'Apple MacBook Pro 14" (M3 Pro Chip, 18GB / 512GB)',
    slug: 'apple-macbook-pro-14-m3-pro',
    brand: 'Apple',
    categoryId: 'cat-laptops',
    categoryName: 'Laptops',
    badge: 'Pro Creator',
    description: 'Engineered for extreme creative workloads. Features an Apple M3 Pro 11-core CPU and 14-core GPU with hardware-accelerated ray tracing, Liquid Retina XDR display with up to 1600 nits peak HDR brightness, studio-quality 3-mic array, six-speaker sound system with Spatial Audio, and up to 18 hours of real-world battery life.',
    shortDescription: 'Liquid Retina XDR, M3 Pro 11-core CPU, 18GB Unified Memory, Space Black finish.',
    regularPrice: 265000,
    discountPrice: 249000,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    stock: 5,
    sku: 'MBP-14-M3PRO-BLK',
    warranty: '1 Year Apple International Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Global Apple hardware warranty honored at Apple Authorized Service Providers worldwide and in Bangladesh.',
      centers: [
        'iCenter Bangladesh, Dhanmondi 27, Dhaka',
        'Executive Machines, Banani Road 11, Dhaka',
        'Computer Source, Agrabad, Chattogram'
      ]
    },
    inTheBox: [
      '14-inch MacBook Pro (Space Black)',
      '70W USB-C Power Adapter',
      'USB-C to MagSafe 3 Cable (2m braided color-matched)'
    ],
    highlights: [
      'M3 Pro with 3nm architecture for 3D rendering, video encoding, and Xcode compilation',
      'Liquid Retina XDR display with 1,000,000:1 contrast and 120Hz ProMotion',
      'New Space Black finish with breakthrough anodization seal to reduce fingerprints',
      'Full suite of ports: 3x Thunderbolt 4, HDMI 2.1, SDXC card slot, MagSafe 3'
    ],
    faqs: [
      {
        question: 'Does this come with a US or UK keyboard layout?',
        answer: 'Our units feature the standard international US ANSI keyboard layout with rectangular return key.'
      },
      {
        question: 'Can I connect multiple external monitors?',
        answer: 'Yes! The M3 Pro chip natively supports up to two high-resolution external monitors via Thunderbolt and HDMI.'
      }
    ],
    specifications: {
      'Screen': '14.2-inch Liquid Retina XDR (3024x1964), 120Hz ProMotion, 1600 nits HDR',
      'SoC': 'Apple M3 Pro (11-core CPU, 14-core GPU with hardware ray tracing)',
      'Unified Memory': '18GB Unified RAM (150GB/s bandwidth)',
      'SSD Storage': '512GB Ultra-fast PCIe SSD',
      'Ports': '3x Thunderbolt 4, HDMI 2.1, SDXC card slot, 3.5mm headphone jack, MagSafe 3',
      'Battery': '70Wh lithium-polymer with up to 18 hours battery life'
    },
    colors: [
      { name: 'Space Black', hex: '#1C1C1E' },
      { name: 'Silver', hex: '#E2E2E2' }
    ],
    frequentlyBoughtWith: ['prod-logitech-g-pro-x-superlight-2', 'prod-keychron-k2-pro'],
    bundleDiscountPct: 8,
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 5.0,
    reviewCount: 19,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-asus-rog-zephyrus-g16',
    name: 'ASUS ROG Zephyrus G16 OLED Gaming Laptop',
    slug: 'asus-rog-zephyrus-g16-oled',
    brand: 'ASUS ROG',
    categoryId: 'cat-laptops',
    categoryName: 'Laptops',
    badge: 'RTX 4080 Beast',
    description: 'Precision-crafted CNC aluminum chassis with custom Slash Lighting. Powered by Intel Core Ultra 9 with dedicated Intel AI NPU and NVIDIA GeForce RTX 4080 Laptop GPU with 175W max TGP. Equipped with a groundbreaking 2.5K 240Hz ROG Nebula OLED display with 0.2ms response time.',
    shortDescription: 'Intel Core Ultra 9, RTX 4080 12GB, 2.5K 240Hz OLED Nebula display, 32GB RAM.',
    regularPrice: 320000,
    discountPrice: 295000,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    stock: 4,
    sku: 'ROG-G16-U9-4080',
    warranty: '2 Years Asus Official Global Warranty',
    warrantyDetails: {
      period: '2 Years',
      type: 'Official Brand',
      coverage: '2 years international hardware warranty including thermal liquid metal servicing.',
      centers: [
        'Global Brand Private Limited, Multiplan Center Level 8, Dhaka',
        'Asus Exclusive Service Point, Agrabad, Chattogram'
      ]
    },
    inTheBox: [
      'ASUS ROG Zephyrus G16 (Eclipse Gray)',
      '240W AC Adapter Power Cord',
      'ROG Impact Gaming Mouse (included inside)',
      'ROG Laptop Sleeve & Sticker Pack'
    ],
    highlights: [
      'Intel Core Ultra 9 185H processor with AI Boost NPU',
      'NVIDIA GeForce RTX 4080 12GB GPU with DLSS 3.5 Frame Generation',
      'ROG Nebula OLED display: 2.5K (2560x1600), 240Hz, 0.2ms, G-SYNC',
      'CNC aluminum body only 1.49cm thin and 1.85kg lightweight'
    ],
    faqs: [
      {
        question: 'Does the OLED screen have protection against burn-in?',
        answer: 'Yes, ASUS OLED Care features pixel refresh, pixel shift, and dedicated vapor chamber thermal dissipation to prevent burn-in.'
      }
    ],
    specifications: {
      'Display': '16-inch 2.5K (2560x1600) 240Hz OLED, 0.2ms, 100% DCI-P3, VESA DisplayHDR 500',
      'Processor': 'Intel Core Ultra 9 185H (16 Cores, 22 Threads, up to 5.1GHz)',
      'Graphics': 'NVIDIA GeForce RTX 4080 12GB GDDR6 (115W+25W Dynamic Boost)',
      'RAM': '32GB LPDDR5X-7467MHz Dual Channel',
      'Storage': '1TB PCIe 4.0 NVMe M.2 SSD + empty M.2 expansion slot',
      'Cooling': 'ROG Intelligent Cooling with liquid metal and 2nd Gen Arc Flow Fans'
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-sony-wf1000xm5',
    name: 'Sony WF-1000XM5 Wireless Noise Cancelling Earbuds',
    slug: 'sony-wf-1000xm5-earbuds',
    brand: 'Sony',
    categoryId: 'cat-earbuds',
    categoryName: 'Earbuds & Audio',
    badge: 'Industry Best ANC',
    description: 'Industry-leading Active Noise Cancellation with two proprietary processors and dual feedback microphones. Specially designed Dynamic Driver X for wide frequency reproduction, LDAC Hi-Res Audio wireless, AI-based bone-conduction noise reduction for crystal clear calls, and 24-hour total battery life.',
    shortDescription: 'Top-tier ANC, Dynamic Driver X, LDAC Hi-Res Audio, 24-hour battery with wireless charging case.',
    regularPrice: 34000,
    discountPrice: 29500,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    stock: 22,
    sku: 'SNY-WF-XM5-BLK',
    warranty: '1 Year Sony Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Complete replacement and acoustic driver repair coverage.',
      centers: [
        'Sony Rangs Bangladesh Service Center, Sonargaon Road, Dhaka',
        'Bashundhara City Level 4, Dhaka'
      ]
    },
    inTheBox: [
      'Sony WF-1000XM5 Earbuds (Left & Right)',
      'Qi Wireless Charging Case',
      '4 sizes of Noise Isolation Earbud Tips (SS, S, M, L)',
      'USB-C Charging Cable (20cm)'
    ],
    highlights: [
      'HD Noise Cancelling Processor QN2e and Integrated Processor V2',
      '8.4mm Dynamic Driver X delivers deep bass and airy highs',
      'Bone conduction sensors and AI DNN algorithm for noiseless phone calls',
      'Multipoint connection: pair to phone and laptop simultaneously'
    ],
    faqs: [
      {
        question: 'Are these compatible with both iPhone and Android?',
        answer: 'Yes! Sony Headphones Connect app is available for both iOS and Android with customized EQ and Speak-to-Chat.'
      }
    ],
    specifications: {
      'ANC': 'Dual Processor QN2e + V2 with 6 microphones total',
      'Drivers': '8.4 mm Dynamic Driver X',
      'Bluetooth': 'Version 5.3, Codecs: LDAC, LC3, AAC, SBC',
      'Battery': '8 hrs earbuds + 16 hrs charging case (ANC on)',
      'Quick Charge': '3-minute charge delivers 60 minutes playtime',
      'Water Resistance': 'IPX4 splash and sweat resistance'
    },
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Silver', hex: '#DCDCDC' }
    ],
    frequentlyBoughtWith: ['prod-anker-737-powerbank'],
    bundleDiscountPct: 10,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: 'active',
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-airpods-pro-2-usbc',
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    slug: 'apple-airpods-pro-2-usb-c',
    brand: 'Apple',
    categoryId: 'cat-earbuds',
    categoryName: 'Earbuds & Audio',
    badge: 'Best Seller',
    description: 'Up to 2x more Active Noise Cancellation than the previous generation. Adaptive Audio intuitively blends Transparency and Active Noise Cancellation tailored to your environment. Personalized Spatial Audio with dynamic head tracking, Precision Finding case with built-in speaker and lanyard loop.',
    shortDescription: 'H2 chip, Adaptive Audio, 2x better ANC, Precision Finding case with speaker and USB-C.',
    regularPrice: 32000,
    discountPrice: 28500,
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    sku: 'APL-APP2-USBC',
    warranty: '1 Year Apple Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Direct replacement via Apple Authorized Service Providers.',
      centers: [
        'iCenter Bangladesh, Dhanmondi 27, Dhaka',
        'Executive Machines, Banani Road 11, Dhaka'
      ]
    },
    inTheBox: [
      'AirPods Pro (2nd Generation)',
      'MagSafe Charging Case (USB-C) with speaker & lanyard loop',
      'Silicone ear tips (four sizes: XS, S, M, L)',
      'USB-C Charge Cable'
    ],
    highlights: [
      'Apple-designed H2 chip delivers advanced acoustic performance',
      'Adaptive Audio and Conversation Awareness automatically quiet down audio when speaking',
      'MagSafe Case supports USB-C, Apple Watch puck, MagSafe, and Qi charging',
      'IP54 dust, sweat, and water resistance for both earbuds and case'
    ],
    faqs: [
      {
        question: 'Can I track the case if misplaced?',
        answer: 'Yes! The U1 chip inside the case allows Precision Finding in the Apple Find My app with directional arrow guidance and sound alert.'
      }
    ],
    specifications: {
      'Chip': 'Apple H2 headphone chip, U1 in MagSafe Case',
      'Audio Features': 'Personalized Spatial Audio with dynamic head tracking, Adaptive EQ',
      'Microphones': 'Dual beamforming microphones, inward-facing microphone',
      'Battery': 'Up to 6 hours listening on single charge (30 hours with case)'
    },
    frequentlyBoughtWith: ['prod-iphone-16-pro-max', 'prod-baseus-gan5-100w'],
    bundleDiscountPct: 10,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: 'active',
    rating: 4.9,
    reviewCount: 65,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-marshall-emberton-2',
    name: 'Marshall Emberton II Portable Bluetooth Speaker',
    slug: 'marshall-emberton-2-bluetooth-speaker',
    brand: 'Marshall',
    categoryId: 'cat-earbuds',
    categoryName: 'Earbuds & Audio',
    badge: '30+ Hours Battery',
    description: 'The Emberton II delivers signature Marshall sound with 360° True Stereophonic multi-directional sound. Packing 30+ hours of portable playtime on a single charge, rugged IP67 dust and waterproof build, and Stack Mode to connect multiple Emberton II speakers together for massive sound.',
    shortDescription: '30+ hours playtime, IP67 waterproof, True Stereophonic 360° sound, Stack Mode.',
    regularPrice: 22500,
    discountPrice: 19800,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    sku: 'MSH-EMB2-BLK',
    warranty: '1 Year Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Full speaker component and battery service.',
      centers: ['ZEN TACH Audio Lab, Multiplan Center Level 4, Dhaka']
    },
    inTheBox: [
      'Marshall Emberton II Speaker',
      'USB-C Charging Cable',
      'User Manual & Legal Information'
    ],
    highlights: [
      'Signature Marshall heavy bass and room-filling True Stereophonic audio',
      'Massive 30+ hours of continuous playtime from a single 3-hour charge',
      'Tough as nails with IP67 rating — can be submerged in 1m water for 30 mins',
      'Stack Mode: Amplify sound by linking multiple Marshall speakers wirelessly'
    ],
    faqs: [
      {
        question: 'Is it completely waterproof for pool and outdoor rain use?',
        answer: 'Yes! It has an IP67 rating meaning it is completely dust-tight and can survive immersion in water up to 1 meter deep.'
      }
    ],
    specifications: {
      'Frequency Range': '60 Hz – 20,000 Hz',
      'Amplifiers': 'Two 10 W Class D amplifiers for the two 2" full range drivers',
      'Max Sound Pressure': '87 dB SPL @ 1 m',
      'Bluetooth': '5.1 with 10m range',
      'Battery Playtime': '30+ hours, Quick charge: 20 mins for 4 hours playback'
    },
    colors: [
      { name: 'Black and Brass', hex: '#B59449' },
      { name: 'Cream', hex: '#EBE6DE' }
    ],
    featured: false,
    bestSeller: true,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 23,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2 (Titanium Case with Trail Loop)',
    slug: 'apple-watch-ultra-2',
    brand: 'Apple',
    categoryId: 'cat-smartwatches',
    categoryName: 'Smartwatches',
    badge: 'Titanium Rugged',
    description: 'The most capable and rugged Apple Watch ever. Features a lightweight 49mm titanium case, the brightest Apple display ever at 3000 nits, precision dual-frequency GPS, Double Tap gesture control, depth gauge with water temperature sensor, and up to 72 hours battery life in Low Power Mode.',
    shortDescription: '49mm Titanium case, 3000 nits display, S9 SiP chip, 100m water resistance, Cellular.',
    regularPrice: 110000,
    discountPrice: 98000,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    stock: 7,
    sku: 'APL-AWU2-49TI',
    warranty: '1 Year Apple Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Complete hardware and sensor coverage.',
      centers: [
        'iCenter Bangladesh, Dhanmondi 27, Dhaka',
        'Executive Machines, Banani Road 11, Dhaka'
      ]
    },
    inTheBox: [
      'Apple Watch Ultra 2 (49mm Titanium)',
      'Trail Loop Band (S/M or M/L)',
      'Apple Watch Magnetic Fast Charger to USB-C Cable (1m braided)'
    ],
    highlights: [
      'Aerospace-grade 49mm titanium case with raised sapphire front crystal',
      'Blinding 3000 nits Always-On Retina OLED display with Night Mode',
      'Precision Dual-frequency GPS (L1 and L5) for impossible satellite environments',
      'Action Button customizable for workouts, compass waypoints, and 86dB siren'
    ],
    faqs: [
      {
        question: 'Can I scuba dive with this watch?',
        answer: 'Yes! It is EN13319 certified and functions as a full-featured dive computer with the Oceanic+ app down to 40 meters.'
      }
    ],
    specifications: {
      'Case': '49mm Aerospace-grade Titanium',
      'Display': 'Always-On Retina OLED, 3000 nits peak, flat sapphire crystal',
      'Water Rating': '100m water resistant, high-speed water sports & recreational dive to 40m',
      'Sensors': 'Electrical heart sensor (ECG), Blood oxygen, Depth gauge, Water temp sensor',
      'Battery': 'Up to 36 hours normal use (72 hours Low Power Mode)'
    },
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 16,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-keychron-k2-pro',
    name: 'Keychron K2 Pro QMK/VIA Wireless Mechanical Keyboard',
    slug: 'keychron-k2-pro-wireless-keyboard',
    brand: 'Keychron',
    categoryId: 'cat-keyboards',
    categoryName: 'Keyboards & Mice',
    badge: 'Hot-Swappable',
    description: '75% compact wireless mechanical keyboard with full QMK/VIA keymap programmability. Hot-swappable PCB allows switch swaps without soldering. Features south-facing RGB backlighting, sound-absorbing foam, screw-in PCB stabilizers, and pre-lubed Keychron K Pro mechanical switches.',
    shortDescription: '75% layout, Bluetooth 5.1 & Type-C, hot-swappable, QMK/VIA support, Mac & Windows.',
    regularPrice: 12500,
    discountPrice: 10800,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    sku: 'KC-K2PRO-RGB-RED',
    warranty: '1 Year Distributor Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Distributor',
      coverage: 'PCB, bluetooth controller and switch socket replacement.',
      centers: ['ZEN TACH Keyboard Center, Multiplan Center Level 4, Dhaka']
    },
    inTheBox: [
      'Fully Assembled Keychron K2 Pro Keyboard',
      'Type-A to Type-C Cable',
      'Switch Puller & Keycap Puller',
      'Screwdriver & Extra Mac/Win Keycaps'
    ],
    highlights: [
      'Full QMK/VIA support: remap any key or create macros on browser without installing software',
      'Hot-swappable sockets compatible with almost all 3-pin and 5-pin MX mechanical switches',
      'Pre-lubed Keychron K Pro switches with south-facing RGB lighting',
      '4000mAh battery offering up to 300 hours typing without RGB'
    ],
    faqs: [
      {
        question: 'Does this come with Mac keycaps installed?',
        answer: 'Yes! It has Mac keys pre-installed and extra Windows keys included in the box with a hardware toggle switch.'
      }
    ],
    specifications: {
      'Layout': '75% (84 keys)',
      'Switches': 'Keychron K Pro Red (Linear) / Brown (Tactile)',
      'Keycaps': 'Double-shot OSA PBT Keycaps (non-shine-through)',
      'Connectivity': 'Bluetooth 5.1 & Wired Type-C (1000Hz polling rate in wired)',
      'Battery': '4000 mAh rechargeable lithium-polymer'
    },
    variants: [
      { name: 'Switch Type', options: ['K Pro Red (Linear)', 'K Pro Brown (Tactile)', 'K Pro Blue (Clicky)'] }
    ],
    frequentlyBoughtWith: ['prod-logitech-g-pro-x-superlight-2'],
    bundleDiscountPct: 10,
    featured: false,
    bestSeller: true,
    newArrival: false,
    status: 'active',
    rating: 4.8,
    reviewCount: 38,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-logitech-g-pro-x-superlight-2',
    name: 'Logitech G PRO X SUPERLIGHT 2 Wireless Esports Gaming Mouse',
    slug: 'logitech-g-pro-x-superlight-2',
    brand: 'Logitech',
    categoryId: 'cat-keyboards',
    categoryName: 'Keyboards & Mice',
    badge: '60g Featherlight',
    description: 'Weighing only 60 grams, the G PRO X SUPERLIGHT 2 is the choice of world champion esports athletes. Features LIGHTFORCE hybrid optical-mechanical switches, HERO 2 sensor with up to 32,000 DPI and 2,000Hz polling rate, USB-C fast charging, and zero-additive PTFE feet.',
    shortDescription: '60 grams featherlight, HERO 2 32K DPI sensor, 2K polling rate, 95h battery life.',
    regularPrice: 17500,
    discountPrice: 15200,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    stock: 16,
    sku: 'LOG-GPX2-WHT',
    warranty: '2 Years Official Logitech Warranty',
    warrantyDetails: {
      period: '2 Years',
      type: 'Official Brand',
      coverage: 'Complete replacement warranty against double-click and sensor faults.',
      centers: [
        'Logitech Customer Care, Multiplan Center Level 5, Dhaka',
        'IDB Bhaban Level 2, Agargaon, Dhaka'
      ]
    },
    inTheBox: [
      'PRO X SUPERLIGHT 2 Wireless Mouse',
      'LIGHTSPEED USB wireless receiver adapter',
      'USB-A to USB-C Charging / Data cable',
      'Optional grip tape & PTFE aperture door'
    ],
    highlights: [
      '60-gram ultra-lightweight design with no honeycomb holes',
      'HERO 2 sensor tracking over 500 IPS up to 32,000 DPI without smoothing',
      'LIGHTFORCE optical switches eliminate double-clicking while maintaining mechanical feel',
      '95 hours of continuous motion battery life with USB-C recharge'
    ],
    faqs: [
      {
        question: 'Does this mouse suffer from double-clicking after months of usage?',
        answer: 'No! The new LIGHTFORCE hybrid optical-mechanical switches eliminate electrical debouncing issues completely.'
      }
    ],
    specifications: {
      'Weight': '60 grams',
      'Sensor': 'HERO 2 (100 – 32,000 DPI)',
      'Max Acceleration': '>40G, >500 IPS',
      'Report Rate': '2000Hz (0.5 ms response)',
      'Battery': 'Up to 95 hours constant motion'
    },
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Magenta', hex: '#D91B5C' }
    ],
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 22,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-anker-737-powerbank',
    name: 'Anker 737 Power Bank (PowerCore 24K, 140W Fast Output)',
    slug: 'anker-737-powerbank-140w',
    brand: 'Anker',
    categoryId: 'cat-powerbanks',
    categoryName: 'Power Banks & Chargers',
    badge: '140W PD 3.1',
    description: 'Equipped with the latest Power Delivery 3.1 and bi-directional technology to quickly recharge the portable charger or deliver a 140W ultra-powerful charge to high-end laptops. Smart digital display shows real-time input/output wattage, estimated recharge time, and battery percentage.',
    shortDescription: '24,000mAh capacity, 140W bi-directional PD 3.1, smart digital color display.',
    regularPrice: 16500,
    discountPrice: 13900,
    images: [
      'https://images.unsplash.com/photo-1609592426804-9a8c148bb66a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1609592426804-9a8c148bb66a?auto=format&fit=crop&w=600&q=80',
    stock: 19,
    sku: 'ANK-737-24K',
    warranty: '18 Months Anker Official Replacement Warranty',
    warrantyDetails: {
      period: '18 Months',
      type: 'Official Brand',
      coverage: 'Complete replacement warranty for power bank and display.',
      centers: [
        'Anker Bangladesh Flagship Store, Jamuna Future Park Level 4, Dhaka',
        'Bashundhara City Level 5, Dhaka'
      ]
    },
    inTheBox: [
      'Anker 737 Power Bank (PowerCore 24K)',
      '140W USB-C to USB-C Cable (0.6m)',
      'Velvet travel pouch',
      'Welcome Guide'
    ],
    highlights: [
      'Ultra-powerful two-way charging with Power Delivery 3.1 up to 140W',
      'Huge 24,000mAh capacity charges an iPhone 16 almost 5 times or MacBook Pro once',
      'Smart digital display reveals battery capacity, cycles, and port wattage',
      'ActiveShield 2.0 temperature sensor monitors heat 3 million times per day'
    ],
    faqs: [
      {
        question: 'Can I take this on an airplane flight?',
        answer: 'Yes! At 86.4Wh, it is well below the FAA/Biman 100Wh carry-on battery restriction limit.'
      }
    ],
    specifications: {
      'Capacity': '24,000 mAh (86.4Wh)',
      'Max Output': '140W single port (can charge MacBook Pro 16" to 50% in 40 mins)',
      'Ports': '2x USB-C PD 3.1 (140W max), 1x USB-A (18W)',
      'Recharge Time': 'Recharges to 100% in just 52 minutes with 140W input'
    },
    featured: false,
    bestSeller: true,
    newArrival: false,
    status: 'active',
    rating: 4.9,
    reviewCount: 51,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-baseus-gan5-100w',
    name: 'Baseus GaN5 Pro 100W Fast Desktop Charger 4-Port',
    slug: 'baseus-gan5-pro-100w-charger',
    brand: 'Baseus',
    categoryId: 'cat-powerbanks',
    categoryName: 'Power Banks & Chargers',
    badge: 'Compact GaN',
    description: 'Upgraded GaN5 technology delivers higher power conversion and thermal dissipation in an ultra-compact body. Simultaneously powers laptop, tablet, smartphone and smartwatch with 2x Type-C and 2x USB-A ports.',
    shortDescription: '100W GaN5 Pro technology, 4-in-1 multi-port, BPS II dynamic power distribution.',
    regularPrice: 6500,
    discountPrice: 5200,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80',
    stock: 35,
    sku: 'BAS-GAN5-100W',
    warranty: '6 Months Replacement Warranty',
    warrantyDetails: {
      period: '6 Months',
      type: 'Distributor',
      coverage: 'Immediate one-to-one replacement in case of circuit failure.',
      centers: ['ZEN TACH Care, Multiplan Center Level 4, Dhaka']
    },
    inTheBox: [
      'Baseus GaN5 Pro 100W Desktop Charger',
      '1.5m AC Extension Power Cable',
      '100W Type-C to Type-C braided fast cable (1m)'
    ],
    highlights: [
      'Dual Type-C 100W output for full-speed MacBook & Windows laptop charging',
      'GaN5 Pro cooling architecture runs 10°C cooler than legacy silicon chargers',
      'BPS II dynamic allocation automatically distributes optimal power to 4 devices',
      'Comprehensive safety protections: surge, over-voltage, short-circuit, over-current'
    ],
    faqs: [
      {
        question: 'Does it support Samsung 45W Super Fast Charging 2.0?',
        answer: 'Yes! It fully supports PPS 45W for Galaxy S24 Ultra and S23 Ultra.'
      }
    ],
    specifications: {
      'Total Output': '100W Max',
      'Ports': '2x USB-C (100W max each) + 2x USB-A (60W max each)',
      'Input': 'AC 100V-240V 50/60Hz 2.5A Max',
      'Dimensions': '85.6 x 40.7 x 37.8 mm (weight 288g)'
    },
    featured: false,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.7,
    reviewCount: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-lg-ultragear-27',
    name: 'LG UltraGear 27GP850-B 27" QHD Nano IPS 165Hz Gaming Monitor',
    slug: 'lg-ultragear-27gp850-b-qhd-165hz',
    brand: 'LG',
    categoryId: 'cat-monitors',
    categoryName: 'Monitors',
    badge: 'Nano IPS 1ms',
    description: 'Immerse in breathtaking gaming visuals with Nano IPS 1ms GtG response time, QHD (2560 x 1440) resolution, 165Hz (O/C 180Hz) refresh rate, DCI-P3 98% color gamut, and VESA DisplayHDR 400 support with NVIDIA G-SYNC compatibility and AMD FreeSync Premium.',
    shortDescription: '27" QHD Nano IPS, 165Hz (180Hz O/C), 1ms GtG, DCI-P3 98%, G-SYNC Compatible.',
    regularPrice: 48000,
    discountPrice: 43500,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    stock: 6,
    sku: 'LG-27GP850-B',
    warranty: '3 Years LG Official Warranty',
    warrantyDetails: {
      period: '3 Years',
      type: 'Official Brand',
      coverage: '3 years panel, parts, and labor warranty with LG Butterfly Bangladesh.',
      centers: [
        'LG Electronics Bangladesh, Motijheel C/A, Dhaka',
        'Multiplan Center Level 9, Elephant Road, Dhaka'
      ]
    },
    inTheBox: [
      'LG 27GP850-B Monitor Screen',
      'Ergonomic Tilt/Pivot/Height Adjustable Stand',
      'DisplayPort Cable & HDMI Cable',
      'USB 3.0 Upstream Cable & Power Adapter'
    ],
    highlights: [
      'Nano IPS with true 1ms GtG eliminates ghosting and motion blur',
      '180Hz overclocked refresh rate for silky esports performance',
      'DCI-P3 98% color spectrum for color-accurate photo and video editing',
      'Pivot stand allows 90° portrait orientation for coding and reading'
    ],
    faqs: [
      {
        question: 'Does this monitor come with built-in speakers?',
        answer: 'No internal speakers, but it features a 3.5mm audio passthrough jack for external headphones or desktop speakers.'
      }
    ],
    specifications: {
      'Size & Panel': '27-inch Nano IPS Anti-Glare (2560 x 1440 QHD)',
      'Refresh Rate': '165Hz (Overclockable to 180Hz)',
      'Response Time': '1ms (GtG at Faster mode)',
      'Color Gamut': 'DCI-P3 98% (CIE1976), 1.07 Billion Colors',
      'Sync': 'NVIDIA G-SYNC Compatible, AMD FreeSync Premium'
    },
    featured: false,
    bestSeller: false,
    newArrival: false,
    status: 'active',
    rating: 4.9,
    reviewCount: 31,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-samsung-odyssey-g9',
    name: 'Samsung Odyssey OLED G9 (49" Dual QHD 240Hz Curved)',
    slug: 'samsung-odyssey-oled-g9-49-curved',
    brand: 'Samsung',
    categoryId: 'cat-monitors',
    categoryName: 'Monitors',
    badge: 'Ultimate Ultrawide',
    description: 'The world’s premier 49" curved OLED gaming display. Featuring Dual QHD (5120 x 1440) 32:9 aspect ratio — equivalent to two 27" QHD monitors side by side with zero bezel. Powered by Neo Quantum Processor Pro with 0.03ms response time, 240Hz refresh rate, and CoreSync RGB bias lighting.',
    shortDescription: '49" Dual QHD OLED 32:9, 240Hz, 0.03ms response, Neo Quantum Processor Pro.',
    regularPrice: 215000,
    discountPrice: 198000,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    stock: 3,
    sku: 'SAM-ODYSSEY-G9',
    warranty: '3 Years Samsung Official Warranty',
    warrantyDetails: {
      period: '3 Years',
      type: 'Official Brand',
      coverage: 'Comprehensive panel, motherboard, and power supply warranty.',
      centers: [
        'Samsung Smart Care Flagship, Gulshan-2, Dhaka',
        'Bashundhara City Level 6, Dhaka'
      ]
    },
    inTheBox: [
      'Samsung 49" Odyssey OLED G9 Display',
      'Height Adjustable Ergonomic Stand',
      'DisplayPort Cable, Micro HDMI to HDMI, USB Cable',
      'Remote Controller & VESA Wall Mount Bracket'
    ],
    highlights: [
      'Dual QHD (5120x1440) 32:9 curvature envelops your field of view',
      'OLED panel with 0.03ms response time and 240Hz refresh rate',
      'Samsung Smart Hub built-in: stream YouTube, Netflix without a PC',
      'CoreSync lighting matches on-screen game colors onto your back wall'
    ],
    faqs: [
      {
        question: 'Can I split screen two separate PCs or a Mac and PS5 simultaneously?',
        answer: 'Yes! Built-in Picture-by-Picture (PBP) and Picture-in-Picture (PIP) allow running two inputs side-by-side at native resolution.'
      }
    ],
    specifications: {
      'Screen Size': '49-inch Curved 1800R OLED',
      'Resolution': 'Dual QHD (5,120 x 1,440) 32:9',
      'Refresh Rate': '240Hz, 0.03ms (GtG)',
      'Brightness': '250 cd/m2 (typ), DisplayHDR True Black 400',
      'Audio': '5W x 2 built-in speakers'
    },
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 5.0,
    reviewCount: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-dji-mini-4-pro',
    name: 'DJI Mini 4 Pro Drone (Fly More Combo Plus with RC 2 Screen)',
    slug: 'dji-mini-4-pro-drone-fly-more-combo',
    brand: 'DJI',
    categoryId: 'cat-gaming',
    categoryName: 'Gaming & Drones',
    badge: 'Under 249g',
    description: 'Under 249 grams regulation-friendly mini drone with omnidirectional obstacle sensing, 4K/60fps HDR true vertical video shooting, D-Log M color profile, and up to 45 minutes of extended flight time per Intelligent Flight Battery Plus. Includes DJI RC 2 remote with built-in 5.5" 1080p FHD screen.',
    shortDescription: 'Under 249g, 4K/60fps HDR vertical shooting, omnidirectional sensing, 3x batteries.',
    regularPrice: 135000,
    discountPrice: 122000,
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    stock: 7,
    sku: 'DJI-M4P-FMC-RC2',
    warranty: '1 Year DJI Official Warranty',
    warrantyDetails: {
      period: '1 Year',
      type: 'Official Brand',
      coverage: 'Gimbal, camera, flight controller, and RC 2 repair coverage.',
      centers: ['ZEN TACH Drone Services, Multiplan Center Level 4, Dhaka']
    },
    inTheBox: [
      'DJI Mini 4 Pro Aircraft',
      'DJI RC 2 Remote Controller with 1080p Screen',
      '3x Intelligent Flight Battery Plus',
      'Two-Way Charging Hub & Shoulder Carrying Bag',
      '3x Pairs Spare Propellers & Screwdriver'
    ],
    highlights: [
      'Under 249g lightweight design — minimal flight clearance required',
      'Omnidirectional Active Obstacle Sensing for safe autonomous tracking',
      '4K/60fps HDR and 4K/100fps slow-motion with true vertical camera rotation',
      'O4 video transmission sends crystal clear 1080p/60fps feed up to 20km'
    ],
    faqs: [
      {
        question: 'Does the remote controller require a smartphone to operate?',
        answer: 'No! The DJI RC 2 controller features a dedicated ultra-bright 700-nit 5.5-inch 1080p display and runs the DJI Fly app directly.'
      }
    ],
    specifications: {
      'Weight': '<249 grams with standard battery (~290g with Plus battery)',
      'Camera': '1/1.3-inch CMOS Sensor, 48MP, f/1.7 aperture, Dual Native ISO',
      'Video Resolution': '4K HDR up to 60fps, 4K slow-mo up to 100fps, FHD up to 200fps',
      'Flight Time': 'Up to 45 minutes per Intelligent Flight Battery Plus',
      'Transmission': 'DJI O4 HD Video Transmission (up to 20 km)'
    },
    featured: true,
    bestSeller: false,
    newArrival: true,
    status: 'active',
    rating: 4.9,
    reviewCount: 18,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'The Future of Mobile Intelligence',
    subtitle: 'Experience iPhone 16 Pro Max, Galaxy S24 Ultra & Pixel 9 Pro XL with genuine warranty and fast Cash on Delivery across Bangladesh.',
    tag: 'Flagship Arrivals',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Explore Smartphones',
    ctaLink: 'smartphones',
    active: true,
    order: 1
  },
  {
    id: 'banner-2',
    title: 'Pro Creative & Gaming Powerhouses',
    subtitle: 'MacBook Pro M3 Pro & ROG Zephyrus G16 with zero compromise on thermal performance.',
    tag: 'Next-Gen Laptops',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Browse Laptops',
    ctaLink: 'laptops',
    active: true,
    order: 2
  },
  {
    id: 'banner-3',
    title: 'Hi-Fi Audio & Smart Wearables',
    subtitle: 'Sony WF-1000XM5 ANC earbuds, Marshall Emberton II, and Keychron mechanical keyboards in stock.',
    tag: 'Audio & Gadgets',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1600&q=80',
    ctaText: 'Shop Accessories',
    ctaLink: 'earbuds',
    active: true,
    order: 3
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coupon-zen10',
    code: 'ZEN10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 5000,
    maxDiscount: 2500,
    expiryDate: '2027-12-31',
    usageLimit: 500,
    timesUsed: 12,
    active: true
  },
  {
    id: 'coupon-welcome500',
    code: 'WELCOME500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    expiryDate: '2027-12-31',
    usageLimit: 1000,
    timesUsed: 45,
    active: true
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  id: 'main-settings',
  storeName: 'ZEN TACH',
  phone: '01705285855',
  email: 'prorabbiv@gmail.com',
  address: 'Bashundhara City / Multiplan Center, Dhaka, Bangladesh',
  currency: 'BDT (৳)',
  deliveryDhaka: 60,
  deliveryOutside: 120,
  freeDeliveryThreshold: 20000,
  announcement: '🔥 Free delivery in Dhaka on orders above ৳20,000 | Official Warranty on all authentic tech gadgets!',
  announcementEnabled: true
};
